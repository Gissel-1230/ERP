// app/dashboard/traspasos/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getTraspasos,
  requestTraspaso,
  updateTraspasoStatus,
  getKardexDetails,
  type AddTraspasoData,
  type KardexMovement,
  type KardexRequestInfo, 
} from '@/lib/traspasos-store';
import { getProducts } from '@/lib/product-store';
import { getAlmacenes} from '@/lib/almacen-store';
import { type Traspaso, type Almacen, type GlobalProduct, type TraspasoStatus } from '@/lib/data';

// Importa los componentes
import TraspasosTable from '@/components/traspasos/TraspasosTable';
import AddTraspasoModal from '@/components/traspasos/AddTraspasoModal';
import KardexModal from '@/components/traspasos/KardexModal'; 
import TraspasosDashboard from '@/components/traspasos/TraspasosDashboard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


export default function TraspasosPage() {
  const { user, token, isLoading: isLoadingAuth } = useAuth();
  
  // Estados de Datos Maestros y Traspasos
  const [traspasos, setTraspasos] = useState<Traspaso[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [productos, setProductos] = useState<GlobalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de Solicitud
  const [error, setError] = useState<string | null>(null);

  // --- ESTADOS PARA EL KARDEX ---
  const [isKardexModalOpen, setIsKardexModalOpen] = useState(false);
  const [kardexData, setKardexData] = useState<KardexMovement[]>([]);
  const [kardexLoading, setKardexLoading] = useState(false);
  const [kardexError, setKardexError] = useState<string | null>(null);
  const [kardexFolio, setKardexFolio] = useState('');
  const [kardexRequestInfo, setKardexRequestInfo] = useState<KardexRequestInfo | null>(null); 
  // -----------------------------

  const currentUserRole = user?.role_id;
  const currentUserId = user?.user_id;
  
  // Función para obtener los datos
  const fetchTraspasos = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const [traspasosData, almacenesData, productosData] = await Promise.all([
        getTraspasos(token),
        getAlmacenes(token),
        getProducts(token)
      ]);
      setTraspasos(traspasosData);
      setAlmacenes(almacenesData);
      setProductos(productosData);
    } catch (err: any) {
      setError(`Error al cargar datos: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  
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
      throw err; // Re-lanzar para que el modal lo maneje
    }
  };

  // Función para APROBAR/RECHAZAR
  const handleUpdateStatus = async (id: string, status: TraspasoStatus) => {
    if (!token) return;
    
    const apiStatus = status.toUpperCase() as 'APPROVED' | 'REJECTED';

    const confirmMsg = apiStatus === 'APPROVED'
      ? "¿Estás seguro de APROBAR este traspaso? Esta acción moverá el stock y es irreversible."
      : "¿Estás seguro de RECHAZAR este traspaso? No se moverá el stock.";

    if (!window.confirm(confirmMsg)) return;

    try {
        await updateTraspasoStatus(id, apiStatus, token); 
        alert(`Traspaso ${status} exitosamente.`);
        await fetchTraspasos();
    } catch (err: any) {
        console.error(err);
        alert(`Error al procesar traspaso: ${err.message}`); 
    }
  };
  
  // --- FUNCIÓN PARA OBTENER Y MOSTRAR KARDEX ---
  const handleDownloadKardex = async (id: string | number, folio: string) => {
      setKardexFolio(folio);
      setIsKardexModalOpen(true);
      setKardexLoading(true);
      setKardexError(null);
      setKardexRequestInfo(null);

      try {
          if (!token) throw new Error("Token no disponible.");
          
          const kardexDetails = await getKardexDetails(id, token); 
          
          setKardexData(kardexDetails.movements);
          setKardexRequestInfo(kardexDetails.request_info); 

      } catch (err: any) {
          setKardexError(err.message || "Error al obtener el reporte de movimientos.");
          setKardexData([]);
          setKardexRequestInfo(null);
      } finally {
          setKardexLoading(false);
      }
  };


  if (loading || isLoadingAuth) {
    return (
      <div className="space-y-4 p-8">
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>
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
      
      {/* Puedes incluir tu TraspasosDashboard si lo tienes */}
      {/* <TraspasosDashboard traspasos={traspasos} /> */}

      <TraspasosTable 
        traspasos={traspasos} 
        onUpdateStatus={handleUpdateStatus} 
        onDownloadKardex={handleDownloadKardex} 
        currentUserRole={currentUserRole}
      />

      {/* Modal para solicitud de traspaso */}
      {isModalOpen && (
        <AddTraspasoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleRequestTraspaso}
          almacenes={almacenes}
          productos={productos}
        />
      )}
      
      {/* --- MODAL DE VISUALIZACIÓN KARDEX --- */}
      {isKardexModalOpen && (
          <KardexModal
              isOpen={isKardexModalOpen}
              onClose={() => setIsKardexModalOpen(false)}
              movements={kardexData}
              isLoading={kardexLoading}
              error={kardexError}
              folio={kardexFolio}
              requestInfo={kardexRequestInfo || {} as KardexRequestInfo}
          />
      )}
    </div>
  );
}