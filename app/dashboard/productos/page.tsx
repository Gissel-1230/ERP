// app/dashboard/productos/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
// Importa el modal y la tabla de productos (asumimos que los crearás)
import AddEditProductoModal from '@/components/productos/AddEditProductoModal'; 
import ProductosTable from '@/components/productos/ProductosTable'; 

import { useAuth } from '@/app/context/AuthContext';
// Importamos funciones del store
import { getProducts, saveProduct, deleteProduct } from '@/lib/product-store';
import { GlobalProduct } from '@/lib/data'; 
import { getCategories } from '@/lib/category-store';
import { type CategoryItem } from '@/lib/data'; // Tipo de categoría

export default function ProductosPage() {
    const { token } = useAuth();
    
    // Estados principales
    const [products, setProducts] = useState<GlobalProduct[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]); // Para el select del modal
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados del CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<GlobalProduct | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // --- 1. FUNCIÓN DE CARGA PRINCIPAL ---
    const fetchProductsData = async () => {
        setIsLoading(true);
        try {
            if (!token) return;

            // Carga paralela de Productos y Categorías
            const [productsData, categoriesData] = await Promise.all([
                getProducts(token),
                getCategories(token)
            ]);
            
            setProducts(productsData);
            setCategories(categoriesData);

        } catch (err: any) {
            console.error("Error al cargar datos de productos:", err);
            // El error 401/Auth ya se maneja en el AuthContext/Store
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. FUNCIÓN PARA GUARDAR (POST/PUT) ---
    const handleSaveProduct = async (
        data: Omit<GlobalProduct, 'product_id' | 'categoria_nombre' | 'current_stock_total'>, 
        id?: string
    ) => {
        setIsSaving(true);
        setSaveError(null);
        if (!token) return;

        try {
            const savedProduct = await saveProduct(data, token, id); 
            
            // Recargamos la lista completa para asegurarnos de que la tabla de productos
            // y la caché se actualicen con el nombre de categoría correcto.
            await fetchProductsData(); 
            
            setIsModalOpen(false); 
            setProductToEdit(null); 

        } catch (err: any) {
            console.error("Error al guardar producto:", err);
            setSaveError(err.message || "Error al guardar el producto. Intenta de nuevo."); 
        } finally {
            setIsSaving(false);
        }
    };

    // --- 3. FUNCIÓN PARA ELIMINAR (DELETE) ---
    const handleDeleteProduct = async (id: string | number) => {
        const productToDelete = products.find(p => p.product_id === id);
        
        if (!productToDelete) return;

        if (!window.confirm(`¿Estás seguro de eliminar el producto: ${productToDelete.product_name}?`)) {
            return;
        }
        
        setIsDeleting(String(id));
        
        try {
            if (!token) throw new Error("Token no proporcionado.");
            
            await deleteProduct(String(id), token); 
            
            // Si es exitoso, actualizamos el estado local (la caché del store se actualiza internamente)
            setProducts(prev => prev.filter(p => p.product_id !== id));
            
        } catch (err: any) {
            console.error("Error al eliminar producto:", err);
            // El store ya devuelve el mensaje 409 si tiene stock
            alert(err.message); 
            
        } finally {
            setIsDeleting(null); 
        }
    };
    
    // --- Carga Inicial ---
    useEffect(() => {
        if (token) {
            fetchProductsData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // --- Renderizado Condicional ---
    if (isLoading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* Encabezado y Botón de Acción */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
                <Button 
                    onClick={() => {setIsModalOpen(true); setSaveError(null); setProductToEdit(null);}} 
                    className="flex items-center gap-2"
                    disabled={isSaving || isLoading}
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </Button>
            </div>

            {/* Contenido de la Tabla */}
            <ProductosTable 
                products={products}
                onEdit={(product) => { setProductToEdit(product); setIsModalOpen(true); setSaveError(null); }}
                onDelete={handleDeleteProduct}
                isDeletingId={isDeleting}
            />

            {/* Modal de Creación/Edición */}
            {isModalOpen && (
                <AddEditProductoModal 
                    isOpen={isModalOpen}
                    onClose={() => {setIsModalOpen(false); setSaveError(null); setProductToEdit(null);}}
                    onSave={handleSaveProduct} 
                    isSaving={isSaving} 
                    saveError={saveError}
                    productoToEdit={productToEdit} 
                    categories={categories} // Pasa la lista de categorías al modal
                />
            )}
        </div>
    );
}