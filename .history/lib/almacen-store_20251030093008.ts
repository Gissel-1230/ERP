// lib/almacen-store.ts
import Cookies from 'js-cookie';
import { initialAlmacenes, type Almacen, type Inventario, type Producto } from './data';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
let almacenesEnMemoria: Almacen[] = JSON.parse(JSON.stringify(initialAlmacenes));
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
     
     const data: any[] = await response.json(); 

     const transformedData = data.map((almacen): Almacen => { 
       const newAlmacenId = typeof almacen.id === 'string' && almacen.id.startsWith('ALM-')
         ? almacen.id
         : `ALM-${almacen.id}`;

       return {
         id: newAlmacenId,
         nombre: almacen.nombre || '', 
         ubicacion: almacen.ubicacion || '',
         descripcion: almacen.descripcion || '',
         inventarios: (almacen.inventarios || []).map((inv: any): Inventario => { 
           const newInvId = typeof inv.id === 'string' && inv.id.startsWith('INV-')
             ? inv.id
             : `INV-${inv.id}`;
           return {
             id: newInvId,
             nombre: inv.nombre || '',
             descripcion: inv.descripcion || '',
             productos: (inv.productos || []).map((prod: any): Producto => { 
               const newProdId = typeof prod.id === 'string' && prod.id.startsWith('PROD-')
                 ? prod.id
                 : `PROD-${prod.id}`;
               
               // Validación de seguridad para 'unidadPeso'
               const unidad = prod.unit_of_measure === 'g' ? 'g' : ''; // Default a 'kg'
               
               return {
                 id: newProdId,
                 nombre: prod.nombre || '',
                 cantidad: prod.cantidad || 0,
                 precioUnitario: prod.precioUnitario || 0,
                 peso: prod.peso || 0, 
                 unidadPeso: unidad, // Usamos la variable validada
                 // highlight-start
                 // --- CORRECCIÓN AQUÍ ---
                 // Mapeamos 'product_description' a 'observaciones'
                 observaciones: prod.product_description || ''
                 // highlight-end
               };
             })
           };
         })
       };
     });

     almacenesEnMemoria = transformedData; 
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
     data: Omit<Almacen, 'id' | 'inventarios'>,
     token: string | null, 
     id?: string 
): Promise<Almacen> => { 

   if (!token) {
     throw new Error("Token no proporcionado para guardar almacén.");
   }

   const isEditMode = !!id;
   let url = `${API_URL}/warehouses`; 
   const method = isEditMode ? 'PUT' : 'POST';

   if (isEditMode && id) {
       const numericId = id.split('-')[1];
       if (!numericId || isNaN(parseInt(numericId, 10))) {
           throw new Error(`ID de almacén inválido para editar: ${id}`);
       }
       url = `${API_URL}/warehouses/${numericId}`; 
   }

   console.log(`Llamando a la API (${method}) para guardar almacén...`, { url, data });

   try {
     const response = await fetch(url, {
       method: method,
       headers: getAuthHeaders(token),
       body: JSON.stringify(data)
     });

     const responseData = await response.json();

     if (!response.ok) {
         throw new Error(responseData.msg || `Error al guardar almacén: ${response.statusText}`);
     }
     console.log("Almacén guardado exitosamente via API:", responseData.warehouse);

     // Transformamos la respuesta para que coincida con la interfaz del frontend
     const savedAlmacen: Almacen = {
       ...responseData.warehouse, 
       id: `ALM-${responseData.warehouse.id}`,
       // Aseguramos que inventarios sea un array
       inventarios: responseData.warehouse.inventarios || [] 
     };

     if (isEditMode) {
         almacenesEnMemoria = almacenesEnMemoria.map(a => a.id === id ? savedAlmacen : a);
     } else {
         almacenesEnMemoria.push(savedAlmacen);
     }

     return savedAlmacen; 

   } catch (error) {
     console.error("Error al guardar almacén en la API:", error);
     throw error; 
   }
};

/**
 * Busca un almacén por ID (desde la memoria).
 */
export const getAlmacenById = (id: string): Almacen | undefined => {
   return almacenesEnMemoria.find(a => a.id === id);
};

/**
 * Elimina un almacén por ID (en memoria).
 */
