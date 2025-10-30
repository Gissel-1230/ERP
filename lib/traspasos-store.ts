// lib/traspasos-store.ts
import { 
  type Traspaso, 
  type TraspasoStatus 
} from './data';
import { getAuthHeaders, API_URL } from './api-helpers'; 
import * as XLSX from 'xlsx';

// --- INTERFACES ---
export interface AddTraspasoData {
     product_id: number;
     from_warehouse_id: number;
     to_warehouse_id: number;
     quantity: number;
}

export interface KardexRequestInfo {
     request_id: number;
     request_date: string;
     approval_date: string | null;
     requester_name: string;
     approver_name: string | null;
     status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
     quantity: number;
     product_name: string;
     from_warehouse: string;
     to_warehouse: string;
}

export interface KardexMovement {
   fecha: string;
   tipo: 'Salida de Traspaso' | 'Entrada de Traspaso' | string;
   cantidad: number;
   descripcion: string;
   producto: string;
   almacen_afectado: string;
}

export interface KardexDetails {
     request_folio: string;
     request_info: KardexRequestInfo; 
     movements: KardexMovement[]; 
}
// ---------------------------------------------


/**
* [READ] Obtiene los movimientos de Kardex para una solicitud de traspaso específica.
*/
export const getKardexDetails = async (id: string | number, token: string | null): Promise<KardexDetails> => {
   if (!token) throw new Error("Token no proporcionado.");
   const url = `${API_URL}/transfers/kardex/${id}`;
   try {
       const response = await fetch(url, {
           method: 'GET',
           headers: getAuthHeaders(token)
       });
       if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
           throw new Error(errorData.msg || `Error ${response.status} al obtener Kardex.`);
       }
       const data = await response.json();
       return data as KardexDetails; 
   } catch (error) {
       console.error("[TraspasosStore] Error al obtener detalles del Kardex:", error);
       throw error;
   }
};

/**
 * [READ] Obtiene la lista de todas las solicitudes de traspaso.
 */
export const getTraspasos = async (token: string | null): Promise<Traspaso[]> => {
     if (!token) throw new Error("Token no proporcionado.");
     try {
         const response = await fetch(`${API_URL}/transfers`, {
             method: 'GET',
             headers: getAuthHeaders(token)
         });
         if (!response.ok) {
             const errorData = await response.json().catch(() => ({}));
             throw new Error(errorData.msg || `Error ${response.status}`);
         }
         const data = await response.json();
 
         const transformedData: Traspaso[] = data.transfers.map((tr: any) => ({
             id: tr.request_id,
             folio: `TR-${String(tr.request_id).padStart(4, '0')}`,
             product_name: tr.product_name,
             quantity: tr.quantity,
             from_warehouse_name: tr.from_warehouse,
             to_warehouse_name: tr.to_warehouse,
             request_date: tr.request_date,
             status: String(tr.status).toLowerCase() as TraspasoStatus,
             requester_name: tr.requester_name,
             producto_id: tr.product_id, 
             almacen_salida_id: tr.from_warehouse_id, 
             almacen_entrada_id: tr.to_warehouse_id, 
             observations: tr.observations || '', 
         }));
         
         return transformedData;
     } catch (error) {
         console.error("[TraspasosStore] Error al obtener traspasos:", error);
         throw error;
     }
};

/**
 * [CREATE] Envía una solicitud de traspaso (POST /transfers/request).
 */
export const requestTraspaso = async (data: AddTraspasoData, token: string | null): Promise<any> => {
     if (!token) throw new Error("Token no proporcionado.");
     try {
         const response = await fetch(`${API_URL}/transfers/request`, {
             method: 'POST',
             headers: getAuthHeaders(token),
             body: JSON.stringify(data)
         });
         const responseData = await response.json();
         if (!response.ok) {
             throw new Error(responseData.msg || `Error ${response.status}`);
         }
         return responseData; 
     } catch (error) {
         console.error("[TraspasosStore] Error al solicitar traspaso:", error);
         throw error;
     }
};

/**
 * [UPDATE] Aprueba o Rechaza una solicitud.
 */
