// app/dashboard/traspasos/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Plus, Settings2 } from 'lucide-react';
import { getTraspasos, updateTraspasoStatus } from '@/lib/traspasos-store';
import { type Traspaso, type TraspasoStatus } from '@/lib/data';
import TraspasosDashboard from '@/components/traspasos/TraspasosDashboard';
import TraspasosTable from '@/components/traspasos/TraspasosTable';
import AddTraspasoModal from '@/components/traspasos/AddTraspasoModal';

export default function TraspasosPage() {
  const [traspasos, setTraspasos] = useState<Traspaso[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTraspasos(getTraspasos());
  }, []);

  const refreshTraspasos = () => {
    setTraspasos([...getTraspasos()]);
  };

  const handleUpdateStatus = (id: string, status: TraspasoStatus) => {
    updateTraspasoStatus(id, status);
    refreshTraspasos();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Módulo de Traspasos
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Movimientos de inventario entre almacenes y bodegas.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Traspaso</span>
        </button>
      </div>

      {/* 1. Dashboard de Traspasos */}
      <TraspasosDashboard traspasos={traspasos} />
      
      {/* 2. Filtros y Tabla */}
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Historial de Traspasos</h3>
          <button className="text-slate-500 hover:text-indigo-600"><Settings2 className="h-5 w-5" /></button>
        </div>
        <div className="mt-4">
          <TraspasosTable traspasos={traspasos} onUpdateStatus={handleUpdateStatus} />
        </div>
      </div>

      {/* 3. Modal para Nuevo Traspaso */}
      <AddTraspasoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={refreshTraspasos}
      />
    </div>
  );
}