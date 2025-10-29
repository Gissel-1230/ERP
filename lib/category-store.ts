// lib/category-store.ts
import Cookies from 'js-cookie'; 
import { type Almacen, type Inventario, type Producto, type CategoryItem } from './data';
import { getAuthHeaders } from './almacen-store'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Caché en memoria ---
let categoriesCache: CategoryItem[] = [];

/**
 * [READ] Obtiene la lista global de categorías.
 */
export const getCategories = async (token: string | null): Promise<CategoryItem[]> => {
    console.log("[CategoryStore] Llamando a la API para obtener categorías...");
    if (!token) { throw new Error("Token no proporcionado para listar categorías."); }
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'GET',
            headers: getAuthHeaders(token)
        });

        if (!response.ok) {
            if (response.status === 401) { throw new Error("401 Unauthorized: Sesión inválida o expirada."); }
            const errorData = await response.json().catch(() => ({ msg: response.statusText }));
            throw new Error(errorData.msg || `Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json(); 
        if (!data.categories || !Array.isArray(data.categories)) {
            console.error("[CategoryStore] Respuesta de API sin el array 'categories':", data);
            return [];
        }

        const transformedCategories: CategoryItem[] = data.categories.map((cat: any) => ({
            id: `INV-${cat.category_id}`, 
            nombre: cat.nombre,
            descripcion: cat.descripcion,
            product_count: cat.product_count,
        }));

        categoriesCache = transformedCategories;
        return categoriesCache;

    } catch (error) {
        console.error("[CategoryStore] Error al obtener categorías de la API:", error);
        throw error;
    }
};

/**
 * [POST/PUT] Guarda o Edita una Categoría.
 */
export const saveCategory = async ( 
    categoryData: Omit<Inventario, 'id' | 'productos'>,
    token: string | null,
    id?: string // ID opcional para edición (INV-X)
): Promise<CategoryItem> => { 

  if (!token) { throw new Error("Token no proporcionado para guardar categoría."); }

  const isEditMode = !!id;
  let url = `${API_URL}/categories`;
  const method = isEditMode ? 'PUT' : 'POST';

  // 1. Manejo del ID para PUT: Extraer el número
  if (isEditMode && id) {
      const numericId = id.split('-')[1];
      if (!numericId || isNaN(parseInt(numericId, 10))) {
          throw new Error(`ID de categoría inválido para editar: ${id}`);
      }
      url = `${API_URL}/categories/${numericId}`;
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(token),
      body: JSON.stringify(categoryData)
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.msg || `Error al guardar categoría: ${response.statusText}`);
    }

    const savedCategory = responseData.category; 
    
    // 1. OBTENER CONTEO ACTUAL Y DECLARAR VARIABLE
    const currentProductCount = isEditMode 
        ? categoriesCache.find(c => c.id === id)?.product_count || 0 
        : 0;

    const transformedCategory: CategoryItem = {
      id: `INV-${savedCategory.category_id}`, 
      nombre: savedCategory.category_name || savedCategory.nombre,
      descripcion: savedCategory.description || savedCategory.descripcion,
      product_count: currentProductCount
    };
    
    // 2. Actualización de la caché local
    if (isEditMode) {
        categoriesCache = categoriesCache.map(c => c.id === id ? transformedCategory : c);
    } else {
        categoriesCache.push(transformedCategory);
    }

    return transformedCategory;

  } catch (error) {
    console.error("[CategoryStore] Error al guardar categoría en la API:", error);
    throw error;
  }
};

/**
 * [DELETE] Eliminar una Categoría.
 */
export const deleteCategory = async (
    id: string, // ID en formato 'INV-X'
    token: string | null
): Promise<void> => {

    if (!token) { throw new Error("Token no proporcionado para eliminar categoría."); }
    
    // 1. Extraer el ID numérico
    const numericId = id.split('-')[1];
    if (!numericId || isNaN(parseInt(numericId, 10))) {
        throw new Error(`ID de categoría inválido para eliminar: ${id}`);
    }

    const url = `${API_URL}/categories/${numericId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.msg || `Error al eliminar categoría: ${response.statusText}`);
        }

        // Si es exitoso, actualizamos la caché local
        categoriesCache = categoriesCache.filter(c => c.id !== id);

    } catch (error) {
        console.error("[CategoryStore] Error al eliminar categoría en la API:", error);
        throw error;
    }
};

// ... (Aquí irían otras funciones del store como getInventarioById, etc. si las tienes)