export const updateTraspasoStatus = async (
     id: string | number, 
     newStatus: 'APPROVED' | 'REJECTED', 
     token: string | null
): Promise<any> => {
     if (!token) throw new Error("Token no proporcionado.");
     const action = newStatus === 'APPROVED' ? 'approve' : 'reject';
     const url = `${API_URL}/transfers/${action}/${id}`;
     try {
         const response = await fetch(url, {
             method: 'POST',
             headers: getAuthHeaders(token)
         });
         const responseData = await response.json();
         if (!response.ok) {
             throw new Error(responseData.msg || `Error ${response.status}`);
         }
         return responseData; 
     } catch (error) {
         console.error(`[TraspasosStore] Error al ${action} traspaso:`, error);
         throw error;
     }
};

/**
 * [UPDATE] Actualiza un traspaso (ej. cantidad u observaciones).
 */
export const updateTraspaso = async (
  id: string | number,
  data: { quantity?: number; observations?: string },
  token: string | null
): Promise<Traspaso> => {
  if (!token) throw new Error("Token no proporcionado");
 
  const url = `${API_URL}/transfers/${id}`;
 
  console.log(`Llamando a API (PATCH) para actualizar traspaso: ${url}`);
 
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.msg || `Error ${response.status} al actualizar traspaso`);
  }
 
  const tr = await response.json(); 
  const updatedTraspaso: Traspaso = {
    id: tr.request_id,
    folio: `TR-${String(tr.request_id).padStart(4, '0')}`,
    product_name: tr.product_name,
    quantity: tr.quantity,
    from_warehouse_name: tr.from_warehouse,
    to_warehouse_name: tr.to_warehouse,
    request_date: tr.request_date,
    status: String(tr.status).toLowerCase() as TraspasoStatus,
    requester_name: tr.requester_name,
    producto_id: tr.product_id,
    almacen_salida_id: tr.from_warehouse_id,
    almacen_entrada_id: tr.to_warehouse_id,
    observations: tr.observations || '',
  };
  return updatedTraspaso;
};

/**
 * [READ] Genera y descarga un reporte de Excel para un traspaso.
 * NOTA: Esta función genera el Excel en el frontend usando los datos del kardex.
 * Cuando el backend implemente GET /transfers/export/excel/:id, se puede reemplazar.
 */
export const exportTraspasoToExcel = async (
  id: string | number, 
  folio: string, 
  token: string | null
) => {
  if (!token) throw new Error("Token no proporcionado");
  
  try {
    // 1. Obtenemos los datos del kardex
    const kardexDetails = await getKardexDetails(id, token);
    
    // 2. Preparamos los datos para el Excel
    const { request_info, movements } = kardexDetails;
    
    // Hoja 1: Información de la Solicitud
    const infoData = [
      ['REPORTE DE TRASPASO'],
      [''],
      ['Folio:', folio],
      ['Producto:', request_info.product_name],
      ['Cantidad:', String(request_info.quantity)],
      ['Almacén Origen:', request_info.from_warehouse],
      ['Almacén Destino:', request_info.to_warehouse],
      [''],
      ['Fecha Solicitud:', new Date(request_info.request_date).toLocaleDateString('es-MX')],
      ['Solicitante:', request_info.requester_name],
      ['Estado:', request_info.status],
      [''],
      ['Fecha Aprobación:', request_info.approval_date 
        ? new Date(request_info.approval_date).toLocaleDateString('es-MX') 
        : 'Pendiente'
      ],
      ['Aprobador:', request_info.approver_name || 'Pendiente'],
    ];
    
    // Hoja 2: Movimientos de Kardex
    const movementsData: any[][] = [
      ['MOVIMIENTOS DE KARDEX'],
      [''],
      ['Fecha', 'Tipo', 'Cantidad', 'Producto', 'Almacén', 'Descripción']
    ];
    
    movements.forEach(mov => {
      movementsData.push([
        new Date(mov.fecha).toLocaleDateString('es-MX'),
        mov.tipo,
        String(mov.cantidad),
        mov.producto,
        mov.almacen_afectado,
        mov.descripcion
      ]);
    });
    
    // 3. Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    
    // Agregar hoja de información
    const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
    XLSX.utils.book_append_sheet(wb, wsInfo, 'Información');
    
    // Agregar hoja de movimientos
    const wsMovements = XLSX.utils.aoa_to_sheet(movementsData);
    XLSX.utils.book_append_sheet(wb, wsMovements, 'Movimientos');
    
    // 4. Descargar el archivo
    XLSX.writeFile(wb, `Traspaso_${folio}.xlsx`);
    
    console.log(`✅ Excel generado exitosamente: Traspaso_${folio}.xlsx`);
  } catch (error) {
    console.error("[TraspasosStore] Error al generar Excel:", error);
    throw error;
  }
};