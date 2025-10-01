// components/almacenes/AddEditAlmacenModal.tsx
"use client";
import { useState, useEffect } from 'react';
import type { Almacen } from '@/lib/data';

interface AddEditAlmacenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Almacen, 'id' | 'inventario'>, id?: string) => void;
  almacenToEdit: Almacen | null;
}

export default function AddEditAlmacenModal({ isOpen, onClose, onSave, almacenToEdit }: AddEditAlmacenModalProps) {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const isEditMode = !!almacenToEdit;

  useEffect(() => {
    if (isOpen && isEditMode) {
      setNombre(almacenToEdit.nombre);
      setUbicacion(almacenToEdit.ubicacion);
      setDescripcion(almacenToEdit.descripcion);
    } else if (!isOpen) {
      setNombre('');
      setUbicacion('');
      setDescripcion('');
    }
  }, [isOpen, almacenToEdit, isEditMode]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      nombre, ubicacion, descripcion,
      inventarios: []
    }, isEditMode ? almacenToEdit.id : undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Editar Almacén' : 'Agregar Nuevo Almacén'}</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre del Almacén</label>
            <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ubicación</label>
            <input id="ubicacion" type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descripción (Opcional)</label>
            <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="mt-1 w-full rounded-lg" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancelar</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{isEditMode ? 'Guardar Cambios' : 'Guardar Almacén'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}