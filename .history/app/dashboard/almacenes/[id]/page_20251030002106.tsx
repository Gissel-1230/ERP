// app/dashboard/almacenes/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getAlmacenById, getAlmacenes } from '@/lib/almacen-store'; 
import { InventoryController } from '@/lib/inventory-store'; 
import { type Almacen, type Inventario } from '@/lib/data';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import InventarioCard from '@/components/almacenes/InventarioCard'; 
import RegisterInitialStockModal from '@/components/almacenes/RegisterInitialStockModal'; 
import { useAuth } from '@/app/context/AuthContext'; 
import { showAlert } from '@/components/common/sweetAlert';

export default function AlmacenDetailPage() {
  const params = useParams();
  const almacenId = params.id as string;
  const router = useRouter(); 
  const { token, logout, isLoading: isLoadingAuth } = useAuth(); 

  const [almacen, setAlmacen] = useState<Almacen | null | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [saveError, setSaveError] = useState<string | null>(null); 

  // alert(`Entrada de ${data.quantity} unidades registrada con éxito.`);
  const result = await showAlert(id: string | number) => {
    title: "Ingreso éxitoso",
    text:`Entrada de ${data.quantity} unidades registrada con éxito.`,
    icon: successful,
  };

  // FUNCIÓN refreshAlmacen (AHORA ES ASÍNCRONA Y USA LA API)
  const refreshAlmacen = async (authToken: string | null) => {
    // Para ver el stock actualizado, DEBEMOS llamar a la API de nuevo
    // para que el back-end recalcule el stock con los nuevos movimientos.
    console.log("Refrescando datos del almacén desde la API...");
    setIsLoading(true);
    try {
        if (!authToken) throw new Error("No autenticado");
        
        // 1. Llama a getAlmacenes (que llama a la API) para refrescar la caché
        await getAlmacenes(authToken); 
        
        // 2. Lee de la caché recién actualizada
        const currentAlmacenData = getAlmacenById(almacenId); 
        if (currentAlmacenData) {
            setAlmacen(currentAlmacenData);
        } else {
            setAlmacen(null); // No encontrado
        }
    } catch (err: any) {
         console.error("Error al refrescar almacén:", err);
         setError("No se pudieron recargar los datos.");
         if (err.message.includes("401")) logout(); // Cierra sesión si el token expiró
    } finally {
        setIsLoading(false);
    }
  };

  // --- Carga inicial del almacén ---
  useEffect(() => {
    if (!isLoadingAuth && token) {
        // Leemos de la caché del store (que se llenó en la página anterior)
        const initialData = getAlmacenById(almacenId);
        
        // Si la caché está vacía (ej. recarga de página), la llenamos
        if (!initialData) { 
             console.warn("Caché vacía o ítem no encontrado, cargando datos...");
             refreshAlmacen(token); // Llama a la API
        } else {
             setAlmacen(initialData); // Usa la caché
             setIsLoading(false);
        }
    } else if (!isLoadingAuth && !token) {
        setError("No autenticado.");
        setIsLoading(false);
        router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [almacenId, token, isLoadingAuth]); 

  // --- FUNCIÓN PARA REGISTRAR EL MOVIMIENTO (ON SAVE) ---
  const handleRegisterStock = async (
    data: { 
        product_id: number; 
        warehouse_id: number; 
        quantity: number; 
        description: string; 
        movement_type: 'IN'; 
    }
  ) => {
    setIsSaving(true);
    setSaveError(null);
    try {
        if (!token) throw new Error("Token no proporcionado.");
        
        // 1. Llama a la API para registrar el movimiento
        await InventoryController.registerMovement(data, token); 
        
        // 2. Si es exitoso, MUESTRA MENSAJE DE ÉXITO
        alert(`Entrada de ${data.quantity} unidades registrada con éxito.`);

        // 3. REFRESCA LOS DATOS DE LA API
        await refreshAlmacen(token);
        
        setIsModalOpen(false); 
        
    } catch (err: any) {
        console.error("Error al registrar stock:", err);
        setSaveError(err.message || "Error al registrar stock inicial.");
    } finally {
        setIsSaving(false);
    }
  };


  // --- Renderizado Condicional ---
  if (isLoading || isLoadingAuth) return ( 
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
  ); 
  
  if (almacen === null) notFound(); 
  if (!almacen) return <div>{error || "Error al cargar el almacén."}</div>; 

  // --- JSX Principal (SIN CAMBIOS) ---
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* ... (Tu JSX existente para el encabezado) ... */}
      <div>
        <Link href="/dashboard/almacenes" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Volver a Almacenes
        </Link>
        <h1 className="text-4xl font-bold">{almacen.nombre}</h1>
        <p className="mt-2 text-lg text-slate-600">{almacen.ubicacion}</p>
        {almacen.descripcion && <p className="mt-1 text-base text-slate-500">{almacen.descripcion}</p>}
      </div>

      {/* ... (Tu JSX existente para la sección de inventarios y el botón) ... */}
      <div className="flex items-center justify-between border-t pt-6">
        <h2 className="text-2xl font-semibold">Stock por Categoría</h2>
        <button
          onClick={() => {setIsModalOpen(true); setSaveError(null);}} 
          disabled={isSaving || isLoading} // <-- Actualizado a isLoading
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Plus className="h-5 w-5" />
          <span>Registrar Entrada</span> 
        </button>
      </div>

      {error && !isModalOpen && <p className="text-center text-red-600">{error}</p>}

      {almacen.inventarios.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {almacen.inventarios.map(inventario => (
              <InventarioCard key={inventario.id} almacenId={almacen.id} inventario={inventario} />
            ))}
          </div>
      ) : (
          <p className="text-center text-slate-500 col-span-full">Este almacén aún no tiene productos asociados. Registra la primera entrada.</p>
      )}
      
      {/* ... (Tu JSX existente para el modal) ... */}
      {isModalOpen && ( 
        <RegisterInitialStockModal
          isOpen={isModalOpen}
          onClose={() => {setIsModalOpen(false); setSaveError(null);}} 
          onSave={handleRegisterStock} 
          warehouseId={almacenId} 
          isSaving={isSaving} 
          saveError={saveError} 
        />
      )}
    </div>
  );
}