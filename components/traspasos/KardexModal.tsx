"use client";
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Importamos las interfaces del store
import type { KardexMovement, KardexRequestInfo } from '@/lib/traspasos-store'; 

interface KardexModalProps {
     isOpen: boolean;
     onClose: () => void;
     movements: KardexMovement[];
     isLoading: boolean;
     error: string | null;
     folio: string;
     requestInfo: KardexRequestInfo | null; // Acepta null
}

export default function KardexModal({ 
     isOpen, 
     onClose, 
     movements, 
     isLoading, 
     error, 
     folio, 
     requestInfo 
}: KardexModalProps) {
     if (!isOpen) return null;

     // Helper para formatear fechas (más robusto)
     const formatDate = (dateString: string | null): string => { // <-- Explicitamente devuelve string
         if (!dateString) return 'N/A';
         try {
             return new Date(dateString).toLocaleString('es-MX', {
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric',
                 hour: '2-digit',
                 minute: '2-digit'
             });
         } catch (e) {
             console.error("Error formateando fecha:", dateString, e);
             return 'Fecha inválida'; // <-- Devuelve string en caso de error
         }
     };

     return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
             <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex-shrink-0">
                     Kardex de Traspaso - {folio}
                 </h2>

                 <div className="flex-grow overflow-y-auto pr-2 space-y-6"> 

                    {/* --- BLOQUE DE DETALLES --- */}
                    {requestInfo && !isLoading && (
                        <div className="border p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-sm">
                           <h3 className="font-semibold text-lg mb-3">Detalles del Traspaso:</h3>
                           <p className="border-b pb-2 mb-3">
                               <strong>Producto:</strong> {requestInfo.product_name} | <strong>Cantidad:</strong> {requestInfo.quantity}
                           </p>
                           <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                              <p><strong>Origen:</strong> {requestInfo.from_warehouse}</p>
                              <p><strong>Destino:</strong> {requestInfo.to_warehouse}</p>
                              <p><strong>Estatus:</strong> 
                                {/* highlight-start */}
                                {/* Aseguramos fallback si status es null/undefined */}
                                <span className="capitalize font-semibold">{requestInfo.status?.toLowerCase() || 'N/A'}</span>
                                {/* highlight-end */}
                              </p>
                           </div>
                           <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-t pt-3 mb-3">
                              <p><strong>Solicitante:</strong> {requestInfo.requester_name}</p>
                              {/* highlight-start */}
                              {/* Llamamos a formatDate asegurando que devuelve string */}
                              <p><strong>Fecha Solicitud:</strong> {formatDate(requestInfo.request_date)}</p>
                              {/* highlight-end */}
                           </div>
                           <div className={`flex flex-col sm:flex-row sm:justify-between gap-2 border-t pt-3 ${requestInfo.status !== 'APPROVED' ? 'text-slate-500 dark:text-slate-400' : ''}`}>
                              {/* highlight-start */}
                              {/* Aseguramos fallback si approver_name es null */}
                              <p><strong>Aprobador:</strong> {requestInfo.approver_name || 'N/A'}</p>
                              {/* Llamamos a formatDate asegurando que devuelve string */}
                              <p><strong>Fecha Aprobación:</strong> {formatDate(requestInfo.approval_date)}</p>
                              {/* highlight-end */}
                           </div>
                        </div>
                    )}
                    {/* -------------------------------------- */}

                    {isLoading && <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" /> Cargando movimientos...</div>}
                    
                    {error && <p className="text-red-500 text-center py-4">{error}</p>}

                    {/* --- TABLA CON SCROLL --- */}
                    {!isLoading && !error && movements.length > 0 && (
                        <div className="overflow-y-auto max-h-[40vh] border rounded-lg dark:border-slate-700"> 
                           <table className="w-full text-left text-sm">
                             <thead className="sticky top-0 bg-slate-100 dark:bg-slate-700">
                                 <tr>
                                     <th className="px-4 py-2">Fecha</th>
                                     <th className="px-4 py-2">Tipo</th>
                                     <th className="px-4 py-2">Producto</th>
                                     <th className="px-4 py-2">Cantidad</th>
                                     <th className="px-4 py-2">Almacén</th>
                                     <th className="px-4 py-2">Descripción</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                 {movements.map((m, index) => (
                                     <tr key={index}>
                                         <td className="px-4 py-2 text-xs">{formatDate(m.fecha)}</td>
                                         <td className="px-4 py-2 text-xs font-semibold" style={{ color: m.tipo.toLowerCase().includes('entrada') ? '#22c55e' : '#ef4444' }}>
                                             {m.tipo}
                                         </td>
                                         <td className="px-4 py-2 text-sm">{m.producto}</td>
                                         <td className="px-4 py-2">{m.cantidad}</td>
                                         <td className="px-4 py-2 text-xs">{m.almacen_afectado}</td>
                                         <td className="px-4 py-2 text-xs">{m.descripcion}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}

                 {!isLoading && !error && movements.length === 0 && requestInfo && (
                     <p className="py-4 text-center text-slate-500 dark:text-slate-400">
                         No hay movimientos de inventario asociados. La solicitud está {requestInfo.status?.toLowerCase() || 'N/A'}.
                     </p>
                 )}
                </div> {/* Fin del contenido con scroll */}

                <div className="flex justify-end pt-4 flex-shrink-0">
                    <Button onClick={onClose}>Cerrar</Button>
                </div>
            </div>
        </div>
    );
}