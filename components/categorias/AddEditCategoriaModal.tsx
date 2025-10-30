// components/categorias/AddEditCategoriaModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; 
import { Loader2 } from 'lucide-react';
import type { Inventario, CategoryItem } from '@/lib/data'; // Importa los tipos necesarios

interface AddEditCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave espera que el ID sea un string (lo convertiremos antes de llamar)
  onSave: (data: Omit<Inventario, 'id' | 'productos'>, id?: string) => Promise<void>; 
  isSaving: boolean;
  saveError: string | null;
  categoryToEdit: CategoryItem | null; // El ítem que se precarga para editar
}

export default function AddEditCategoriaModal({ 
    isOpen, onClose, onSave, isSaving, saveError, categoryToEdit 
}: AddEditCategoriaModalProps) {
    
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    // Determina si estamos en modo edición
    const isEditMode = !!categoryToEdit; 

    // Efecto para PRECARGAR DATOS al abrir el modal
    useEffect(() => {
        if (isOpen && isEditMode && categoryToEdit) {
            setNombre(categoryToEdit.nombre || '');
            setDescripcion(categoryToEdit.descripcion || '');
        } else if (!isOpen) {
            // Limpia el formulario al cerrar
            setNombre('');
            setDescripcion('');
        }
    }, [isOpen, categoryToEdit, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return; 

        // 1. Obtener el ID para pasar (será number o string o undefined)
        const idToPass = isEditMode ? categoryToEdit?.id : undefined;

        // 2. LLAMA a onSave, CONVIRTIENDO el ID a STRING
        onSave(
            { nombre, descripcion },
            idToPass ? String(idToPass) : undefined 
        ); 
        // Nota: Dejamos que el componente padre (page.tsx) cierre el modal en caso de éxito.
    };

    if (!isOpen) return null;

    return (
      // Fondo oscuro (Backdrop)
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out" 
        onClick={onClose} // Cierra al hacer clic fuera
      >
        {/* Contenido del Modal */}
        <div
          className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800 transition-transform duration-300 ease-out scale-95 data-[state=open]:scale-100"
          onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
        >
          {/* Título */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            {isEditMode ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={isSaving}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm disabled:opacity-50 dark:disabled:bg-slate-600" 
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
                disabled={isSaving}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm disabled:opacity-50 dark:disabled:bg-slate-600"
              />
            </div>

            {/* --- Muestra el Error de Guardado --- */}
            {saveError && (
              <p className="text-sm text-red-600 text-center py-2">{saveError}</p>
            )}

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex min-w-[120px] items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                ) : (
                    isEditMode ? 'Guardar Cambios' : 'Guardar Categoría'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
}