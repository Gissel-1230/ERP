// app/dashboard/categorias/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import AddEditCategoriaModal from '@/components/categorias/AddEditCategoriaModal'; 
import CategoriasList from '@/components/categorias/CategoriasList'; 
import { useAuth } from '@/app/context/AuthContext';
// Importamos las funciones del nuevo store
import { getCategories, saveCategory, deleteCategory } from '@/lib/category-store'; 
import { type CategoryItem, type Inventario } from '@/lib/data'; 

export default function CategoriasPage() {
    const { token, logout } = useAuth();
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryItem | null>(null); // <-- Estado para edición
    const [isDeleting, setIsDeleting] = useState<number | null>(null); // Estado para eliminar

    // --- FUNCIÓN PARA CARGAR TODAS LAS CATEGORÍAS (GET) ---
    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const dataFromApi = await getCategories(token); 
            setCategories(dataFromApi);

        } catch (err: any) {
            console.error("Error al cargar categorías:", err);
            setError(err.message || "No se pudo conectar al servidor para listar categorías.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- FUNCIÓN PARA GUARDAR (POST/PUT) ---
    const handleSaveCategory = async (data: Omit<Inventario, 'id' | 'productos'>, id?: string) => { // <-- Ahora recibe ID
        setIsSaving(true);
        setSaveError(null);
        
        if (!token) {
            setSaveError("No autenticado. Por favor, reinicia la sesión.");
            setIsSaving(false);
            return;
        }

        try {
            // Llama a saveCategory (POST/PUT)
            const savedCategory = await saveCategory(data, token, id); // <-- Pasa ID al store
            
            // Si es exitoso, RECUPERAMOS TODA LA LISTA (Opción A: Más segura)
            await fetchCategories(); 
            
            setIsModalOpen(false); // Cierra modal
            setCategoryToEdit(null); // Limpia estado de edición

        } catch (err: any) {
            console.error("Error al guardar categoría:", err);
            setSaveError(err.message || "Error al guardar. Intenta de nuevo."); // Muestra el error
        } finally {
            setIsSaving(false);
        }
    };

    // --- FUNCIÓN PARA ELIMINAR (DELETE) ---
const handleDeleteCategory = async (id: string | number) => {
        const categoryName = categories.find(c => c.id === id)?.nombre || id;
        // Pregunta con SweetAlert2
        const result = await showAlert({
            title: `¿Eliminar categoría?`,
            text: `¿Estás seguro de eliminar la categoría: ${categoryName}? Esta acción es irreversible.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#3085d6",
        });

        if (!result.isConfirmed) {
            return;
        }

        const numericId = typeof id === 'string' ? parseInt(id.split('-')[1] || id, 10) : id;
        setIsDeleting(numericId);
        setError(null);

        try {
            if (!token) throw new Error("Token no proporcionado.");
            await deleteCategory(String(id), token);
            await fetchCategories();
        } catch (err: any) {
            console.error("Error al eliminar categoría:", err);
            setError(err.message || "No se pudo eliminar. Revisa la consola.");
            setTimeout(() => setError(null), 5000);

            // Mostrar error con SweetAlert2
            await showAlert({
                title: "Error",
                text: err.message || "No se pudo eliminar la categoría.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#d32f2f",
            });
        } finally {
            setIsDeleting(null);
        }
    };

    
    // --- FUNCIÓN PARA ABRIR EL MODAL EN MODO EDICIÓN ---
    const handleOpenEditModal = (category: CategoryItem) => {
        setCategoryToEdit(category); // Carga el ítem en el estado
        setIsModalOpen(true);        // Abre el modal
    };


    // Carga inicial
    useEffect(() => {
        if (token) {
            fetchCategories();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Renderizado condicional
    if (isLoading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    // --- JSX Principal ---
    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* Encabezado y Botón de Acción */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Catálogo de Categorías</h1>
                <Button 
                    // Limpia el item de edición al abrir en modo "Agregar"
                    onClick={() => {setIsModalOpen(true); setSaveError(null); setCategoryToEdit(null);}} 
                    className="flex items-center gap-2"
                    disabled={isSaving || isLoading}
                >
                    <Plus className="w-5 h-5" />
                    Nueva Categoría
                </Button>
            </div>

            {/* Contenido de la Lista/Tabla */}
            <CategoriasList 
                categories={categories} 
                onDelete={handleDeleteCategory} // Pasa función DELETE
                onEdit={handleOpenEditModal}    // Pasa función EDIT
                isDeletingId={isDeleting}       // Pasa estado de eliminación
            />

            {/* Modal de Creación/Edición */}
            {isModalOpen && (
                <AddEditCategoriaModal 
                    isOpen={isModalOpen}
                    onClose={() => {setIsModalOpen(false); setSaveError(null); setCategoryToEdit(null);}} // Limpia estados al cerrar
                    onSave={handleSaveCategory} 
                    isSaving={isSaving} 
                    saveError={saveError}
                    categoryToEdit={categoryToEdit} 
                />
            )}
        </div>
    );
}