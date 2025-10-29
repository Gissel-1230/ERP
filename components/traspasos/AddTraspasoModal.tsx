"use client";
import { useState, useEffect } from 'react';
import { getAlmacenes, getInventarioById } from '@/lib/almacen-store'; // getAlmacenes ahora es async
import { addTraspaso } from '@/lib/traspasos-store';
import { type Almacen, type Inventario, type Producto } from '@/lib/data';
import { useAuth } from '@/app/context/AuthContext'; // Importamos el hook de autenticación

interface AddTraspasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AddTraspasoModal({ isOpen, onClose, onSave }: AddTraspasoModalProps) {
  const { token } = useAuth(); // Obtenemos el token del contexto
  
  // Datos maestros
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loadingAlmacenes, setLoadingAlmacenes] = useState(false); // Estado de carga
  
  // Listas dependientes
  const [inventariosSalida, setInventariosSalida] = useState<Inventario[]>([]);
  const [inventariosEntrada, setInventariosEntrada] = useState<Inventario[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);

  // Campos del formulario
  const [almacenSalidaId, setAlmacenSalidaId] = useState('');
  const [inventarioSalidaId, setInventarioSalidaId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [almacenEntradaId, setAlmacenEntradaId] = useState('');
  const [inventarioEntradaId, setInventarioEntradaId] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Cargar almacenes al abrir (AHORA ASÍNCRONO)
  useEffect(() => {
    const fetchAlmacenes = async () => {
      if (isOpen && token) { // Solo cargar si está abierto y hay token
        setLoadingAlmacenes(true);
        try {
          const data = await getAlmacenes(token); // Usamos await para esperar la promesa
          setAlmacenes(data);
        } catch (error) {
          console.error("Error al cargar almacenes en modal:", error);
          alert("Error al cargar almacenes. Verifique la consola.");
        } finally {
          setLoadingAlmacenes(false);
        }
      } else if (!isOpen) {
        // Resetear formulario al cerrar
        setAlmacenSalidaId(''); setInventarioSalidaId(''); setProductoId('');
        setCantidad(''); setAlmacenEntradaId(''); setInventarioEntradaId('');
        setObservaciones(''); setInventariosSalida([]); setInventariosEntrada([]);
        setProductosDisponibles([]); setAlmacenes([]); // Limpiar también almacenes
      }
    };

    fetchAlmacenes();
  }, [isOpen, token]); // Añadimos token a las dependencias

  // --- El resto de los useEffects y el handleSubmit NO necesitan cambios ---
  // (Porque getInventarioById y las funciones de traspasos-store siguen siendo síncronas)
  
  useEffect(() => {
    if (almacenSalidaId) {
      const almacen = almacenes.find(a => a.id === almacenSalidaId);
      setInventariosSalida(almacen?.inventarios || []);
      setInventarioSalidaId(''); setProductosDisponibles([]);
    }
  }, [almacenSalidaId, almacenes]);

  useEffect(() => {
    if (almacenEntradaId) {
      const almacen = almacenes.find(a => a.id === almacenEntradaId);
      setInventariosEntrada(almacen?.inventarios || []);
      setInventarioEntradaId('');
    }
  }, [almacenEntradaId, almacenes]);

  useEffect(() => {
    if (inventarioSalidaId) {
      const inventario = getInventarioById(almacenSalidaId, inventarioSalidaId);
      setProductosDisponibles(inventario?.productos || []);
      setProductoId('');
    }
  }, [inventarioSalidaId, almacenSalidaId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const producto = productosDisponibles.find(p => p.id === productoId);
    if (!producto || !almacenSalidaId || !inventarioSalidaId || !almacenEntradaId || !inventarioEntradaId || !cantidad) {
       alert("Por favor, complete todos los campos requeridos.");
       return;
    }

    const result = addTraspaso({
      producto_id: producto.id,
      producto_nombre: producto.nombre,
      cantidad: parseFloat(cantidad),
      almacen_salida_id: almacenSalidaId,
      inventario_salida_id: inventarioSalidaId,
      almacen_entrada_id: almacenEntradaId,
      inventario_entrada_id: inventarioEntradaId,
      observaciones,
    });

    if (result.success) {
      onSave();
      onClose();
    } else {
      alert(`Error al crear traspaso: ${result.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold">Nuevo Traspaso de Inventario</h2>
        
        {loadingAlmacenes ? (
          <p className="py-10 text-center">Cargando almacenes...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* ... (El resto del formulario es igual) ... */}
            <div className="grid grid-cols-2 gap-4">
              {/* LADO: ORIGEN */}
              <div className="space-y-4 rounded-md border p-4 dark:border-slate-700">
                <h3 className="font-semibold">Origen</h3>
                <div>
                  <label>Almacén de Salida</label>
                  <select value={almacenSalidaId} onChange={(e) => setAlmacenSalidaId(e.target.value)} required className="w-full rounded-lg">
                    <option value="">Seleccione...</option>
                    {almacenes.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
                  </select>
                </div>
                <div>
                  <label>Inventario de Salida</label>
                  <select value={inventarioSalidaId} onChange={(e) => setInventarioSalidaId(e.target.value)} required disabled={!almacenSalidaId} className="w-full rounded-lg">
                    <option value="">Seleccione...</option>
                    {inventariosSalida.map(i => (<option key={i.id} value={i.id}>{i.nombre}</option>))}
                  </select>
                </div>
              </div>
              {/* LADO: DESTINO */}
              <div className="space-y-4 rounded-md border p-4 dark:border-slate-700">
                <h3 className="font-semibold">Destino</h3>
                <div>
                  <label>Almacén de Entrada</label>
                  <select value={almacenEntradaId} onChange={(e) => setAlmacenEntradaId(e.target.value)} required className="w-full rounded-lg">
                    <option value="">Seleccione...</option>
                    {almacenes.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
                  </select>
                </div>
                <div>
                  <label>Inventario de Entrada</label>
                  <select value={inventarioEntradaId} onChange={(e) => setInventarioEntradaId(e.target.value)} required disabled={!almacenEntradaId} className="w-full rounded-lg">
                    <option value="">Seleccione...</option>
                    {inventariosEntrada.map(i => (<option key={i.id} value={i.id}>{i.nombre}</option>))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2"> {/* Ajuste para que ocupe más espacio */}
                <label>Producto a Mover</label>
                <select value={productoId} onChange={(e) => setProductoId(e.target.value)} required disabled={!inventarioSalidaId} className="w-full rounded-lg">
                  <option value="">Seleccione...</option>
                  {productosDisponibles.map(p => (<option key={p.id} value={p.id}>{p.nombre} (Stock: {p.cantidad})</option>))}
                </select>
              </div>
              <div>
                <label>Cantidad</label>
                <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required className="w-full rounded-lg" min="1" />
              </div>
            </div>

            <div>
              <label>Observaciones</label>
              <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3} className="w-full rounded-lg" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Cancelar</button>
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Guardar Traspaso</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}