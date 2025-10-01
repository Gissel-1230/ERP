// components/almacenes/AddInventarioModal.tsx
"use client";
import { useState } from 'react';
import type { Inventario } from '@/lib/data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Inventario, 'id' | 'productos'>) => void;
}

export default function AddInventarioModal({ isOpen, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nombre, descripcion });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold">Crear Nuevo Inventario</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label>Nombre del Inventario</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div>
            <label>Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required className="mt-1 w-full rounded-lg" rows={3}></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Cancelar</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Crear Inventario</button>
          </div>
        </form>
      </div>
    </div>
  );
}