"use client";

import { useState, useEffect } from 'react';
// highlight-start
import type { OrdenDeCompra } from '@/lib/data'; // Ruta de importación corregida
// highlight-end

interface AddOrdenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrden: (orden: OrdenDeCompra) => void;
}

export default function AddOrdenModal({ isOpen, onClose, onAddOrden }: AddOrdenModalProps) {
  const [producto, setProducto] = useState('');
  const [cliente, setCliente] = useState('');
  const [cantidad, setCantidad] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setProducto('');
      setCliente('');
      setCantidad('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!producto || !cliente || !cantidad || parseInt(cantidad) <= 0) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
    const codigo = `OC-2025-${String(Date.now()).slice(-4)}`;
    onAddOrden({ codigo, producto, cliente, cantidad: parseInt(cantidad), status: 'Pendiente' });
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nueva Orden de Compra</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="producto" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre del Producto</label>
            <input id="producto" type="text" value={producto} onChange={(e) => setProducto(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" required />
          </div>
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre del Cliente</label>
            <input id="cliente" type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" required />
          </div>
          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cantidad (Piezas)</label>
            <input id="cantidad" type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" required min="1" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Cancelar</button>
            <button type="submit" className="rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">Agregar Orden</button>
          </div>
        </form>
      </div>
    </div>
  );
}