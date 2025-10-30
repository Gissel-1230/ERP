// components/traspasos/AddTraspasoModal.tsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import { type Almacen, type GlobalProduct } from '@/lib/data';
import { useAuth } from '@/app/context/AuthContext'; 
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interfaz actualizada con los nuevos campos
export interface AddTraspasoData {
    product_id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    quantity: number;
    carrier?: string; // Transportista (opcional)
    observations?: string; // Observaciones (opcional)
}

interface AddTraspasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddTraspasoData) => Promise<void>; 
  almacenes: Almacen[];
  productos: GlobalProduct[];
  currentUserId?: number; 
}

export default function AddTraspasoModal({ 
    isOpen, 
    onClose, 
    onSubmit,
    almacenes, 
    productos,
    currentUserId 
}: AddTraspasoModalProps) {
  
  const { token } = useAuth();
  
  // Estados para el formulario
  const [loadingData, setLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [carrier, setCarrier] = useState(''); // Nuevo campo
  const [observations, setObservations] = useState(''); // Nuevo campo

  // Efecto de Limpieza
  useEffect(() => {
    if (!isOpen) {
      setFromWarehouseId(''); 
      setToWarehouseId(''); 
      setProductId('');
      setQuantity(''); 
      setCarrier(''); // Limpiar transportista
      setObservations(''); // Limpiar observaciones
      setError(null);
    }
  }, [isOpen]);

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

    // Limpieza de IDs y Validación
    const rawProductId = String(productId).split('-')[1];
    const rawFromId = fromWarehouseId.split('-')[1];
    const rawToId = toWarehouseId.split('-')[1];
    const quantityNum = parseInt(quantity, 10);

    // Validación
    if (!rawProductId || !rawFromId || !rawToId || !quantityNum || quantityNum <= 0) {
        setError("Todos los campos obligatorios deben completarse y la cantidad debe ser positiva.");
        setIsSaving(false);
        return;
    }

    // Validación de Stock
    const productoSeleccionado = productosDisponibles.find(p => p.id === productId);
    if (!productoSeleccionado || quantityNum > productoSeleccionado.cantidad) {
        setError(`Stock insuficiente. Disponible: ${productoSeleccionado?.cantidad || 0}`);
        setIsSaving(false);
        return;
    }

    try {
        // Preparar datos con los nuevos campos
        const traspasoData: AddTraspasoData = {
            product_id: parseInt(rawProductId, 10),
            from_warehouse_id: parseInt(rawFromId, 10),
            to_warehouse_id: parseInt(rawToId, 10),
            quantity: quantityNum
        };

        // Agregar campos opcionales solo si tienen valor
        if (carrier.trim()) {
            traspasoData.carrier = carrier.trim();
        }
        if (observations.trim()) {
            traspasoData.observations = observations.trim();
        }

        await onSubmit(traspasoData);

    } catch (err: any) {
        setError(err.message || "Error al enviar la solicitud.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Solicitar Traspaso de Stock</h2>
        
        {error && <p className="text-sm text-red-600 text-center mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">{error}</p>}
        {loadingData && <p className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></p>}

        {(!loadingData && almacenes.length > 0) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* SELECCIÓN DE ORIGEN Y DESTINO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LADO: ORIGEN */}
              <div className="space-y-3 rounded-md border p-4 dark:border-slate-700">
                <h3 className="font-semibold text-lg">Origen</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Almacén de Salida *</label>
                  <select 
                    value={fromWarehouseId} 
                    onChange={(e) => setFromWarehouseId(e.target.value)} 
                    required 
                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
                  >
                    <option value="">Seleccione...</option>
                    {almacenes.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
                  </select>
                </div>
              </div>
              
              {/* LADO: DESTINO */}
              <div className="space-y-3 rounded-md border p-4 dark:border-slate-700">
                <h3 className="font-semibold text-lg">Destino</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Almacén de Entrada *</label>
                  <select 
                    value={toWarehouseId} 
                    onChange={(e) => setToWarehouseId(e.target.value)} 
                    required 
                    disabled={!fromWarehouseId} 
                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:border-slate-600 disabled:opacity-50"
                  >
                    <option value="">Seleccione...</option>
                    {almacenesDestino.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* SELECCIÓN DE PRODUCTO Y CANTIDAD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Producto a Mover *</label>
                <select 
                  value={productId} 
                  onChange={(e) => setProductId(e.target.value)} 
                  required 
                  disabled={!fromWarehouseId || productosDisponibles.length === 0} 
                  className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:border-slate-600 disabled:opacity-50"
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
                <label className="block text-sm font-medium mb-1">Cantidad *</label>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  required 
                  className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:border-slate-600" 
                  min="1" 
                  placeholder="0"
                />
              </div>
            </div>

            {/* NUEVO: TRANSPORTISTA */}
            <div>
              <label className="block text-sm font-medium mb-1">Transportista</label>
              <input 
                type="text" 
                value={carrier} 
                onChange={(e) => setCarrier(e.target.value)} 
                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:border-slate-600" 
                placeholder="Nombre del transportista (opcional)"
                maxLength={100}
              />
            </div>

            {/* NUEVO: OBSERVACIONES */}
            <div>
              <label className="block text-sm font-medium mb-1">Observaciones</label>
              <textarea 
                value={observations} 
                onChange={(e) => setObservations(e.target.value)} 
                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:border-slate-600 min-h-[80px] resize-y" 
                placeholder="Notas adicionales sobre el traspaso (opcional)"
                maxLength={500}
              />
              <p className="text-xs text-slate-500 mt-1">{observations.length}/500 caracteres</p>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-700">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving || loadingData}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  "Solicitar Traspaso"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}