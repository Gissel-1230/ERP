// components/almacenes/AdjustStockModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Producto } from '@/lib/data'; // Tipo de producto de la vista de inventario
import { Button } from '@/components/ui/button';

// --- Interfaz de Props ---
interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave ahora recibe los datos del AJUSTE
  onSave: (data: {
    product_id: number;
    quantity: number;
    movement_type: 'ADJUST-IN' | 'ADJUST-OUT';
    description: string;
  }) => Promise<void>;
  
  // El producto que estamos ajustando
  productToAdjust: Producto; 
  
  isSaving: boolean;
  saveError: string | null;
}

export default function AdjustStockModal({ 
    isOpen, onClose, onSave, productToAdjust, isSaving, saveError 
}: AdjustStockModalProps) {
    
    // Estados para el formulario de ajuste
    const [movementType, setMovementType] = useState<'ADJUST-IN' | 'ADJUST-OUT'>('ADJUST-IN');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');

    // Limpia el formulario cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setMovementType('ADJUST-IN');
            setQuantity('');
            setDescription('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return; 

        const quantityValue = parseInt(quantity, 10);
        
        // Validación
        if (!description || description.trim() === '') {
            alert('La descripción (razón del ajuste) es obligatoria.');
            
            return;
        }
        if (!quantityValue || quantityValue <= 0) {
            alert('La cantidad debe ser un número positivo.');
            return;
        }
        
        // El ID del producto viene del prop 'productToAdjust'
        const rawProductId = String(productToAdjust.id).split('-')[1] || productToAdjust.id;

        onSave({
            product_id: parseInt(String(rawProductId), 10),
            quantity: quantityValue,
            movement_type: movementType, // 'ADJUST-IN' o 'ADJUST-OUT'
            description: description, // Razón del ajuste
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ajuste de Stock: {productToAdjust.nombre}</h2>
                <p className="text-sm text-slate-500 mb-4">Stock Actual: {productToAdjust.cantidad}</p>

                {saveError && <p className="text-sm text-red-600 text-center py-2">{saveError}</p>}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    
                    {/* Tipo de Movimiento */}
                    <div>
                        <label htmlFor="select-type">Tipo de Ajuste</label>
                        <select 
                            id="select-type" 
                            value={movementType} 
                            onChange={(e) => setMovementType(e.target.value as 'ADJUST-IN' | 'ADJUST-OUT')} 
                            disabled={isSaving}
                            className="mt-1 w-full rounded-lg border-slate-300 dark:bg-slate-700 disabled:opacity-50"
                        >
                            <option value="ADJUST-IN">Entrada (Sumar al stock)</option>
                            <option value="ADJUST-OUT">Salida (Restar del stock)</option>
                        </select>
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label htmlFor="input-quantity">Cantidad a Ajustar</label>
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
                    
                    {/* Descripción (Razón) */}
                    <div>
                        <label htmlFor="input-description">Razón del Ajuste (Obligatorio)</label>
                        <textarea 
                            id="input-description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={3}
                            required
                            disabled={isSaving}
                            placeholder="Ej: Conteo físico, Merma por producto dañado..."
                            className="mt-1 w-full rounded-lg disabled:opacity-50" 
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white flex items-center">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Registrar Ajuste
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}