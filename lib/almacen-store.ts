// lib/almacen-store.ts
import Cookies from 'js-cookie';
import { type Almacen, type Inventario, type Producto } from './data'; // Ajusta la ruta si es necesario

const API_URL = 'http://localhost:3000/api/v1';

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

// --- Caché en memoria ---
let almacenesEnMemoria: Almacen[] = [];

/**
 * Lee todos los almacenes de la API (Recibe el token).
 */
export const getAlmacenes = async (token: string | null): Promise<Almacen[]> => {
  console.log("Llamando a la API real para obtener almacenes...");
  if (!token) {
      console.error("getAlmacenes: No se proporcionó token.");
      return [];
  }
  try {
    const response = await fetch(`${API_URL}/warehouses`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
    if (!response.ok) {
      if (response.status === 401) { throw new Error("401 Unauthorized"); }
      throw new Error(`Error de red: ${response.status} ${response.statusText}`);
    }
    
    // data viene con IDs numéricos del backend
    const data: any[] = await response.json(); // Usamos 'any' temporalmente para la transformación

    // --- 👇 TRANSFORMACIÓN MEJORADA 👇 ---
    // Mapeamos los datos y AÑADIMOS PREFIJOS SOLO SI NO EXISTEN
    const transformedData = data.map((almacen): Almacen => { // Especificamos el tipo de retorno Almacen
      // Verifica si el ID ya es string y tiene prefijo, si no, lo añade
      const newAlmacenId = typeof almacen.id === 'string' && almacen.id.startsWith('ALM-')
        ? almacen.id
        : `ALM-${almacen.id}`;

      return {
        // Aseguramos que todas las propiedades esperadas por 'Almacen' existan
        id: newAlmacenId,
        nombre: almacen.nombre || '', // Añadir fallbacks
        ubicacion: almacen.ubicacion || '',
        descripcion: almacen.descripcion || '',
        inventarios: (almacen.inventarios || []).map((inv: any): Inventario => { // Tipado Inventario
          const newInvId = typeof inv.id === 'string' && inv.id.startsWith('INV-')
            ? inv.id
            : `INV-${inv.id}`;
          return {
            id: newInvId,
            nombre: inv.nombre || '',
            descripcion: inv.descripcion || '',
            productos: (inv.productos || []).map((prod: any): Producto => { // Tipado Producto
              const newProdId = typeof prod.id === 'string' && prod.id.startsWith('PROD-')
                ? prod.id
                : `PROD-${prod.id}`;
              return {
                id: newProdId,
                nombre: prod.nombre || '',
                cantidad: prod.cantidad || 0,
                precioUnitario: prod.precioUnitario || 0,
                // Asegúrate que los campos peso y unidadPeso existan o usa valores por defecto
                peso: prod.peso || 0, // Ajusta si 'peso' significa moneda
                unidadPeso: prod.unidadPeso || 'kg', // Ajusta si es necesario
                observaciones: prod.observaciones || undefined
              };
            })
          };
        })
      };
    });

    almacenesEnMemoria = transformedData; // Actualiza caché con datos transformados y verificados
    return almacenesEnMemoria;

  } catch (error) {
    console.error("Error al obtener almacenes de la API:", error);
    throw error; 
  }
};

/**
 * Guarda (Crea o Edita) un almacén LLAMANDO A LA API (Recibe token).
 */
export const saveAlmacen = async (
    // Los datos que vienen del modal { nombre, ubicacion, descripcion }
    data: Omit<Almacen, 'id' | 'inventarios'>,
    token: string | null, // Necesita el token
    id?: string // id viene como 'ALM-X' del frontend
): Promise<Almacen> => { // Devuelve el almacén guardado

  if (!token) {
    throw new Error("Token no proporcionado para guardar almacén.");
  }

  const isEditMode = !!id;
  let url = `${API_URL}/warehouses`; // URL por defecto (POST para crear)
  const method = isEditMode ? 'PUT' : 'POST';

  // --- CORRECCIÓN DEL ID PARA LA URL DE EDICIÓN (PUT) ---
  if (isEditMode && id) {
      // Extraemos solo el número del ID (ej: 'ALM-3' -> '3')
      const numericId = id.split('-')[1];
      if (!numericId || isNaN(parseInt(numericId, 10))) {
          throw new Error(`ID de almacén inválido para editar: ${id}`);
      }
      url = `${API_URL}/warehouses/${numericId}`; // Usamos el ID numérico en la URL para PUT
  }

  console.log(`Llamando a la API (${method}) para guardar almacén...`, { url, data });

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(token),
      // Enviamos los datos { nombre, ubicacion, descripcion }
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
        // Lanza el mensaje de error del backend si existe
        throw new Error(responseData.msg || `Error al guardar almacén: ${response.statusText}`);
    }

    // El backend devuelve el almacén creado/actualizado con ID numérico
    console.log("Almacén guardado exitosamente via API:", responseData.warehouse);

    // Transformamos el ID numérico del backend al formato string 'ALM-X' esperado por el frontend
     const savedAlmacen: Almacen = {
       ...responseData.warehouse, // Incluye nombre, ubicacion, descripcion, inventarios vacíos
       id: `ALM-${responseData.warehouse.id}` // Convertimos id numérico a string 'ALM-X'
     };

    // Actualizar la caché local (opcional, pero mejora la UI)
    if (isEditMode) {
        almacenesEnMemoria = almacenesEnMemoria.map(a => a.id === id ? savedAlmacen : a);
    } else {
        almacenesEnMemoria.push(savedAlmacen);
    }

    return savedAlmacen; // Devuelve el almacén confirmado y transformado

  } catch (error) {
    console.error("Error al guardar almacén en la API:", error);
    throw error; // Relanza para que el componente lo maneje
  }
};


