// app/dashboard/almacenes/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import AddEditAlmacenModal from '@/components/almacenes/AddEditAlmacenModal';
import { getAlmacenes, saveAlmacen, deleteAlmacenById } from '@/lib/almacen-store';
import { type Almacen } from '@/lib/data';
import AlmacenCard from '@/components/almacenes/AlmacenCard';

export default function AlmacenesPage() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [almacenToEdit, setAlmacenToEdit] = useState<Almacen | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setAlmacenes(getAlmacenes());
  }, []);

  const refreshAlmacenes = () => setAlmacenes([...getAlmacenes()]);

  const handleSave = (data: Omit<Almacen, 'id' | 'inventario'>, id?: string) => {
    saveAlmacen(data, id);
    refreshAlmacenes();
  };

  const handleOpenEditModal = (almacen: Almacen) => {
    setAlmacenToEdit(almacen);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setAlmacenToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este almacén?')) {
      deleteAlmacenById(id);
      refreshAlmacenes();
    }
  };
  
  const filteredAlmacenes = almacenes.filter(almacen => {
    const query = searchQuery.toLowerCase();
    return (
      almacen.nombre.toLowerCase().includes(query) ||
      almacen.ubicacion.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Almacenes</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Crea, busca y administra los almacenes.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Almacén</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlmacenes.map(almacen => (
          <AlmacenCard key={almacen.id} almacen={almacen} />
        ))}
      </div>
      
      <AddEditAlmacenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        almacenToEdit={almacenToEdit}
      />
    </div>
  );
}