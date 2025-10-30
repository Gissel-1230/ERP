"use client"; 
import { type Traspaso, type TraspasoStatus } from '@/lib/data';
import { Check, X, FileClock, Download, Eye, Pencil, FileSpreadsheet, Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'; 
import { PDFDownloadLink } from '@react-pdf/renderer';
import TraspasoPDF from './TraspasoPDF';
import React from 'react';

interface TraspasosTableProps {
  traspasos: Traspaso[];
  onUpdateStatus: (id: string | number, status: 'APPROVED' | 'REJECTED') => void;
  onOpenKardex: (id: string | number, folio: string) => void;
  onEdit: (traspaso: Traspaso) => void; 
  onExportExcel: (id: string | number, folio: string) => void; 
  currentUserRole?: number;
}

const EstatusIcon = ({ estatus }: { estatus: string | TraspasoStatus }) => {
  const lowerStatus = String(estatus).toLowerCase();
  if (lowerStatus === 'approved') return <Check className="h-4 w-4 text-green-500" />;
  if (lowerStatus === 'rejected') return <X className="h-4 w-4 text-red-500" />;
  return <FileClock className="h-4 w-4 text-amber-500" />; 
};

export default function TraspasosTable({ 
  traspasos, 
  onUpdateStatus,
  onOpenKardex,
  onEdit,
  onExportExcel,
  currentUserRole 
}: TraspasosTableProps) {
 
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-MX', { year: '2-digit', month: '2-digit', day: '2-digit' });
    } catch (e) { return dateString; }
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 uppercase dark:bg-slate-700">
          <tr>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold">Folio</th>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold">Producto</th>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold">Cant.</th>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold">Alm. Salida</th>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold">Alm. Entrada</th>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold">Fecha Sol.</th>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold">Estatus</th>
            <th className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="dark:divide-slate-700">
          {traspasos.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No se encontraron traspasos.
              </td>
            </tr>
          ) : (
            traspasos.map((tr) => (
              <tr key={tr.id} className="border-b dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-2 font-mono text-xs">{tr.folio}</td>
                <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">{tr.product_name}</td>
                <td className="px-4 py-2">{tr.quantity}</td>
                <td className="px-4 py-2 text-xs">{tr.from_warehouse_name}</td>
                <td className="px-4 py-2 text-xs">{tr.to_warehouse_name}</td>
                <td className="px-4 py-2 text-xs">{formatDate(tr.request_date)}</td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-1">
                    <EstatusIcon estatus={tr.status} />
                    <span className="capitalize">{tr.status}</span>
                  </span>
                </td>
                <td className="px-4 py-1 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {tr.status === 'pending' && currentUserRole === 1 && (
                        <>
                          <DropdownMenuItem onClick={() => onUpdateStatus(tr.id, 'APPROVED')} className="text-green-600 cursor-pointer">
                            <Check className="mr-2 h-4 w-4" /> Aprobar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(tr.id, 'REJECTED')} className="text-red-600 cursor-pointer">
                            <X className="mr-2 h-4 w-4" /> Rechazar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(tr)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onOpenKardex(tr.id, tr.folio)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> Ver Kardex
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Exportar</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()} className="cursor-pointer p-0">
                        <PDFDownloadLink
                          document={<TraspasoPDF traspaso={tr} />}
                          fileName={`traspaso_${tr.folio}.pdf`}
                          style={{ textDecoration: 'none' }}
                          className="w-full flex items-center px-2 py-1.5 text-sm"
                        >
                          {({ loading }) => (
                            <>
                              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />}
                              Descargar PDF
                            </>
                          )}
                        </PDFDownloadLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onExportExcel(tr.id, tr.folio)} className="cursor-pointer">
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar a Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}