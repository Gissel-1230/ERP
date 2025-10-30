"use client";
import { useState, useMemo } from 'react';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import type { KardexMovement, KardexRequestInfo } from '@/lib/traspasos-store'; 

interface KardexModalProps {
     isOpen: boolean;
     onClose: () => void;
     movements: KardexMovement[];
     isLoading: boolean;
     error: string | null;
     folio: string;
     requestInfo: KardexRequestInfo | null;
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
     const [selectedMonth, setSelectedMonth] = useState<string>('');

     const formatDate = (dateString: string | null): string => {
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
             return 'Fecha inválida';
         }
     };

     const availableMonths = useMemo(() => {
         const months = new Set<string>();
         movements.forEach(m => {
             try {
                 const date = new Date(m.fecha);
                 const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                 months.add(monthKey);
             } catch (e) {
                 console.error("Error procesando fecha:", m.fecha);
             }
         });
         return Array.from(months).sort().reverse();
     }, [movements]);

     const filteredMovements = useMemo(() => {
         if (!selectedMonth) return movements;
         
         return movements.filter(m => {
             try {
                 const date = new Date(m.fecha);
                 const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                 return monthKey === selectedMonth;
             } catch (e) {
                 return false;
             }
         });
     }, [movements, selectedMonth]);

     const formatMonthLabel = (monthKey: string): string => {
         try {
             const [year, month] = monthKey.split('-');
             const date = new Date(parseInt(year), parseInt(month) - 1);
             return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
         } catch (e) {
             return monthKey;
         }
     };

     const handleDownloadExcel = () => {
         if (!requestInfo) return;

         const monthLabel = selectedMonth ? formatMonthLabel(selectedMonth) : 'Todos los meses';
         
         const infoData = [
             ['REPORTE DE KARDEX - TRASPASO'],
             [''],
             ['Folio:', folio],
             ['Período:', monthLabel],
             [''],
             ['Producto:', requestInfo.product_name],
             ['Cantidad:', String(requestInfo.quantity)],
             ['Almacén Origen:', requestInfo.from_warehouse],
             ['Almacén Destino:', requestInfo.to_warehouse],
             [''],
             ['Fecha Solicitud:', new Date(requestInfo.request_date).toLocaleDateString('es-MX')],
             ['Solicitante:', requestInfo.requester_name],
             ['Estado:', requestInfo.status],
             [''],
             ['Fecha Aprobación:', requestInfo.approval_date 
                 ? new Date(requestInfo.approval_date).toLocaleDateString('es-MX') 
                 : 'Pendiente'
             ],
             ['Aprobador:', requestInfo.approver_name || 'Pendiente'],
         ];

         const movementsData: any[][] = [
             ['MOVIMIENTOS DE KARDEX'],
             ['Período:', monthLabel],
             [''],
             ['Fecha', 'Tipo', 'Cantidad', 'Producto', 'Almacén', 'Descripción']
         ];

         filteredMovements.forEach(mov => {
             movementsData.push([
                 new Date(mov.fecha).toLocaleString('es-MX'),
                 mov.tipo,
                 String(mov.cantidad),
                 mov.producto,
                 mov.almacen_afectado,
                 mov.descripcion
             ]);
         });

         const wb = XLSX.utils.book_new();
         
         const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
         XLSX.utils.book_append_sheet(wb, wsInfo, 'Información');
         
         const wsMovements = XLSX.utils.aoa_to_sheet(movementsData);
         XLSX.utils.book_append_sheet(wb, wsMovements, 'Movimientos');

         const fileName = selectedMonth 
             ? `Kardex_${folio}_${monthLabel.replace(/\s+/g, '_')}.xlsx`
             : `Kardex_${folio}_Completo.xlsx`;
         
         XLSX.writeFile(wb, fileName);
     };

     if (!isOpen) return null;

     return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
             <div className="relative w-full max-w-5xl rounded-xl bg-white dark:bg-slate-800 shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                 
                 {/* Header */}
                 <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                         Kardex de Traspaso - {folio}
                     </h2>
                     <Button 
                         onClick={handleDownloadExcel} 
                         variant="outline" 
                         size="sm"
                         disabled={isLoading || filteredMovements.length === 0}
                         className="flex items-center gap-2"
                     >
                         <Download className="h-4 w-4" />
                         Descargar Excel
                     </Button>
                 </div>

                 {/* Content */}
                 <div className="flex-grow overflow-y-auto p-6 space-y-6">
                     
                     {/* Filtro por Mes */}
                     {availableMonths.length > 0 && !isLoading && (
                         <div>
                             <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                 Filtrar por mes:
                             </label>
                             <select 
                                 value={selectedMonth} 
                                 onChange={(e) => setSelectedMonth(e.target.value)}
                                 className="w-full max-w-xs rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                             >
                                 <option value="">Todos los meses ({movements.length} movimientos)</option>
                                 {availableMonths.map(month => (
                                     <option key={month} value={month}>
                                         {formatMonthLabel(month)} ({movements.filter(m => {
                                             const date = new Date(m.fecha);
                                             const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                                             return key === month;
                                         }).length} movimientos)
                                     </option>
                                 ))}
                             </select>
                         </div>
                     )}

                     {/* Detalles del Traspaso */}
                     {requestInfo && !isLoading && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                             
                             {/* Columna 1: Información básica */}
                             <div className="space-y-3">
                                 <h3 className="font-semibold text-lg text-slate-900 dark:text-white border-b pb-2">
                                     Origen y Destino
                                 </h3>
                                 <div className="space-y-2 text-sm">
                                     <div>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Origen:</span>
                                         <p className="text-slate-900 dark:text-white">{requestInfo.from_warehouse}</p>
                                     </div>
                                     <div>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Destino:</span>
                                         <p className="text-slate-900 dark:text-white">{requestInfo.to_warehouse}</p>
                                     </div>
                                     <div>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Estatus:</span>
                                         <p className={`capitalize font-semibold ${
                                             requestInfo.status === 'APPROVED' ? 'text-green-600' :
                                             requestInfo.status === 'REJECTED' ? 'text-red-600' : 
                                             'text-amber-600'
                                         }`}>
                                             {requestInfo.status?.toLowerCase() || 'N/A'}
                                         </p>
                                     </div>
                                 </div>
                             </div>

                             {/* Columna 2: Producto */}
                             <div className="space-y-3">
                                 <h3 className="font-semibold text-lg text-slate-900 dark:text-white border-b pb-2">
                                     Producto
                                 </h3>
                                 <div className="space-y-2 text-sm">
                                     <div>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Producto:</span>
                                         <p className="text-slate-900 dark:text-white font-medium">{requestInfo.product_name}</p>
                                     </div>
                                     <div>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Cantidad:</span>
                                         <p className="text-slate-900 dark:text-white text-lg font-bold">{requestInfo.quantity}</p>
                                     </div>
                                 </div>
                             </div>

                             {/* Columna 3: Personas y Fechas */}
                             <div className="space-y-3">
                                 <h3 className="font-semibold text-lg text-slate-900 dark:text-white border-b pb-2">
                                     Seguimiento
                                 </h3>
                                 <div className="space-y-2 text-sm">
                                     <div>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Solicitante:</span>
                                         <p className="text-slate-900 dark:text-white">{requestInfo.requester_name}</p>
                                     </div>
                                     <div>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Fecha Solicitud:</span>
                                         <p className="text-slate-900 dark:text-white">{formatDate(requestInfo.request_date)}</p>
                                     </div>
                                     <div className={requestInfo.status !== 'APPROVED' ? 'opacity-50' : ''}>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Aprobador:</span>
                                         <p className="text-slate-900 dark:text-white">{requestInfo.approver_name || 'Pendiente'}</p>
                                     </div>
                                     <div className={requestInfo.status !== 'APPROVED' ? 'opacity-50' : ''}>
                                         <span className="font-medium text-slate-600 dark:text-slate-400">Fecha Aprobación:</span>
                                         <p className="text-slate-900 dark:text-white">{formatDate(requestInfo.approval_date)}</p>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Loading */}
                     {isLoading && (
                         <div className="text-center py-12">
                             <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" /> 
                             <p className="mt-3 text-slate-600 dark:text-slate-400">Cargando movimientos...</p>
                         </div>
                     )}
                     
                     {/* Error */}
                     {error && (
                         <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                             <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
                         </div>
                     )}

                     {/* Tabla de Movimientos */}
                     {!isLoading && !error && filteredMovements.length > 0 && (
                         <div>
                             <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">
                                 Movimientos de Kardex
                             </h3>
                             <div className="overflow-x-auto border rounded-lg dark:border-slate-700">
                                 <table className="w-full text-left text-sm">
                                     <thead className="bg-slate-100 dark:bg-slate-700">
                                         <tr>
                                             <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Fecha</th>
                                             <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Tipo</th>
                                             <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Producto</th>
                                             <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Cantidad</th>
                                             <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Almacén</th>
                                             <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Descripción</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                         {filteredMovements.map((m, index) => (
                                             <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                 <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                                                     {formatDate(m.fecha)}
                                                 </td>
                                                 <td className="px-4 py-3">
                                                     <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                         m.tipo.toLowerCase().includes('entrada') 
                                                             ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                             : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                     }`}>
                                                         {m.tipo}
                                                     </span>
                                                 </td>
                                                 <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                     {m.producto}
                                                 </td>
                                                 <td className="px-4 py-3 text-slate-900 dark:text-white font-semibold">
                                                     {m.cantidad}
                                                 </td>
                                                 <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                                                     {m.almacen_afectado}
                                                 </td>
                                                 <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                                                     {m.descripcion}
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                     )}

                     {/* Sin movimientos filtrados */}
                     {!isLoading && !error && filteredMovements.length === 0 && movements.length > 0 && (
                         <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                             No hay movimientos en el mes seleccionado.
                         </div>
                     )}

                     {/* Sin movimientos en absoluto */}
                     {!isLoading && !error && movements.length === 0 && requestInfo && (
                         <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                             No hay movimientos de inventario asociados. La solicitud está {requestInfo.status?.toLowerCase() || 'N/A'}.
                         </div>
                     )}
                 </div>

                 {/* Footer */}
                 <div className="flex justify-end p-6 border-t dark:border-slate-700">
                     <Button onClick={onClose}>Cerrar</Button>
                 </div>
             </div>
         </div>
     );
}