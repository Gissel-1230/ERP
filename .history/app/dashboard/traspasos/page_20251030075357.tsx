// app/dashboard/traspasos/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  getTraspasos,
  requestTraspaso,
  updateTraspasoStatus,
  getKardexDetails,
  exportTraspasoToExcel,
  exportMonthlyKardex, // NUEVO
  updateTraspaso,
  type AddTraspasoData,
  type KardexMovement,
  type KardexRequestInfo,
} from "@/lib/traspasos-store";
import { getProducts } from "@/lib/product-store";
import { getAlmacenes } from "@/lib/almacen-store";
import {
  type Traspaso,
  type Almacen,
  type GlobalProduct,
  type TraspasoStatus,
} from "@/lib/data";

// Importa los componentes
import TraspasosTable from "@/components/traspasos/TraspasosTable";
import AddTraspasoModal from "@/components/traspasos/AddTraspasoModal";
import KardexModal from "@/components/traspasos/KardexModal";
import EditTraspasoModal from "@/components/traspasos/EditTraspasoModal";
import TraspasosDashboard from "@/components/traspasos/TraspasosDashboard";
import MonthlyKardexModal from "@/components/traspasos/MonthlyKardexModal"; // NUEVO
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Calendar } from "lucide-react"; // Agregado Calendar
import { Skeleton } from "@/components/ui/skeleton";
import Swal from "sweetalert2";

export default function TraspasosPage() {
  const { user, token, isLoading: isLoadingAuth } = useAuth();

  const [traspasos, setTraspasos] = useState<Traspaso[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [productos, setProductos] = useState<GlobalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isKardexModalOpen, setIsKardexModalOpen] = useState(false);
  const [kardexData, setKardexData] = useState<KardexMovement[]>([]);
  const [kardexLoading, setKardexLoading] = useState(false);
  const [kardexError, setKardexError] = useState<string | null>(null);
  const [kardexFolio, setKardexFolio] = useState("");
  const [kardexRequestInfo, setKardexRequestInfo] =
    useState<KardexRequestInfo | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [traspasoToEdit, setTraspasoToEdit] = useState<Traspaso | null>(null);

  // NUEVO: Estado para el modal de kardex mensual
  const [isMonthlyKardexModalOpen, setIsMonthlyKardexModalOpen] =
    useState(false);

  const currentUserRole = user?.role_id;

  const fetchTraspasos = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [traspasosData, almacenesData, productosData] = await Promise.all([
        getTraspasos(token),
        getAlmacenes(token),
        getProducts(token),
      ]);
      setTraspasos(traspasosData);
      setAlmacenes(almacenesData);
      setProductos(productosData);
    } catch (err: any) {
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTraspasos();
  }, [fetchTraspasos]);

  const handleRequestTraspaso = async (data: AddTraspasoData) => {
    if (!token) throw new Error("No autenticado");
    await requestTraspaso(data, token);
    //alert("Solicitud de traspaso enviada exitosamente.");
    Swal.fire({
      title: "Drag me!",
      icon: "success",
      draggable: true,
    });
    setIsAddModalOpen(false);
    await fetchTraspasos();
  };

  const handleUpdateStatus = async (
    id: string | number,
    status: "APPROVED" | "REJECTED"
  ) => {
    if (!token) return;
    const confirmMsg =
      status === "APPROVED"
        ? "¿Aprobar este traspaso?"
        : "¿Rechazar este traspaso?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await updateTraspasoStatus(id, status, token);
      alert(`Traspaso ${status === "APPROVED" ? "aprobado" : "rechazado"}.`);
      await fetchTraspasos();
    } catch (err: any) {
      alert(`Error al procesar traspaso: ${err.message}`);
    }
  };

  const handleOpenKardex = async (id: string | number, folio: string) => {
    if (!token) return;
    setKardexFolio(folio);
    setIsKardexModalOpen(true);
    setKardexLoading(true);
    setKardexError(null);
    try {
      const kardexDetails = await getKardexDetails(id, token);
      setKardexData(kardexDetails.movements);
      setKardexRequestInfo(kardexDetails.request_info);
    } catch (err: any) {
      setKardexError(err.message || "Error al obtener el reporte.");
    } finally {
      setKardexLoading(false);
    }
  };

  const handleOpenEditModal = (traspaso: Traspaso) => {
    setTraspasoToEdit(traspaso);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    await fetchTraspasos();
  };

  const handleExportExcel = async (id: string | number, folio: string) => {
    if (!token) return;
    try {
      await exportTraspasoToExcel(id, folio, token);
    } catch (error: any) {
      alert(`Error al descargar Excel: ${error.message}`);
    }
  };

  // NUEVO: Handler para descargar kardex mensual
  const handleDownloadMonthlyKardex = async (year: number, month: number) => {
    if (!token) return;
    try {
      await exportMonthlyKardex(year, month, token);
      alert("Reporte mensual descargado exitosamente.");
    } catch (error: any) {
      throw error; // Re-lanzar para que el modal lo maneje
    }
  };

  if (loading || isLoadingAuth) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gestión de Traspasos
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Movimientos de inventario entre almacenes.
          </p>
        </div>
        <div className="flex gap-3">
          {/* NUEVO: Botón para kardex mensual */}
          <Button
            onClick={() => setIsMonthlyKardexModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Kardex Mensual
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
            disabled={almacenes.length === 0 || productos.length === 0}
          >
            <Plus className="h-4 w-4" />
            Solicitar Traspaso
          </Button>
        </div>
      </div>

      {error && (
        <p className="p-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 rounded-lg">
          {error}
        </p>
      )}

      <TraspasosDashboard traspasos={traspasos} />

      <TraspasosTable
        traspasos={traspasos}
        onUpdateStatus={handleUpdateStatus}
        onOpenKardex={handleOpenKardex}
        onEdit={handleOpenEditModal}
        onExportExcel={handleExportExcel}
        currentUserRole={currentUserRole}
      />

      {isAddModalOpen && (
        <AddTraspasoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleRequestTraspaso}
          almacenes={almacenes}
          productos={productos}
          currentUserId={user?.user_id}
        />
      )}

      {isKardexModalOpen && (
        <KardexModal
          isOpen={isKardexModalOpen}
          onClose={() => setIsKardexModalOpen(false)}
          movements={kardexData}
          isLoading={kardexLoading}
          error={kardexError}
          folio={kardexFolio}
          requestInfo={kardexRequestInfo}
        />
      )}

      {isEditModalOpen && (
        <EditTraspasoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          traspaso={traspasoToEdit}
          onSave={handleSaveEdit}
        />
      )}

      {/* NUEVO: Modal de Kardex Mensual */}
      {isMonthlyKardexModalOpen && (
        <MonthlyKardexModal
          isOpen={isMonthlyKardexModalOpen}
          onClose={() => setIsMonthlyKardexModalOpen(false)}
          onDownload={handleDownloadMonthlyKardex}
        />
      )}
    </div>
  );
}
