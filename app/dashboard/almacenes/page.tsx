// app/dashboard/almacenes/page.tsx

"use client";

import { useState } from 'react'; // Eliminamos useEffect
import { Plus, Search } from 'lucide-react';
import AlmacenesTable from '@/components/almacenes/AlmacenesTable';
import AddEditAlmacenModal from '@/components/almacenes/AddEditAlmacenModal';
import { getAlmacenes, saveAlmacen, deleteAlmacenById } from '@/lib/almacen-store';
import { type Almacen } from '@/lib/data';

export default function AlmacenesPage() {
  // highlight-start
  // Inicializamos el estado directamente con los datos del store.
  const [almacenes, setAlmacenes] = useState<Almacen[]>(() => getAlmacenes());
  // highlight-end
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [almacenToEdit, setAlmacenToEdit] = useState<Almacen | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Ya no necesitamos useEffect para cargar los datos iniciales.

  const refreshAlmacenes = () => {
    // Obtenemos una nueva copia de los datos desde el store para forzar el re-renderizado.
    setAlmacenes([...getAlmacenes()]);
  };

  const handleSave = (data: Omit<Almacen, 'id' | 'materiaPrima' | 'productos' | 'insumos'>, id?: string) => {
    saveAlmacen(data, id);
    refreshAlmacenes();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este almacén?')) {
      deleteAlmacenById(id);
      refreshAlmacenes();
    }
  };

  const handleOpenEditModal = (almacen: Almacen) => {
    setAlmacenToEdit(almacen);
    setIsModalOpen(true);
  };
  
  const handleOpenAddModal = () => {
    setAlmacenToEdit(null);
    setIsModalOpen(true);
  };
  
  const filteredAlmacenes = almacenes.filter(almacen => {
    const query = searchQuery.toLowerCase();
    return (
      almacen.nombre.toLowerCase().includes(query) ||
      almacen.ubicacion.toLowerCase().includes(query) ||
      almacen.materiaPrima.some(item => item.nombre.toLowerCase().includes(query)) ||
      almacen.productos.some(item => item.nombre.toLowerCase().includes(query)) ||
      almacen.insumos.some(item => item.nombre.toLowerCase().includes(query))
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
          placeholder="Buscar por almacén, producto, insumo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
        />
      </div>

      <AlmacenesTable
        almacenes={filteredAlmacenes}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />
      
      <AddEditAlmacenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        almacenToEdit={almacenToEdit}
      />
    </div>
  );
}