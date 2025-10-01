"use client";

import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import OrdenesTable from './OrdenesTable';
import AddOrdenModal from './AddOrdenModal';
import UpdateStatusModal from './UpdateStatusModal';
import { getOrdenes, addOrden, updateOrdenStatus } from '@/lib/ventas-store';
import { type OrdenDeCompra, type OrderStatus } from '@/lib/data';

export default function OrdenesDeCompraView() {
  const [ordenes, setOrdenes] = useState<OrdenDeCompra[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdenDeCompra | null>(null);

  useEffect(() => {
    setOrdenes(getOrdenes());
  }, []);

  const refreshOrdenes = () => {
    setOrdenes([...getOrdenes()]);
  };

  const handleAddOrden = (nuevaOrden: OrdenDeCompra) => {
    addOrden(nuevaOrden);
    refreshOrdenes();
  };
  
  const handleOpenUpdateModal = (orden: OrdenDeCompra) => {
    setSelectedOrder(orden);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = (codigo: string, newStatus: OrderStatus) => {
    updateOrdenStatus(codigo, newStatus);
    refreshOrdenes();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-indigo-500" />
            <h3 className="text-lg font-semibold">Remisiones</h3>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Valor total de remisiones generadas este mes.</p>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">$12,450.00</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Listado de Órdenes</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Orden</span>
          </button>
        </div>
        <div className="mt-4">
          <OrdenesTable ordenes={ordenes} onUpdateStatusClick={handleOpenUpdateModal} />
        </div>
      </div>
      
      <AddOrdenModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOrden={handleAddOrden}
      />
      <UpdateStatusModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSave={handleUpdateStatus}
        orden={selectedOrder}
      />
    </div>
  );
}