// --- RESTO DE FUNCIONES (AÚN EN MEMORIA) ---

/**
 * Busca un almacén por ID (desde la memoria).
 */
export const getAlmacenById = (id: string): Almacen | undefined => {
  // Busca usando el ID formato 'ALM-X'
  return almacenesEnMemoria.find(a => a.id === id);
};

/**
 * Elimina un almacén por ID (en memoria).
 */
export const deleteAlmacenById = async (
  id: string, // id viene como 'ALM-X' del frontend
  token: string | null // Necesita el token
): Promise<void> => { // No devuelve nada si tiene éxito

if (!token) {
  throw new Error("Token no proporcionado para eliminar almacén.");
}

// 1. Extraer el ID numérico
const numericId = id.split('-')[1];
if (!numericId || isNaN(parseInt(numericId, 10))) {
    throw new Error(`ID de almacén inválido para eliminar: ${id}`);
}

const url = `${API_URL}/warehouses/${numericId}`; // URL con ID numérico
console.log(`Llamando a la API (DELETE) para eliminar almacén...`, { url });

try {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  // Si la respuesta es 204 No Content, fue exitoso pero no hay cuerpo JSON
  if (response.status === 204) {
      console.log(`Almacén ${id} eliminado exitosamente via API.`);
      // Actualizar caché local
      almacenesEnMemoria = almacenesEnMemoria.filter(a => a.id !== id);
      return; // Termina exitosamente
  }

  const responseData = await response.json();

  if (!response.ok) {
      // Lanza el mensaje de error del backend (ej. 409 si tiene inventario)
      throw new Error(responseData.msg || `Error al eliminar almacén: ${response.statusText}`);
  }

  // Si la respuesta es 200 OK con mensaje
  console.log(`Almacén ${id} eliminado exitosamente via API:`, responseData.msg);
  // Actualizar caché local
  almacenesEnMemoria = almacenesEnMemoria.filter(a => a.id !== id);

} catch (error) {
  console.error("Error al eliminar almacén en la API:", error);
  throw error; // Relanza para que el componente lo maneje
}
};

// --- Funciones relacionadas con Inventarios/Productos (NECESITAN REFACTORIZACIÓN) ---

