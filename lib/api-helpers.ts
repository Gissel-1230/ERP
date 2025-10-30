// lib/api-helpers.ts

// Usamos la variable de entorno para la URL de la API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'; 

/**
 * Función helper para crear los encabezados (Recibe el token).
 */
export const getAuthHeaders = (token: string | null): Record<string, string> => {
     const headers: Record<string, string> = {
       'Content-Type': 'application/json',
     };
     if (token) {
       headers['Authorization'] = `Bearer ${token}`;
     } else {
       console.error("getAuthHeaders no recibió un token.");
     }
     return headers;
};