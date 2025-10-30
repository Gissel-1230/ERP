// components/ventas/AddOrdenModal.tsx
"use client";
import { useState, useEffect } from 'react';
import type { OrdenDeCompra } from '@/lib/data';
import { showAlert } from '../common/sweetAlert';
// La prop onAddOrden ahora debe incluir el valorTotal
interface AddOrdenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrden: (orden: Omit<OrdenDeCompra, 'codigo' | 'fechaCreacion' | 'status'>) => void;
}

export default function AddOrdenModal({ isOpen, onClose, onAddOrden }: AddOrdenModalProps) {
  const [folio, setFolio] = useState('');
  const [producto, setProducto] = useState('');
  const [cliente, setCliente] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [valorTotal, setValorTotal] = useState(''); // Nuevo estado

  const resetForm = () => {
    setFolio(''); setProducto(''); setCliente(''); setCantidad(''); setValorTotal('');
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!folio || !producto || !cliente || !cantidad || !valorTotal) {
      //alert('Por favor, completa todos los campos.');
      showAlert({
        title: "¡Oh no, algo no salió bien!",
        text: "La descripción (razón del ajuste) es obligatoria.",
        icon: "warning",
      });
      return;
    }
    
    onAddOrden({
      folio,
      producto,
      cliente,
      cantidad: parseInt(cantidad),
      valorTotal: parseFloat(valorTotal) // Añadimos el nuevo campo
    });

    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nueva Orden de Compra</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="folio">Folio</label>
            <input id="folio" type="text" value={folio} onChange={(e) => setFolio(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div>
            <label htmlFor="producto">Nombre del Producto</label>
            <input id="producto" type="text" value={producto} onChange={(e) => setProducto(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div>
            <label htmlFor="cliente">Nombre del Cliente</label>
            <input id="cliente" type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required className="mt-1 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cantidad">Cantidad (Piezas)</label>
              <input id="cantidad" type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required min="1" className="mt-1 w-full rounded-lg" />
            </div>
            {/* -- NUEVO CAMPO VALOR TOTAL -- */}
            <div>
              <label htmlFor="valorTotal">Valor Total ($)</label>
              <input id="valorTotal" type="number" step="0.01" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} required min="0" className="mt-1 w-full rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancelar</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Agregar Orden</button>
          </div>
        </form>
      </div>
    </div>
  );
}