export const getInventarioById = (almacenId: string, inventarioId: string): Inventario | undefined => {
  const almacen = getAlmacenById(almacenId);
  // Busca usando ID formato 'INV-X'
  return almacen?.inventarios.find(inv => inv.id === inventarioId);
};

export const createCategory = async ( // <-- Renombrado para claridad
    categoryData: Omit<Inventario, 'id' | 'productos'>, // Datos: { nombre, descripcion }
    token: string | null
): Promise<Inventario> => { // Devuelve la categoría creada (formato Inventario)

  console.warn("Llamando a createCategory (antes addInventarioToAlmacen)...");
  
  if (!token) {
    throw new Error("Token no proporcionado para crear categoría.");
  }

  const url = `${API_URL}/categories`;
  console.log(`Llamando a la API (POST) para crear categoría...`, { url, categoryData });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(categoryData) // Enviamos { nombre, descripcion }
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.msg || `Error al crear categoría: ${response.statusText}`);
    }

    console.log("Categoría creada exitosamente via API:", responseData.category);
    
    // El backend ya devuelve el formato 'Inventario' { id: 'INV-X', nombre, descripcion, productos: [] }
    const newCategory: Inventario = responseData.category; 

    // Opcional: Actualizar alguna caché si es necesario (no aplica directamente a almacenesEnMemoria)
    // Por ejemplo, podríamos tener una caché separada para categorías globales.
    
    return newCategory;

  } catch (error) {
    console.error("Error al crear categoría en la API:", error);
    throw error; 
  }
};

// Mantenemos el nombre viejo por compatibilidad temporal, pero redirige a la nueva
export const addInventarioToAlmacen = async (
    almacenId: string, // Este ID ya no se usa realmente aquí
    inventarioData: Omit<Inventario, 'id' | 'productos'>,
    token: string | null // Necesita el token
): Promise<void> => {
     console.warn("addInventarioToAlmacen está obsoleto, usando createCategory en su lugar.");
     try {
         await createCategory(inventarioData, token);
         // Podríamos querer refrescar algo aquí, pero la categoría es global
         // Quizás refrescar la lista de categorías si existe una vista para eso.
     } catch (error) {
         // Relanzar el error para que el componente que llama lo maneje
         throw error;
     }
};

export const addProductoToInventario = (almacenId: string, inventarioId: string, productoData: Omit<Producto, 'id'>) => {
 console.warn("addProductoToInventario necesita refactorización (opera en memoria).");
  const inventario = getInventarioById(almacenId, inventarioId);
  if (inventario) {
    const newProducto: Producto = {
      id: `PROD-${String(Date.now()).slice(-4)}`, // ID temporal
      ...productoData,
    };
    inventario.productos.push(newProducto);
  }
  // PRÓXIMO PASO: Interactuar con /api/v1/products y /api/v1/inventory
};

export const updateProductoInInventario = (almacenId: string, inventarioId: string, productoId: string, productoData: Omit<Producto, 'id'>) => {
  console.warn("updateProductoInInventario necesita refactorización (opera en memoria).");
  const inventario = getInventarioById(almacenId, inventarioId);
  if (inventario) {
    inventario.productos = inventario.productos.map(p =>
      // Busca usando ID formato 'PROD-X'
      p.id === productoId ? { ...p, ...productoData } : p
    );
  }
  // PRÓXIMO PASO: PUT a /api/v1/products/:numericId o /api/v1/inventory/:numericId
};

export const deleteProductoFromInventario = (almacenId: string, inventarioId: string, productoId: string) => {
  console.warn("deleteProductoFromInventario necesita refactorización (opera en memoria).");
  const inventario = getInventarioById(almacenId, inventarioId);
  if (inventario) {
    // Filtra usando ID formato 'PROD-X'
    inventario.productos = inventario.productos.filter(p => p.id !== productoId);
  }
  // PRÓXIMO PASO: DELETE a /api/v1/products/:numericId o afectar /api/v1/inventory
};