export const deleteAlmacenById = async (
   id: string, 
   token: string | null 
): Promise<void> => { 

if (!token) {
   throw new Error("Token no proporcionado para eliminar almacén.");
}

const numericId = id.split('-')[1];
if (!numericId || isNaN(parseInt(numericId, 10))) {
     throw new Error(`ID de almacén inválido para eliminar: ${id}`);
}

const url = `${API_URL}/warehouses/${numericId}`; 
console.log(`Llamando a la API (DELETE) para eliminar almacén...`, { url });

try {
   const response = await fetch(url, {
     method: 'DELETE',
     headers: getAuthHeaders(token)
   });

   if (response.status === 204) {
       console.log(`Almacén ${id} eliminado exitosamente via API.`);
       almacenesEnMemoria = almacenesEnMemoria.filter(a => a.id !== id);
       return; 
   }

   const responseData = await response.json();

   if (!response.ok) {
       throw new Error(responseData.msg || `Error al eliminar almacén: ${response.statusText}`);
   }

   console.log(`Almacén ${id} eliminado exitosamente via API:`, responseData.msg);
   almacenesEnMemoria = almacenesEnMemoria.filter(a => a.id !== id);

} catch (error) {
   console.error("Error al eliminar almacén en la API:", error);
   throw error; 
}
};

// --- Funciones relacionadas con Inventarios/Productos (NECESITAN REFACTORIZACIÓN) ---

export const getInventarioById = (almacenId: string, inventarioId: string): Inventario | undefined => {
   const almacen = getAlmacenById(almacenId);
   return almacen?.inventarios.find(inv => inv.id === inventarioId);
};

export const createCategory = async ( 
     categoryData: Omit<Inventario, 'id' | 'productos'>, 
     token: string | null
): Promise<Inventario> => { 

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
       body: JSON.stringify(categoryData) 
     });

     const responseData = await response.json();

     if (!response.ok) {
         throw new Error(responseData.msg || `Error al crear categoría: ${response.statusText}`);
     }

     console.log("Categoría creada exitosamente via API:", responseData.category);
     
     const newCategory: Inventario = responseData.category; 
     
     return newCategory;

   } catch (error) {
     console.error("Error al crear categoría en la API:", error);
     throw error; 
   }
};

export const addInventarioToAlmacen = async (
     almacenId: string, 
     inventarioData: Omit<Inventario, 'id' | 'productos'>,
     token: string | null 
): Promise<void> => {
      console.warn("addInventarioToAlmacen está obsoleto, usando createCategory en su lugar.");
      try {
          await createCategory(inventarioData, token);
      } catch (error) {
          throw error;
      }
};

export const addProductoToInventario = (almacenId: string, inventarioId: string, productoData: Omit<Producto, 'id'>) => {
  console.warn("addProductoToInventario necesita refactorización (opera en memoria).");
   const inventario = getInventarioById(almacenId, inventarioId);
   if (inventario) {
     const newProducto: Producto = {
       id: `PROD-${String(Date.now()).slice(-4)}`, 
       ...productoData,
     };
     inventario.productos.push(newProducto);
   }
};

export const updateProductoInInventario = (almacenId: string, inventarioId: string, productoId: string, productoData: Omit<Producto, 'id'>) => {
   console.warn("updateProductoInInventario necesita refactorización (opera en memoria).");
   const inventario = getInventarioById(almacenId, inventarioId);
   if (inventario) {
     inventario.productos = inventario.productos.map(p =>
       p.id === productoId ? { ...p, ...productoData } : p
     );
   }
};

export const deleteProductoFromInventario = (almacenId: string, inventarioId: string, productoId: string) => {
   console.warn("deleteProductoFromInventario necesita refactorización (opera en memoria).");
   const inventario = getInventarioById(almacenId, inventarioId);
   if (inventario) {
     inventario.productos = inventario.productos.filter(p => p.id !== productoId);
   }
};

// --- NUEVAS FUNCIONES PARA GESTIÓN DE STOCK (REQUERIDAS POR TRASPASOS) ---

export const getProductoStock = (inventarioId: string, productoId: string): number => {
   const almacen = almacenesEnMemoria.find(a => a.inventarios.some(i => i.id === inventarioId));
   const inventario = almacen?.inventarios.find(i => i.id === inventarioId);
   const producto = inventario?.productos.find(p => p.id === productoId);
   return producto?.cantidad || 0;
};

export const updateProductoStock = (inventarioId: string, productoId: string, nuevaCantidad: number) => {
   const almacen = almacenesEnMemoria.find(a => a.inventarios.some(i => i.id === inventarioId));
   const inventario = almacen?.inventarios.find(i => i.id === inventarioId);
   if (inventario) {
     inventario.productos = inventario.productos.map(p =>
       p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
     );
   }
};