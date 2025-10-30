"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import AddEditProductoModal from '@/components/productos/AddEditProductoModal'; 
import ProductosTable from '@/components/productos/ProductosTable'; 

import { useAuth } from '@/app/context/AuthContext';
import { getProducts, saveProduct, deleteProduct } from '@/lib/product-store';
import { GlobalProduct } from '@/lib/data'; 
import { getCategories } from '@/lib/category-store';
import { type CategoryItem } from '@/lib/data'; // Tipo de categoría

import { showAlert } from '@/components/common/sweetAlert'; // Ruta según tu estructura

export default function ProductosPage() {
  const { token } = useAuth();
  
  // Estados principales
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados del CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<GlobalProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 1. FUNCIÓN DE CARGA PRINCIPAL
  const fetchProductsData = async () => {
    setIsLoading(true);
    try {
      if (!token) return;

      const [productsData, categoriesData] = await Promise.all([
        getProducts(token),
        getCategories(token)
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Error al cargar datos de productos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. FUNCIÓN PARA GUARDAR (POST/PUT)
  const handleSaveProduct = async (
    data: Omit<GlobalProduct, 'product_id' | 'categoria_nombre' | 'current_stock_total'>, 
    id?: string
  ) => {
    setIsSaving(true);
    setSaveError(null);
    if (!token) return;

    try {
      await saveProduct(data, token, id); 
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

  // 3. FUNCIÓN PARA ELIMINAR (DELETE) CON SWEETALERT2
  const handleDeleteProduct = async (id: string | number) => {
    const productToDelete = products.find(p => p.);
    if (!productToDelete) return;

    // Confirmación SweetAlert2
    const result = await showAlert({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de eliminar el producto: ${productToDelete.product_name}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#d32f2f', // Rojo
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#3085d6',
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsDeleting(String(id));

    try {
      if (!token) throw new Error("Token no proporcionado.");
      await deleteProduct(String(id), token);
      setProducts(prev => prev.filter(p => p.product_id !== id));
    } catch (err: any) {
      console.error("Error al eliminar producto:", err);
      await showAlert({
        title: 'Error',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d32f2f',
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Carga inicial
  useEffect(() => {
    if (token) {
      fetchProductsData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Renderizado condicional
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
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

      {/* Tabla de productos */}
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
          categories={categories}
        />
      )}
    </div>
  );
}
