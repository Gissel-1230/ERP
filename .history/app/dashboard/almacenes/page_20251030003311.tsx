"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import AddEditAlmacenModal from '@/components/almacenes/AddEditAlmacenModal';
import { getAlmacenes, saveAlmacen, deleteAlmacenById } from '@/lib/almacen-store';
import { type Almacen } from '@/lib/data'; // Ajusta la ruta si es necesario
import AlmacenCard from '@/components/almacenes/AlmacenCard';
import { useAuth } from '@/app/context/AuthContext'; // Importa useAuth
import { useRouter } from 'next/navigation'; // Importa useRouter

export default function AlmacenesPage() {
  const { token, logout, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter();

  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [almacenToEdit, setAlmacenToEdit] = useState<Almacen | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false); // Estado para el modal

  // Función para cargar/refrescar datos desde la API
  const refreshAlmacenes = async (authToken: string) => {
    setIsLoadingData(true);
    setError(null);
    try {
      const data = await getAlmacenes(authToken);
      setAlmacenes(data);
    } catch (err: any) {
      console.error("Error al cargar almacenes:", err);
      const defaultErrorMsg = "No se pudieron cargar los almacenes.";
      if (err.message === "401 Unauthorized" || err.message.includes("401")) {
         setError("Sesión expirada. Redirigiendo al login...");
         logout();
         setTimeout(() => router.push('/'), 1500);
      } else {
          setError(err.message || defaultErrorMsg);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // Carga inicial de datos
  useEffect(() => {
    if (isLoadingAuth) {
      setIsLoadingData(true);
      return;
    }
    if (token) {
      refreshAlmacenes(token);
    } else {
      setError("No estás autenticado. Redirigiendo...");
      setIsLoadingData(false);
      setTimeout(() => router.push('/'), 1500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoadingAuth]); // Depende del token y estado de auth

  // --- Funciones CRUD ---
  const handleSave = async (data: Omit<Almacen, 'id' | 'inventarios'>, id?: string) => {
    setIsSaving(true);
    setError(null);
    try {
        // Llama a la nueva función async del store, pasando datos y token
        await saveAlmacen(data, token, id);
        // Si fue exitoso, refresca la lista desde la API
        if(token) await refreshAlmacenes(token);
        setIsModalOpen(false); // Cierra modal
    } catch (err: any) {
        console.error("Error al guardar almacén:", err);
        // Muestra el error (podrías mostrarlo dentro del modal también)
        setError(err.message || "No se pudo guardar el almacén.");
        // Mantenemos el modal abierto si hay error
    } finally {
        setIsSaving(false);
    }
  };

const handleDelete = async (id: string) => {
  // 1. Pregunta con SweetAlert2
  const result = await showAlert({
    title: '¿Estás seguro?',
    text: 'Esta acción no puede revertirse. El almacén se eliminará de manera permanente.',
    icon: 'warning',
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#d32f2f',    // Rojo fuerte para acción peligrosa
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#3085d6',     // Azul por default
  });

  if (result.isConfirmed) {
    setError(null);
    try {
      await deleteAlmacenById(id, token);
      // Refresca lista si fue exitoso
      if (token) await refreshAlmacenes(token);
    } catch (err: any) {
      console.error("Error al eliminar almacén:", err);
      setError(err.message || "No se pudo eliminar el almacén.");
      setTimeout(() => { setError(null); }, 5000);
    }
  }
};


  // --- Funciones para abrir modales ---
  const handleOpenEditModal = (almacen: Almacen) => {
    setAlmacenToEdit(almacen);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setAlmacenToEdit(null);
    setIsModalOpen(true);
  };

  // --- Filtrado ---
  const filteredAlmacenes = almacenes.filter(almacen => {
    const query = searchQuery.toLowerCase();
    const nombreMatch = almacen.nombre?.toLowerCase().includes(query) ?? false;
    const ubicacionMatch = almacen.ubicacion?.toLowerCase().includes(query) ?? false;
    return nombreMatch || ubicacionMatch;
  });

  // --- Renderizado Condicional ---
  const renderContent = () => {
    if (isLoadingData) {
      return (
        <div className="flex h-48 w-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        </div>
      );
    }
    if (error && !isModalOpen) { // Solo muestra error general si el modal está cerrado
      return <p className="text-center text-red-600">{error}</p>;
    }
    if (filteredAlmacenes.length === 0 && !searchQuery) {
      return <p className="text-center text-slate-500">Aún no hay almacenes. ¡Agrega el primero!</p>;
    }
     if (filteredAlmacenes.length === 0 && searchQuery) {
      return <p className="text-center text-slate-500">No se encontraron almacenes para "{searchQuery}".</p>;
    }
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlmacenes.map(almacen => (
          <AlmacenCard
             key={almacen.id}
             almacen={almacen}
             onEdit={() => handleOpenEditModal(almacen)}
             onDelete={() => handleDelete(almacen.id)}
           />
        ))}
      </div>
    );
  };

  // --- JSX Principal ---
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Encabezado y botón */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Almacenes</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Crea, busca y administra los almacenes.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          disabled={isLoadingData || isSaving} // Deshabilita si carga datos o si guarda
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 w-full md:w-auto disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Almacén</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoadingData} // Deshabilita mientras carga
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 disabled:opacity-50"
        />
      </div>

      {/* Contenido (Carga, Error, Tarjetas) */}
      {renderContent()}

      {/* Modal */}
      {isModalOpen && ( // Renderiza el modal solo si está abierto
        <AddEditAlmacenModal
          isOpen={isModalOpen}
          onClose={() => {setIsModalOpen(false); setError(null);}} // Limpia error al cerrar
          onSave={handleSave}
          almacenToEdit={almacenToEdit}
          isSaving={isSaving} 
          saveError={error && isSaving ? error : null} 
        />
      )}
    </div>
  );
}