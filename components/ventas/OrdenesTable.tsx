"use client";
import type { OrdenDeCompra } from '@/lib/data';
import { FileEdit, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrdenPDF from './OrdenPDF';

interface OrdenesTableProps {
  ordenes: OrdenDeCompra[];
  onUpdateStatusClick: (orden: OrdenDeCompra) => void;
}

export default function OrdenesTable({ ordenes, onUpdateStatusClick }: OrdenesTableProps) {
  const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-400">
          <tr>
            <th scope="col" className="px-6 py-3">Folio</th>
            <th scope="col" className="px-6 py-3">Fecha</th>
            <th scope="col" className="px-6 py-3">Producto</th>
            <th scope="col" className="px-6 py-3">Cliente</th>
            {/* highlight-next-line */}
            <th scope="col" className="px-6 py-3 text-right">Valor Total</th>
            <th scope="col" className="px-6 py-3">Estado</th>
            <th scope="col" className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.codigo} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
              <td className="px-6 py-4 font-mono text-xs">{orden.folio}</td>
              <td className="px-6 py-4">{orden.fechaCreacion}</td>
              <td className="px-6 py-4 font-medium">{orden.producto}</td>
              <td className="px-6 py-4">{orden.cliente}</td>
              {/* highlight-start */}
              <td className="px-6 py-4 font-semibold text-right">
                {currencyFormatter.format(orden.valorTotal)}
              </td>
              {/* highlight-end */}
              <td className="px-6 py-4">{orden.status}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-4">
                  <button onClick={() => onUpdateStatusClick(orden)} className="text-slate-500 hover:text-indigo-600" title="Actualizar estado">
                    <FileEdit className="h-4 w-4" />
                  </button>
                  <PDFDownloadLink
                    document={<OrdenPDF orden={orden} />}
                    fileName={`remision_${orden.folio}.pdf`}
                    className="text-slate-500 hover:text-indigo-600"
                    title="Descargar Remisión"
                  >
                    {({ loading }) => (loading ? '...' : <Download className="h-4 w-4" />)}
                  </PDFDownloadLink>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}