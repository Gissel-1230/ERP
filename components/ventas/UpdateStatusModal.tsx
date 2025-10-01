// components/ventas/UpdateStatusModal.tsx
"use client";

import { useState, useEffect } from 'react';
import type { OrdenDeCompra, OrderStatus } from '@/lib/data';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (codigo: string, newStatus: OrderStatus) => void;
  orden: OrdenDeCompra | null;
}

const allStatuses: OrderStatus[] = ['Pendiente', 'En proceso de preparar', 'Aceptado', 'En Camino', 'Rechazado'];

export default function UpdateStatusModal({ isOpen, onClose, onSave, orden }: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Pendiente');

  useEffect(() => {
    if (orden) {
      setSelectedStatus(orden.status);
    }
  }, [orden]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orden) {
      onSave(orden.codigo, selectedStatus);
    }
    onClose();
  };

  if (!isOpen || !orden) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Actualizar Estado de Orden</h2>
        <p className="mt-1 font-mono text-sm text-indigo-500">{orden.codigo}</p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nuevo Estado
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {allStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
              Cancelar
            </button>
            <button type="submit" className="rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}