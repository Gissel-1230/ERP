// app/dashboard/almacenes/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getAlmacenById } from '@/lib/almacen-store'; // Asumimos que sigue leyendo de la caché
import { InventoryController } from '@/lib/inventory-store'; // <-- Importamos el nuevo store de inventario
import { type Almacen, type Inventario } from '@/lib/data';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import InventarioCard from '@/components/almacenes/InventarioCard'; 
import RegisterInitialStockModal from '@/components/almacenes/RegisterInitialStockModal'; // <-- Nuevo nombre del modal
import { useAuth } from '@/app/context/AuthContext'; 

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

  // --- Función para cargar/refrescar los datos del almacén (sigue usando store en memoria) ---
  const refreshAlmacen = () => {
    // Nota: getAlmacenById aún lee de la caché llenada por getAlmacenes.
    const currentAlmacenData = getAlmacenById(almacenId);
    setAlmacen(currentAlmacenData); // Actualiza con datos de memoria
    setIsLoading(false); // Asume que la carga terminó
  };

  // --- Carga inicial del almacén ---
  useEffect(() => {
    setIsLoading(true);
    if (!isLoadingAuth && token) {
        // Leemos de la caché del store (que se llenó en la página anterior)
        const initialData = getAlmacenById(almacenId);
        if (!initialData) { 
             setAlmacen(null); // 404
        } else {
             setAlmacen(initialData);
        }
        setIsLoading(false);
    } else if (!isLoadingAuth && !token) {
        setError("No autenticado.");
        setIsLoading(false);
        router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [almacenId, token, isLoadingAuth]); 

  // --- 👇 FUNCIÓN PARA REGISTRAR EL MOVIMIENTO (ON SAVE) 👇 ---
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
        
        // 2. Si es exitoso, MUESTRA MENSAJE DE ÉXITO (al ser un movimiento)
        alert(`Entrada de ${data.quantity} unidades registrada con éxito.`);

        // 3. Refresca la vista para ver el stock actualizado (desde la caché que el trigger actualizará)
        // Nota: Para ver el cambio, el trigger debe actualizar la DB, y la página principal
        //       de almacenes debe recargarse, lo cual actualiza la caché.
        //       Aquí solo refrescamos la vista actual (que lee de la caché).
        //       El stock real se actualizará en la DB.
        
        // *** ESTO ES CLAVE: Necesitamos actualizar la caché del store principal ***
        // Por ahora, solo cerramos el modal y forzamos la actualización de la página
        // para que la caché se actualice cuando se vuelva a la vista principal.
        
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

  const canAddMore = almacen.inventarios.length < 10; // Lógica original (ahora obsoleta)


  // --- JSX Principal ---
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Encabezado y Link Volver */}
      <div>
        <Link href="/dashboard/almacenes" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Volver a Almacenes
        </Link>
        <h1 className="text-4xl font-bold">{almacen.nombre}</h1>
        <p className="mt-2 text-lg text-slate-600">{almacen.ubicacion}</p>
        {almacen.descripcion && <p className="mt-1 text-base text-slate-500">{almacen.descripcion}</p>}
      </div>

      {/* Sección de Inventarios (Categorías) */}
      <div className="flex items-center justify-between border-t pt-6">
        <h2 className="text-2xl font-semibold">Stock por Categoría</h2>
        <button
          onClick={() => {setIsModalOpen(true); setSaveError(null);}} // Abre modal de stock
          disabled={isSaving} 
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Plus className="h-5 w-5" />
          <span>Registrar Entrada</span> 
        </button>
      </div>

      {/* Mostrar error general si existe y el modal está cerrado */}
      {error && !isModalOpen && <p className="text-center text-red-600">{error}</p>}


      {/* Grid de Inventarios (Categorías) */}
      {almacen.inventarios.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {almacen.inventarios.map(inventario => (
              <InventarioCard key={inventario.id} almacenId={almacen.id} inventario={inventario} />
            ))}
          </div>
      ) : (
          <p className="text-center text-slate-500 col-span-full">Este almacén aún no tiene productos asociados. Registra la primera entrada.</p>
      )}
      
      {/* Modal para Registrar Stock Inicial */}
      {isModalOpen && ( 
        <RegisterInitialStockModal
          isOpen={isModalOpen}
          onClose={() => {setIsModalOpen(false); setSaveError(null);}} 
          onSave={handleRegisterStock} 
          warehouseId={almacenId} // Pasa el ID del almacén actual
          isSaving={isSaving} 
          saveError={saveError} 
        />
      )}
    </div>
  );
}