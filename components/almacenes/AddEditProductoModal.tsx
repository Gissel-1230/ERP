"use client";
import { useState, useEffect } from 'react';
import type { Producto } from '@/lib/data';

interface AddEditProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productoData: Omit<Producto, 'id'>, id?: string) => void;
  productoToEdit: Producto | null;
}

export default function AddEditProductoModal({ isOpen, onClose, onSave, productoToEdit }: AddEditProductoModalProps) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [peso, setPeso] = useState('');
  const [unidad, setUnidad] = useState<'g' | 'kg'>('kg');
  const [observaciones, setObservaciones] = useState(''); // Nuevo estado

  const isEditMode = !!productoToEdit;

  useEffect(() => {
    if (isOpen && isEditMode) {
      setNombre(productoToEdit.nombre);
      setCantidad(String(productoToEdit.cantidad));
      setPrecio(String(productoToEdit.precioUnitario));
      setPeso(String(productoToEdit.peso));
      setUnidad(productoToEdit.unidadPeso);
      setObservaciones(productoToEdit.observaciones || '');
    } else if (!isOpen) {
      // Limpiar formulario al cerrar
      setNombre(''); setCantidad(''); setPrecio(''); setPeso(''); setUnidad('kg'); setObservaciones('');
    }
  }, [isOpen, productoToEdit, isEditMode]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      nombre,
      cantidad: parseInt(cantidad) || 0,
      precioUnitario: parseFloat(precio) || 0,
      peso: parseFloat(peso) || 0,
      unidadPeso: unidad,
      observaciones,
    }, isEditMode ? productoToEdit.id : undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
          <div className="col-span-2">
            <label htmlFor="prod-nombre">Nombre del Producto</label>
            <input id="prod-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div>
            <label htmlFor="prod-cantidad">Cantidad</label>
            <input id="prod-cantidad" type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div>
            <label htmlFor="prod-precio">Precio Unitario</label>
            <input id="prod-precio" type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div className="col-span-2 grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label htmlFor="prod-peso">Peso</label>
              <input id="prod-peso" type="number" step="0.01" value={peso} onChange={(e) => setPeso(e.target.value)} required className="mt-1 w-full rounded-lg" />
            </div>
            <div>
              <label htmlFor="prod-unidad">Unidad</label>
              <select id="prod-unidad" value={unidad} onChange={(e) => setUnidad(e.target.value as 'g' | 'kg')} className="mt-1 w-full rounded-lg">
                <option value="kg">kg</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <label htmlFor="prod-obs">Observaciones (Opcional)</label>
            <textarea id="prod-obs" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3} className="mt-1 w-full rounded-lg" />
          </div>
          <div className="col-span-2 flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancelar</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{isEditMode ? 'Guardar Cambios' : 'Guardar Producto'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}