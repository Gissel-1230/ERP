// lib/inventory-store.ts
import { getAuthHeaders } from './almacen-store'; // Utilidad para obtener headers
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define la estructura de datos que esperamos enviar para un movimiento
interface MovementData {
    product_id: number; 
    warehouse_id: number; 
    quantity: number; 
    description: string; 
    movement_type: 'IN' | 'OUT' | 'ADJUST-IN' | 'ADJUST-OUT';
}

// Define la estructura de datos que esperamos recibir de la API
interface MovementResponse {
    movement_id: number;
    // ... otros campos de la tabla inventory_movements
}

/**
 * [CREATE] Registra una entrada o salida de stock en la tabla inventory_movements.
 * * @param data Los datos del movimiento (producto, almacén, cantidad, tipo).
 * @param token El token de autenticación del usuario.
 * @returns Los datos del movimiento registrado.
 */
const registerMovement = async (data: MovementData, token: string): Promise<MovementResponse> => {
    
    if (!token) {
        throw new Error("Autenticación requerida para registrar el movimiento.");
    }
    
    // El endpoint es /inventory/movement
    const response = await fetch(`${API_URL}/inventory/movement`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(token), // Incluye Authorization y Content-Type
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        // Capturamos el mensaje de error del back-end (ej. validaciones 400, error 500)
        const errorMessage = responseData.msg || responseData.errors?.[0]?.msg || `Error ${response.status}: Error al registrar el movimiento.`;
        throw new Error(`Error al registrar movimiento: ${errorMessage}`);
    }

    // El back-end devuelve { ok: true, movement: {...} }
    return responseData.movement as MovementResponse;
};


// Exportamos las funciones bajo un objeto para organizar el store
export const InventoryController = {
    registerMovement
};