// components/almacenes/AddEditAlmacenModal.tsx
"use client";
import { useState, useEffect } from 'react';
import type { Almacen } from '@/lib/data'; // Ajusta la ruta si es necesario
import { Loader2 } from 'lucide-react'; // Importa el ícono de carga

// --- 1. ACTUALIZA LA INTERFAZ DE PROPS ---
interface AddEditAlmacenModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Asegúrate que el tipo de 'data' coincida: Omit quita 'id' e 'inventarios'
  onSave: (data: Omit<Almacen, 'id' | 'inventarios'>, id?: string) => void; 
  almacenToEdit: Almacen | null;
  isSaving?: boolean;       // Prop para saber si se está guardando (opcional)
  saveError?: string | null; // Prop para mostrar errores de guardado (opcional)
}

export default function AddEditAlmacenModal({
    isOpen,
    onClose,
    onSave,
    almacenToEdit,
    isSaving = false, // <-- Recibe isSaving (valor por defecto: false)
    saveError = null  // <-- Recibe saveError (valor por defecto: null)
}: AddEditAlmacenModalProps) {

  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const isEditMode = !!almacenToEdit;

  // Efecto para llenar el formulario si es modo edición o limpiarlo
  useEffect(() => {
    if (isOpen && isEditMode) {
      setNombre(almacenToEdit.nombre || ''); // Fallback por si acaso
      setUbicacion(almacenToEdit.ubicacion || '');
      setDescripcion(almacenToEdit.descripcion || ''); // Asegura que sea string
    } else if (!isOpen) {
      // Resetea al cerrar o al abrir en modo 'agregar'
      setNombre('');
      setUbicacion('');
      setDescripcion('');
    }
  }, [isOpen, almacenToEdit, isEditMode]);

  // Manejador del envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Evita doble envío si ya se está guardando
    if (isSaving) return;

    // Llama a la función onSave pasada por el padre
    onSave(
      // Datos a guardar (sin id ni inventarios)
      { nombre, ubicacion, descripcion },
      // Pasa el ID solo si estamos en modo edición
      isEditMode ? almacenToEdit?.id : undefined 
    );
    // No cerramos aquí, el padre lo hará si onSave es exitoso
    // onClose(); 
  };

  // No renderiza nada si el modal no está abierto
  if (!isOpen) return null;

  // --- JSX del Modal ---
  return (
    // Fondo oscuro (Backdrop)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out" 
      onClick={onClose} // Cierra al hacer clic fuera
    >
      {/* Contenido del Modal */}
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800 transition-transform duration-300 ease-out scale-95 data-[state=open]:scale-100" // Animación simple
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
        data-state={isOpen ? 'open' : 'closed'} // Para la animación
      >
        {/* Título */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {isEditMode ? 'Editar Almacén' : 'Agregar Nuevo Almacén'}
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Almacén</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={isSaving} // <-- Deshabilita mientras guarda
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm disabled:opacity-50 dark:disabled:bg-slate-600" 
            />
          </div>

          {/* Campo Ubicación */}
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ubicación</label>
            <input
              id="ubicacion"
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
              disabled={isSaving} // <-- Deshabilita mientras guarda
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm disabled:opacity-50 dark:disabled:bg-slate-600"
            />
          </div>

          {/* Campo Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción (Opcional)</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              disabled={isSaving} // <-- Deshabilita mientras guarda
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm disabled:opacity-50 dark:disabled:bg-slate-600"
            />
          </div>

          {/* --- Muestra el Error de Guardado (si existe) --- */}
          {saveError && (
            <p className="text-sm text-red-600 text-center py-2">{saveError}</p>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving} // <-- Deshabilita cancelar mientras guarda
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving} // <-- Deshabilita guardar mientras guarda
              className="flex min-w-[120px] items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? ( // <-- Muestra texto o spinner
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
              ) : (
                  isEditMode ? 'Guardar Cambios' : 'Guardar Almacén'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}