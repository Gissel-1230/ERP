// components/traspasos/AddTraspasoModal.tsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import { getAlmacenes } from '@/lib/almacen-store'; 
import { requestTraspaso } from '@/lib/traspasos-store';
import { type Almacen, type Inventario, type Producto, type GlobalProduct } from '@/lib/data'; // Asegúrate de importar GlobalProduct
import { useAuth } from '@/app/context/AuthContext'; 
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interfaz para los datos que enviará la API
export interface AddTraspasoData {
    product_id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    quantity: number;
}

// --- 👇 INTERFAZ DE PROPS CORREGIDA (SOLUCIONA EL ERROR TS2322) 👇 ---
interface AddTraspasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Propiedad de guardado/envío ahora se llama onSubmit
  onSubmit: (data: AddTraspasoData) => Promise<void>; 
  
  // Datos maestros que vienen del page.tsx
  almacenes: Almacen[];
  productos: GlobalProduct[];
  currentUserId?: number; 
}

// Nota: Hemos eliminado las funciones 'getAlmacenes' y 'getProducts' de este modal 
// porque los datos ya vienen precargados de la página principal (TraspasosPage).

export default function AddTraspasoModal({ 
    isOpen, 
    onClose, 
    onSubmit, // Recibimos la prop renombrada
    almacenes, 
    productos,
    currentUserId 
}: AddTraspasoModalProps) {
  
  const { token } = useAuth();
  
  // Estados para el formulario
  const [loadingData, setLoadingData] = useState(false); // Mantener para la carga del modal
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  // --- Efecto de Limpieza ---
  useEffect(() => {
    if (!isOpen) {
      setFromWarehouseId(''); setToWarehouseId(''); setProductId('');
      setQuantity(''); setError(null);
    }
  }, [isOpen]);

  // --- LÓGICA FILTRADA (usa useMemo para eficiencia) ---
  
  // Almacenes Destino
  const almacenesDestino = useMemo(() => {
      if (!fromWarehouseId) return [];
      return almacenes.filter(a => a.id !== fromWarehouseId);
  }, [fromWarehouseId, almacenes]);
  
  // Productos Disponibles (con Stock > 0 en el almacén de origen)
  const productosDisponibles = useMemo(() => {
      if (!fromWarehouseId) return [];
      const almacenOrigen = almacenes.find(a => a.id === fromWarehouseId);
      if (!almacenOrigen) return [];
      
      // Aplanamos todos los productos de todas las categorías (inventarios) de ESE almacén
      return almacenOrigen.inventarios
          .flatMap(inv => inv.productos)
          .filter(prod => prod.cantidad > 0);
  }, [fromWarehouseId, almacenes]);

  // Limpiar el producto si el almacén de origen cambia
  useEffect(() => {
      setProductId('');
  }, [fromWarehouseId]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    // --- 1. Limpieza de IDs y Validación ---
    const rawProductId = String(productId).split('-')[1];
    const rawFromId = fromWarehouseId.split('-')[1];
    const rawToId = toWarehouseId.split('-')[1];
    const quantityNum = parseInt(quantity, 10);

    // Validación
    if (!rawProductId || !rawFromId || !rawToId || !quantityNum || quantityNum <= 0) {
        setError("Todos los campos son obligatorios y la cantidad debe ser positiva.");
        setIsSaving(false);
        return;
    }

    // Validación de Stock antes de enviar
    const productoSeleccionado = productosDisponibles.find(p => p.id === productId);
    if (!productoSeleccionado || quantityNum > productoSeleccionado.cantidad) {
        setError(`Stock insuficiente. Disponible: ${productoSeleccionado?.cantidad || 0}`);
        setIsSaving(false);
        return;
    }

    try {
        // 2. Llamada a la prop onSubmit (que maneja la lógica de la API en el padre)
        await onSubmit({
            product_id: parseInt(rawProductId, 10),
            from_warehouse_id: parseInt(rawFromId, 10),
            to_warehouse_id: parseInt(rawToId, 10),
            quantity: quantityNum
        });
        
        // El padre llama a onSave() para refrescar y luego cierra el modal.

    } catch (err: any) {
        // Muestra errores (ej. "Stock insuficiente" si el back-end lo valida de nuevo)
        setError(err.message || "Error al enviar la solicitud.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold">Solicitar Traspaso de Stock</h2>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        {loadingData && <p className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin" /></p>}

        {(!loadingData && almacenes.length > 0) && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* SELECCIÓN DE ORIGEN Y DESTINO */}
            <div className="grid grid-cols-2 gap-4">
              {/* LADO: ORIGEN */}
              <div className="space-y-4 rounded-md border p-4 dark:border-slate-700">
                <h3 className="font-semibold">Origen</h3>
                <div>
                  <label>Almacén de Salida</label>
                  <select value={fromWarehouseId} onChange={(e) => setFromWarehouseId(e.target.value)} required className="w-full rounded-lg">
                    <option value="">Seleccione...</option>
                    {almacenes.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
                  </select>
                </div>
              </div>
              
              {/* LADO: DESTINO */}
              <div className="space-y-4 rounded-md border p-4 dark:border-slate-700">
                <h3 className="font-semibold">Destino</h3>
                <div>
                  <label>Almacén de Entrada</label>
                  <select value={toWarehouseId} onChange={(e) => setToWarehouseId(e.target.value)} required disabled={!fromWarehouseId} className="w-full rounded-lg">
                    <option value="">Seleccione...</option>
                    {almacenesDestino.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* SELECCIÓN DE PRODUCTO Y CANTIDAD */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label>Producto a Mover</label>
                <select 
                  value={productId} 
                  onChange={(e) => setProductId(e.target.value)} 
                  required 
                  disabled={!fromWarehouseId || productosDisponibles.length === 0} 
                  className="w-full rounded-lg"
                >
                  <option value="">{fromWarehouseId ? "Seleccione producto..." : "Seleccione almacén de salida"}</option>
                  {productosDisponibles.map(p => (
                      <option key={p.id} value={p.id}>
                          {p.nombre} (Stock: {p.cantidad})
                      </option>
                  ))}
                </select>
                {productosDisponibles.length === 0 && fromWarehouseId &&
                    <p className="text-xs text-orange-500 mt-1">Este almacén no tiene productos con stock.</p>
                }
              </div>
              <div>
                <label>Cantidad</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full rounded-lg" min="1" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
              <Button type="submit" disabled={isSaving || loadingData}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Solicitar Traspaso"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}