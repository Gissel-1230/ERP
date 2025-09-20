"use client";

import { useState, useEffect } from 'react';
import type { Almacen } from '@/lib/data';

interface AddEditAlmacenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Almacen, 'id' | 'materiaPrima' | 'productos' | 'insumos'>, id?: string) => void;
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
    // highlight-start
    // ESTA LÍNEA ES LA MÁS IMPORTANTE PARA EVITAR EL RECARGADO DE PÁGINA
    e.preventDefault(); 
    // highlight-end
    
    if (!nombre || !ubicacion) {
      alert('Nombre y Ubicación son campos requeridos.');
      return;
    }
    onSave({ nombre, ubicacion, descripcion }, isEditMode ? almacenToEdit.id : undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isEditMode ? 'Editar Almacén' : 'Agregar Nuevo Almacén'}
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Inputs for nombre, ubicacion, and descripcion... */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nombre del Almacén
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              required
            />
          </div>
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Ubicación
            </label>
            <input
              id="ubicacion"
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              {isEditMode ? 'Guardar Cambios' : 'Guardar Almacén'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}