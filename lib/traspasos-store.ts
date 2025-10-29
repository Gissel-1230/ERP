// lib/traspasos-store.ts
import { type Traspaso, type TraspasoStatus } from './data';
// Importamos los helpers (asumimos que getAuthHeaders está exportado en almacen-store.ts)
import { getAuthHeaders } from './almacen-store';
import { type GlobalProduct, type CategoryItem } from './data';

// Usamos la variable de entorno para la URL
const API_URL = process.env.NEXT_PUBLIC_API_URL; 

// Interfaz para los datos que enviará el modal (simplificada)
export interface AddTraspasoData {
    product_id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    quantity: number;
}

// --- FUNCIONES ASÍNCRONAS (LLAMADAS A LA API) ---

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
            // 🟢 CORRECCIÓN: NORMALIZAR EL ESTATUS A MINÚSCULAS
            estatus: String(tr.status).toLowerCase() as TraspasoStatus, 
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
            // Captura el error de "Stock insuficiente" (409) o validaciones (400)
            throw new Error(responseData.msg || `Error ${response.status}`);
        }
        
        return responseData; 

    } catch (error) {
        console.error("[TraspasosStore] Error al solicitar traspaso:", error);
        throw error;
    }
};

/**
 * [UPDATE] Aprueba o Rechaza una solicitud (POST /transfers/approve/:id o /reject/:id).
 */
export const updateTraspasoStatus = async (
    id: string | number, // ID de la solicitud (request_id)
    newStatus: 'APPROVED' | 'REJECTED', // Estatus en Mayúsculas para la API
    token: string | null
): Promise<any> => {
    if (!token) throw new Error("Token no proporcionado.");
    
    // Determinamos la ruta de la API (Aprobar o Rechazar)
    const action = newStatus === 'APPROVED' ? 'approve' : 'reject';
    const url = `${API_URL}/transfers/${action}/${id}`;
    console.log(`[TraspasosStore] Llamando a ${action} API: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(token)
        });
        
        const responseData = await response.json();

        if (!response.ok) {
            // Captura el error (ej. "Stock insuficiente" al aprobar, o "ya procesada")
            throw new Error(responseData.msg || `Error ${response.status}`);
        }
        
        return responseData; 

    } catch (error) {
        console.error(`[TraspasosStore] Error al ${action} traspaso:`, error);
        throw error;
    }
};