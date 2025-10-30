// components/almacenes/AddStockModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getProductsByCategory } from '@/lib/product-store';
import type { GlobalProduct } from '@/lib/data';
import { useAuth } from '@/app/context/AuthContext';

interface AddStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { 
        product_id: number; 
        quantity: number; 
        description: string; 
    }) => Promise<void>;
    categoryId: string | number; // ID de la categoría actual (ej: 'INV-1')
    isSaving: boolean;
    saveError: string | null;
}

export default function AddStockModal({ 
    isOpen, onClose, onSave, categoryId, isSaving, saveError 
}: AddStockModalProps) {
    
    const { token } = useAuth();
    const [products, setProducts] = useState<GlobalProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | number>('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // --- 1. Cargar Productos de esta Categoría ---
    useEffect(() => {
        if (!isOpen || !token || !categoryId) return;

        const loadProducts = async () => {
            setIsLoadingProducts(true);
            try {
                // Llama a la API GET /api/v1/products/by-category/:id
                const productData = await getProductsByCategory(token, categoryId); 
                setProducts(productData);
                // Seleccionar el primer producto por defecto
                if (productData.length > 0) {
                    setSelectedProductId(productData[0].product_id); 
                }
            } catch (error) {
                console.error("Error al cargar productos de la categoría:", error);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        loadProducts();
    }, [isOpen, token, categoryId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving || isLoadingProducts) return; 

        const quantityValue = parseInt(quantity, 10);
        // Limpiamos el prefijo 'PROD-'
        const rawProductId = String(selectedProductId).split('-')[1] || selectedProductId; 

        if (!rawProductId || quantityValue <= 0) {
            alert('Por favor, selecciona un producto y una cantidad válida.');
            return;
        }
        
        onSave({
            product_id: parseInt(String(rawProductId), 10),
            quantity: quantityValue,
            description: description || 'Entrada de stock',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registrar Entrada de Stock</h2>
                
                {saveError && <p className="text-sm text-red-600 text-center py-2">{saveError}</p>}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    
                    {/* Select de Producto (Filtrado por la categoría padre) */}
                    <div>
                        <label htmlFor="select-product">Producto</label>
                        <select 
                            id="select-product" 
                            value={selectedProductId} 
                            onChange={(e) => setSelectedProductId(e.target.value)} 
                            disabled={isLoadingProducts || isSaving || products.length === 0}
                            required
                            className="mt-1 w-full rounded-lg border-slate-300 dark:bg-slate-700 disabled:opacity-50"
                        >
                            <option value="">{isLoadingProducts ? "Cargando..." : "Seleccionar Producto"}</option>
                            {products.map(prod => (
                                <option key={prod.product_id} value={prod.product_id}>
                                    {prod.product_name}
                                </option>
                            ))}
                        </select>
                        {products.length === 0 && !isLoadingProducts && (
                            <p className="text-xs text-orange-500 mt-1">No hay productos globales en esta categoría.</p>
                        )}
                    </div>

                    {/* Cantidad de Entrada */}
                    <div>
                        <label htmlFor="input-quantity">Cantidad de Entrada</label>
                        <input 
                            id="input-quantity" 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)} 
                            required 
                            disabled={isSaving}
                            min="1"
                            className="mt-1 w-full rounded-lg disabled:opacity-50" 
                        />
                    </div>
                    
                    {/* Descripción del Movimiento */}
                    <div>
                        <label htmlFor="input-description">Razón del Movimiento (Opcional)</label>
                        <textarea 
                            id="input-description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={2}
                            disabled={isSaving}
                            className="mt-1 w-full rounded-lg disabled:opacity-50" 
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white flex items-center">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Registrar Entrada
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}