// components/productos/AddEditProductoModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
// Importamos los tipos necesarios
import type { GlobalProduct } from '@/lib/data'; 
import type { CategoryItem } from '@/lib/data'; 
import type { Inventario } from '@/lib/data'; // Necesario para tipar Omit

// Definición de las props del modal
interface AddEditProductoModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onSave espera el ID del producto a editar como string | undefined
    onSave: (data: Omit<GlobalProduct, 'product_id' | 'categoria_nombre' | 'current_stock_total'>, id?: string) => Promise<void>;
    productoToEdit: GlobalProduct | null;
    isSaving: boolean;
    saveError: string | null;
    categories: CategoryItem[]; // Lista de categorías para el select
}

export default function AddEditProductoModal({ 
    isOpen, onClose, onSave, productoToEdit, isSaving, saveError, categories 
}: AddEditProductoModalProps) {
    
    // Estados locales
    const [product_name, setProductName] = useState('');
    const [unit_price, setUnitPrice] = useState('');
    const [minimum_stock, setMinimumStock] = useState('');
    const [unit_of_measure, setUnitOfMeasure] = useState('Unidad');
    const [description, setDescription] = useState('');
    const [category_id, setCategoryId] = useState('');

    const isEditMode = !!productoToEdit;

    // Efecto para precargar datos
    useEffect(() => {
        if (isOpen && categories.length > 0) {
            if (isEditMode && productoToEdit) {
                // Modo Edición: Precargar datos
                setProductName(productoToEdit.product_name || '');
                setUnitPrice(String(productoToEdit.unit_price) || '');
                setMinimumStock(String(productoToEdit.minimum_stock) || '0');
                setDescription(productoToEdit.description || '');
                setUnitOfMeasure(productoToEdit.unit_of_measure || 'Unidad');
                // Precargar la categoría, asegurando que sea string
                setCategoryId(String(productoToEdit.category_id)); 
            } else {
                // Modo Creación: Limpiar y seleccionar la primera categoría por defecto
                setProductName(''); setUnitPrice(''); setMinimumStock('0'); 
                setDescription(''); setUnitOfMeasure('Unidad');
                setCategoryId(String(categories[0]?.id || '')); 
            }
        } else if (!isOpen) {
            // Limpiar formulario al cerrar
            setProductName(''); setUnitPrice(''); setMinimumStock('0'); 
            setDescription(''); setCategoryId('');
        }
    }, [isOpen, productoToEdit, isEditMode, categories]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaving) return; 
    
        if (!category_id) {
            alert('Debes seleccionar una categoría.');
            return;
        }
        
        // 1. LIMPIEZA DEL ID DE CATEGORÍA para el objeto de datos
        const rawCategoryId = category_id.startsWith('INV-') 
            ? category_id.split('-')[1] 
            : category_id; 

        // 2. OBTENER EL ID DEL PRODUCTO PARA EDICIÓN
        // Este ID puede ser string ('PROD-X') o number (X), pero lo vamos a convertir a string.
        const productIdToPass = isEditMode ? productoToEdit?.product_id : undefined;


        // 3. OBJETO DE ENVÍO Y LLAMADA A ON SAVE
        onSave({
            product_name: product_name, 
            unit_price: parseFloat(unit_price) || 0,
            minimum_stock: parseInt(minimum_stock) || 0,
            unit_of_measure: unit_of_measure, 
            description: description,
            category_id: parseInt(rawCategoryId) || 0, 
            
        }, 
        productIdToPass ? String(productIdToPass) : undefined 
        );
    };

    if (!isOpen) return null;

    // Contenido del modal (solo los campos necesarios)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
            
            {saveError && <p className="text-sm text-red-600 text-center py-2">{saveError}</p>}
            
            {/* El formulario ha sido limpiado de cantidad/peso/unidadPeso */}
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
                
                {/* 1. Categoría (Menu Desplegable) */}
                <div className="col-span-2">
                    <label htmlFor="prod-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoría</label>
                    <select 
                        id="prod-category" 
                        value={category_id} 
                        onChange={(e) => setCategoryId(e.target.value)} 
                        required 
                        disabled={isSaving || isEditMode} // <-- Regla: No se puede cambiar al editar
                        className="mt-1 w-full rounded-lg border-slate-300 dark:bg-slate-700 dark:border-slate-600 disabled:opacity-70"
                    >
                        {isEditMode && <option value={category_id} disabled>{productoToEdit?.categoria_nombre} (No Editable)</option>}
                        {!isEditMode && <option value="" disabled>Seleccionar Categoría</option>}
                        
                        {categories.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                    {isEditMode && <p className="text-xs text-red-500 mt-1">La categoría no se puede cambiar en un producto existente.</p>}
                </div>
                
                {/* 2. Nombre del Producto */}
                <div className="col-span-2">
                    <label htmlFor="prod-nombre">Nombre del Producto</label>
                    <input id="prod-nombre" type="text" value={product_name} onChange={(e) => setProductName(e.target.value)} required disabled={isSaving} className="mt-1 w-full rounded-lg disabled:opacity-70" />
                </div>
                
                {/* 3. Precio Unitario */}
                <div>
                    <label htmlFor="prod-precio">Precio Unitario (Pesos)</label>
                    <input id="prod-precio" type="number" step="0.01" value={unit_price} onChange={(e) => setUnitPrice(e.target.value)} required disabled={isSaving} className="mt-1 w-full rounded-lg disabled:opacity-70" />
                </div>
                
                {/* 4. Stock Mínimo */}
                <div>
                    <label htmlFor="prod-stock-min">Stock Mínimo</label>
                    <input id="prod-stock-min" type="number" value={minimum_stock} onChange={(e) => setMinimumStock(e.target.value)} required disabled={isSaving} className="mt-1 w-full rounded-lg disabled:opacity-70" />
                </div>
                
                {/* 5. Unidad de Medida */}
                <div>
                    <label htmlFor="prod-unidad-medida">Unidad de Medida</label>
                    <input id="prod-unidad-medida" type="text" value={unit_of_measure} onChange={(e) => setUnitOfMeasure(e.target.value)} required disabled={isSaving} className="mt-1 w-full rounded-lg disabled:opacity-70" />
                </div>

                {/* 6. Observaciones (Descripción) */}
                <div className="col-span-2">
                    <label htmlFor="prod-description">Descripción / Observaciones (Opcional)</label>
                    <textarea id="prod-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={isSaving} className="mt-1 w-full rounded-lg disabled:opacity-70" />
                </div>
                
                {/* Botones */}
                <div className="col-span-2 flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white flex items-center">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isEditMode ? 'Guardar Cambios' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}