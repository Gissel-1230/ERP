// app/dashboard/almacenes/[id]/[inventarioId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getAlmacenById, getAlmacenes } from '@/lib/almacen-store'; 
import { InventoryController } from '@/lib/inventory-store'; 
import { type Almacen, type Inventario, type Producto } from '@/lib/data';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ProductosTable from '@/components/almacenes/ProductosTable';
import RegisterInitialStockModal from '@/components/almacenes/RegisterInitialStockModal'; 
import AdjustStockModal from '@/components/almacenes/AdjustStockModal'; 
import { useAuth } from '@/app/context/AuthContext'; 
import { showAlert } from '@/components/common/sweetAlert';

export default function InventarioDetailPage() {
  const params = useParams();
  const almacenId = params.id as string; 
  const inventarioId = params.inventarioId as string;
  const router = useRouter(); 
  const { token, logout, isLoading: isLoadingAuth } = useAuth(); 

  const [inventario, setInventario] = useState<Inventario | null | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [saveError, setSaveError] = useState<string | null>(null); 

  // Estados para los modales
  const [isInitialStockModalOpen, setIsInitialStockModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false); 
  const [productToAdjust, setProductToAdjust] = useState<Producto | null>(null); 

  // --- Función para refrescar datos (llama a la API) ---
  const refreshInventarioView = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
        await getAlmacenes(token); 
        const almacen = getAlmacenById(almacenId);
        const inventarioData = almacen?.inventarios.find(inv => inv.id === inventarioId);
        setInventario(inventarioData || null);
    } catch (e: any) {
        console.error("Error refrescando inventario:", e);
        setInventario(null);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Si el AuthContext (isLoadingAuth) aún está cargando, esperamos.
    if (isLoadingAuth) {
        console.log("useEffect: AuthContext está cargando, esperando...");
        return; 
    }

    // 2. Si AuthContext terminó y NO hay token, redirigimos.
    if (!token) {
        console.log("useEffect: No hay token, redirigiendo.");
        setError("No autenticado.");
        setIsLoading(false); // Detenemos el spinner
        router.push('/');
        return;
    }

    // 3. Si AuthContext terminó y SÍ hay token, cargamos los datos.
    console.log("useEffect: Token encontrado, revisando caché...");
    const almacen = getAlmacenById(almacenId);
    const inventarioData = almacen?.inventarios.find(inv => inv.id === inventarioId);
    
    // Si no encontramos el almacén o el inventario en la caché (porque está vacía o no existe),
    // llamamos a la API para refrescar.
    if (!almacen || !inventarioData) { 
        console.log("useEffect: Cache miss, refrescando desde API...");
        refreshInventarioView(); // Esta función ya maneja setIsLoading(false)
    } else {
        // 5. Si está en caché, cargamos y detenemos el spinner.
        console.log("useEffect: Cache hit, cargando datos.");
        setInventario(inventarioData);
        setIsLoading(false); 
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [almacenId, inventarioId, token, isLoadingAuth, router]); // <-- Añadido 'router'
  
  // --- Función para REGISTRAR STOCK INICIAL (Botón '+') ---
  const handleRegisterStock = async (
    data: { product_id: number; warehouse_id: number; quantity: number; description: string; movement_type: 'IN'; }
  ) => {
    setIsSaving(true);
    setSaveError(null);
    try {
        if (!token) throw new Error("Token no proporcionado.");
        await InventoryController.registerMovement(data, token); 
        alert(`Entrada de ${data.quantity} unidades registrada.`);
        
        await refreshInventarioView(); // <-- Refresca la vista
        
        setIsInitialStockModalOpen(false); 
    } catch (err: any) {
        setSaveError(err.message || "Error al registrar stock.");
    } finally {
        setIsSaving(false);
    }
  };

  // --- Función para AJUSTAR STOCK (Botón 'Editar') ---
  const handleAdjustStock = async (
    data: { product_id: number; quantity: number; movement_type: 'ADJUST-IN' | 'ADJUST-OUT'; description: string; }
  ) => {
    setIsSaving(true);
    setSaveError(null);
    const rawWarehouseId = almacenId.split('-')[1];

    try {
        if (!token) throw new Error("Token no proporcionado.");
        
        const movementData = {
            ...data,
            warehouse_id: parseInt(rawWarehouseId, 10),
        };

        await InventoryController.registerMovement(movementData, token); 
        
        alert(`Ajuste (${data.movement_type}) de ${data.quantity} unidades registrado.`);
        
        await refreshInventarioView(); // <-- Refresca la vista
        
        setIsAdjustModalOpen(false); // Cierra el modal de ajuste

    } catch (err: any) {
        setSaveError(err.message || "Error al registrar ajuste.");
    } finally {
        setIsSaving(false);
    }
  };

  // --- Manejadores de Botones (Editar y Eliminar) ---
  const handleOpenAdjustModal = (producto: Producto) => {
    setProductToAdjust(producto); 
    setIsAdjustModalOpen(true);   
  };

  const handleDeleteStock = (producto: Producto) => {
    if (window.confirm(`¿Estás seguro de AJUSTAR A CERO el stock de ${producto.nombre}?
Esta acción registrará una SALIDA por ${producto.cantidad} unidades.`)) { 
        
        const rawProductId = String(producto.id).split('-')[1] || producto.id;

        handleAdjustStock({
            product_id: parseInt(String(rawProductId), 10),
            quantity: producto.cantidad,
            movement_type: 'ADJUST-OUT',
            description: `Ajuste a CERO por eliminación manual.`
        });
    }
  };

  // --- (Renderizado condicional) ---
  if (inventario === undefined || isLoadingAuth || isLoading) return (
      <div className="flex h-64 w-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
  ); 
  if (inventario === null) notFound();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Encabezado y Link Volver */}
      <div>
        <Link href={`/dashboard/almacenes/${almacenId}`} className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Volver al Almacén
        </Link>
        <h1 className="text-4xl font-bold">{inventario.nombre}</h1>
        <p className="mt-2 text-lg text-slate-600">{inventario.descripcion}</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Productos en Inventario</h3>
          <button
            onClick={() => {setIsInitialStockModalOpen(true); setSaveError(null);}} 
            disabled={isSaving || isLoading} 
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Plus className="h-5 w-5" />
            <span>Registrar Entrada</span> 
          </button>
        </div>
        <div className="mt-4">
          <ProductosTable 
            inventario={inventario.productos}
            onEdit={handleOpenAdjustModal}   
            onDelete={handleDeleteStock}
          />
        </div>
      </div>
      
      {/* Modal para Registrar Stock INICIAL */}
      {isInitialStockModalOpen && ( 
        <RegisterInitialStockModal
            isOpen={isInitialStockModalOpen}
            onClose={() => {setIsInitialStockModalOpen(false); setSaveError(null);}} 
            onSave={handleRegisterStock} 
            warehouseId={almacenId}
            isSaving={isSaving} 
            saveError={saveError} 
        />
      )}
      
      {/* MODAL PARA AJUSTAR STOCK (Editar/Eliminar) */}
      {isAdjustModalOpen && productToAdjust && ( 
        <AdjustStockModal
            isOpen={isAdjustModalOpen}
            onClose={() => {setIsAdjustModalOpen(false); setSaveError(null); setProductToAdjust(null);}} 
            onSave={handleAdjustStock} 
            productToAdjust={productToAdjust} 
            isSaving={isSaving} 
            saveError={saveError} 
        />
      )}
    </div>
  );
}