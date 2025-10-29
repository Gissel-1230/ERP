// lib/traspasos-store.ts
import { type Traspaso, type TraspasoStatus, type Almacen, type Inventario, type Producto, type CategoryItem, type GlobalProduct } from './data';
// Importamos los helpers (asumimos que getAuthHeaders está exportado en almacen-store.ts)
import { getAuthHeaders } from './almacen-store';

// Usamos la variable de entorno para la URL
const API_URL = process.env.NEXT_PUBLIC_API_URL; 

// Interfaz para los datos que enviará el modal (simplificada)
export interface AddTraspasoData {
    product_id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    quantity: number;
}

// Interfaz para la información detallada de la solicitud
export interface KardexRequestInfo {
    request_id: number;
    request_date: string;
    approval_date: string | null;
    requester_name: string;
    approver_name: string | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | string; // Permitimos string para toLowerCase
    quantity: number;
    product_name: string;
    from_warehouse: string;
    to_warehouse: string;
}

// Interfaz para un movimiento individual
export interface KardexMovement {
  fecha: string;
  tipo: 'Salida de Traspaso' | 'Entrada de Traspaso' | string; // Permitimos string
  cantidad: number;
  descripcion: string;
  producto: string;
  almacen_afectado: string;
}

// Interfaz del resultado completo que devuelve la API
export interface KardexDetails {
    request_folio: string;
    request_info: KardexRequestInfo; // La info de auditoría
    movements: KardexMovement[];      // Los movimientos (IN y OUT)
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
      // Devuelve el objeto completo con request_info y movements
      return data as KardexDetails; 

  } catch (error) {
      console.error("[TraspasosStore] Error al obtener detalles del Kardex:", error);
      throw error;
  }
};

// --- FUNCIONES ASÍNCRONAS (EXISTENTES) ---

/**
 * [READ] Obtiene la lista de todas las solicitudes de traspaso.
 */
export const getTraspasos = async (token: string | null): Promise<Traspaso[]> => {
    console.log("[TraspasosStore] Llamando a GET /api/v1/transfers...");
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

        // Mapeo de la respuesta de la API a la interfaz 'Traspaso' del front-end
        const transformedData: Traspaso[] = data.transfers.map((tr: any) => ({
            id: tr.request_id, // ID de la solicitud
            folio: `TR-${String(tr.request_id).padStart(4, '0')}`,
            producto_nombre: tr.product_name,
            cantidad: tr.quantity,
            almacen_salida_nombre: tr.from_warehouse,
            almacen_entrada_nombre: tr.to_warehouse,
            fecha: new Date(tr.request_date).toLocaleString('es-MX'),
            estatus: String(tr.status).toLowerCase() as TraspasoStatus, // Normaliza a minúsculas
            usuario_responsable: tr.requester_name,
            
            // IDs
            producto_id: tr.product_id,
            almacen_salida_id: tr.from_warehouse_id,
            almacen_entrada_id: tr.to_warehouse_id,
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