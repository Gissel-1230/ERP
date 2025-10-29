"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getTraspasos,
  requestTraspaso,
  updateTraspasoStatus,
  type AddTraspasoData
} from '@/lib/traspasos-store';
import { getProducts } from '@/lib/product-store';
import { getAlmacenes} from '@/lib/almacen-store';
import { type Traspaso, type Almacen, type GlobalProduct, type TraspasoStatus } from '@/lib/data';
import TraspasosTable from '@/components/traspasos/TraspasosTable';
import AddTraspasoModal from '@/components/traspasos/AddTraspasoModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TraspasosPage() {
  const { user, token } = useAuth();
  const [traspasos, setTraspasos] = useState<Traspaso[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [productos, setProductos] = useState<GlobalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserRole = user?.role_id;
  const currentUserId = user?.user_id;
  
  // Función para obtener los datos
  const fetchTraspasos = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await getTraspasos(token);
      setTraspasos(data);
    } catch (err: any) {
      setError(`Error al cargar traspasos: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  // Función para obtener almacenes y productos
  const fetchDependencies = useCallback(async () => {
    if (!token) return;

    try {
      const [almacenesData, productosData] = await Promise.all([
        getAlmacenes(token),
        getProducts(token)
      ]);
      setAlmacenes(almacenesData);
      setProductos(productosData);
    } catch (err: any) {
      console.error("Error al cargar dependencias:", err);
      // Aquí se podría mostrar un error más específico
    }
  }, [token]);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  useEffect(() => {
    fetchTraspasos();
  }, [fetchTraspasos]);


  // Función para crear un nuevo traspaso
  const handleRequestTraspaso = async (data: AddTraspasoData) => {
    if (!token) return;

    try {
      await requestTraspaso(data, token);
      alert('Solicitud de traspaso enviada exitosamente. Pendiente de aprobación.');
      setIsModalOpen(false);
      await fetchTraspasos(); // Recargar la lista
    } catch (err: any) {
      console.error(err);
      alert(`Error al solicitar traspaso: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (id: string, status: TraspasoStatus) => {
    if (!token) return;
    
    let apiStatus: 'APPROVED' | 'REJECTED';

    if (status === 'aceptado') {
        apiStatus = 'APPROVED';
    } else if (status === 'rechazado') {
        apiStatus = 'REJECTED';
    } else {
        alert("Estatus de operación inválido.");
        return;
    }
    // --------------------------------------------------------------------------

    const confirmMsg = apiStatus === 'APPROVED'
      ? "¿Estás seguro de APROBAR este traspaso? Esta acción moverá el stock y es irreversible."
      : "¿Estás seguro de RECHAZAR este traspaso? No se moverá el stock.";

    if (!window.confirm(confirmMsg)) return;

    try {
        // Llama a la API con el estatus en formato inglés (APPROVED o REJECTED)
        await updateTraspasoStatus(id, apiStatus, token); 
        alert(`Traspaso ${status} exitosamente.`);
        await fetchTraspasos(); // Recargar la lista para mostrar el nuevo estatus
    } catch (err: any) {
        console.error(err);
        alert(`Error al procesar traspaso: ${err.message}`); 
    }
  };


  if (loading) {
    return (
      <div className="space-y-4 p-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Traspasos</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Solicitar Traspaso
        </Button>
      </div>

      <TraspasosTable 
        traspasos={traspasos} 
        onUpdateStatus={handleUpdateStatus} 
        currentUserRole={currentUserRole}
      />

      {/* Modal para solicitud de traspaso */}
      <AddTraspasoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRequestTraspaso}
        almacenes={almacenes}
        productos={productos}
        currentUserId={currentUserId}
      />
    </div>
  );
}