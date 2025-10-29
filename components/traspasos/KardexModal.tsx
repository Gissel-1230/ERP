// components/traspasos/KardexModal.tsx
"use client";
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Importamos las nuevas interfaces del store
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

    // Helper para formatear fechas
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-4xl rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Kardex de Traspaso - {folio}
                </h2>
                
                {/* --- BLOQUE DE DETALLES DE AUDITORÍA --- */}
                {requestInfo && !isLoading && (
                    <div className="border p-4 rounded-lg mb-6 bg-slate-50 dark:bg-slate-700/50">
                        <h3 className="font-semibold text-lg mb-3">Detalles del Traspaso:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm">
                            
                            <p className="col-span-full border-b pb-1 mb-2">
                               Producto: <strong>{requestInfo.product_name}</strong> | Cantidad: <strong>{requestInfo.quantity}</strong>
                            </p>
                            
                            <p><strong>Origen:</strong> {requestInfo.from_warehouse}</p>
                            <p><strong>Destino:</strong> {requestInfo.to_warehouse}</p>
                            <p><strong>Estatus:</strong> 
                                <span className="capitalize font-semibold">{requestInfo.status?.toLowerCase()}</span>
                            </p>

                            <p className="col-span-full mt-2"><strong>Solicitud:</strong></p>
                            <p><strong>Solicitante:</strong> {requestInfo.requester_name}</p>
                            <p><strong>Fecha Solicitud:</strong> {formatDate(requestInfo.request_date)}</p>

                            <p className="col-span-full mt-2"><strong>Aprobación:</strong></p>
                            <p className={requestInfo.status !== 'APPROVED' ? 'text-slate-500' : ''}>
                                <strong>Aprobador:</strong> {requestInfo.approver_name || 'N/A'}
                            </p>
                            <p className={requestInfo.status !== 'APPROVED' ? 'text-slate-500' : ''}>
                                <strong>Fecha Aprobación:</strong> {formatDate(requestInfo.approval_date)}
                            </p>
                        </div>
                    </div>
                )}
                {/* -------------------------------------- */}

                {isLoading && <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" /> Cargando movimientos...</div>}
                
                {error && <p className="text-red-500 text-center py-4">{error}</p>}

                {/* --- TABLA LIMPIA (SIN TEXTO BASURA) --- */}
                {!isLoading && !error && movements.length > 0 && (
                    <div className="overflow-x-auto max-h-[30vh]">
                        <table className="w-full text-left text-sm border">
                            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-2">Fecha</th>
                                    <th className="px-4 py-2">Tipo</th>
                                    <th className="px-4 py-2">Producto</th>
                                    <th className="px-4 py-2">Cantidad</th>
                                    <th className="px-4 py-2">Almacén Afectado</th>
                                    <th className="px-4 py-2">Descripción del Mov.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {movements.map((m, index) => (
                                    <tr key={index} className="border-t dark:border-slate-700">
                                        <td className="px-4 py-2 text-xs">{formatDate(m.fecha)}</td>
                                        <td className="px-4 py-2 text-xs font-semibold" style={{ color: m.tipo.includes('Entrada') ? 'green' : 'red' }}>
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

                {/* Mensajes de estado (si no hay movimientos) */}
                {!isLoading && !error && movements.length === 0 && requestInfo && (
                    <p className="py-4 text-center text-slate-500">
                        No hay movimientos de inventario asociados. La solicitud está {requestInfo.status?.toLowerCase()}.
                    </p>
                )}

                <div className="flex justify-end pt-4">
                    <Button onClick={onClose}>Cerrar</Button>
                </div>
            </div>
        </div>
    );
}