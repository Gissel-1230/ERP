// lib/product-store.ts
import { getAuthHeaders } from './almacen-store';
import { getCategories } from './category-store';
import { type CategoryItem, type GlobalProduct } from './data';

const API_URL = 'http://localhost:3000/api/v1';

// --- Caché en memoria ---
let productsCache: GlobalProduct[] = [];

/**
 * [READ] Obtiene la lista global de productos desde la API.
 */
export const getProducts = async (token: string | null): Promise<GlobalProduct[]> => {
    if (!token) throw new Error("Token no proporcionado para listar productos.");
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'GET',
            headers: getAuthHeaders(token)
        });

        if (!response.ok) {
             if (response.status === 401) throw new Error("401 Unauthorized.");
             throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Mapeo y transformación de IDs para el front-end
        const transformedProducts: GlobalProduct[] = data.products.map((prod: any) => ({
            // Los nombres deben coincidir con la interfaz GlobalProduct y los datos de la API
            ...prod,
            product_id: `PROD-${prod.product_id}`, 
            unit_price: parseFloat(prod.unit_price), 
            current_stock_total: parseInt(prod.current_stock_total, 10),
            minimum_stock: parseInt(prod.minimum_stock, 10),
            category_id: parseInt(prod.category_id, 10),
        }));
        
        productsCache = transformedProducts;
        return productsCache;
        
    } catch (error) {
        console.error("[ProductStore] Error al obtener productos:", error);
        throw error;
    }
};

export const getProductsByCategory = async (
    token: string | null, 
    categoryId: string | number
): Promise<GlobalProduct[]> => {
    
    if (!token) { throw new Error("Token no proporcionado."); }
    if (!categoryId) { return []; } // No buscar si no hay categoría

    // Limpiamos el prefijo 'INV-' para obtener el ID numérico
    const numericId = String(categoryId).split('-')[1] || categoryId;
    const url = `${API_URL}/products/by-category/${numericId}`;

    console.log("[ProductStore] Llamando a API para productos por categoría:", url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(token)
        });

        if (!response.ok) {
             if (response.status === 401) throw new Error("401 Unauthorized.");
             throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.ok || !Array.isArray(data.products)) {
            console.error("[ProductStore] Respuesta de API inválida:", data);
            return [];
        }

        // Transformamos los IDs para el front-end (PROD-X)
        const transformedProducts: GlobalProduct[] = data.products.map((prod: any) => ({
            ...prod,
            product_id: `PROD-${prod.product_id}`,
            // Aseguramos que los campos de la interfaz GlobalProduct existan
            product_name: prod.product_name,
            unit_price: parseFloat(prod.unit_price) || 0,
            description: prod.description || '',
            unit_of_measure: prod.unit_of_measure || 'Unidad',
            minimum_stock: parseInt(prod.minimum_stock, 10) || 0,
            category_id: parseInt(prod.category_id, 10),
            categoria_nombre: prod.categoria_nombre || '', // El back-end no lo envía aquí, pero lo definimos
            current_stock_total: 0 // El stock total no es relevante para esta lista
        }));
        
        return transformedProducts;
        
    } catch (error) {
        console.error("[ProductStore] Error al obtener productos por categoría:", error);
        throw error;
    }
};

/**
 * [POST/PUT] Crea o Edita un producto.
 */
export const saveProduct = async (
    // Los datos que vienen del modal
    productData: Omit<GlobalProduct, 'product_id' | 'categoria_nombre' | 'current_stock_total'>,
    token: string | null,
    id?: string // ID en formato 'PROD-X' para edición
): Promise<GlobalProduct> => {

    if (!token) throw new Error("Token no proporcionado para guardar producto.");
    
    const isEditMode = !!id;
    let url = `${API_URL}/products`;
    const method = isEditMode ? 'PUT' : 'POST';

    // 1. Manejo del ID para PUT: Extraer el número
    if (isEditMode && id) {
        const numericId = id.split('-')[1];
        if (!numericId || isNaN(parseInt(numericId, 10))) {
            throw new Error(`ID de producto inválido para editar: ${id}`);
        }
        url = `${API_URL}/products/${numericId}`;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeaders(token),
            body: JSON.stringify(productData)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.msg || `Error al guardar producto: ${response.statusText}`);
        }
        
        const savedProduct = responseData.product;
        
        // Transformar la respuesta del back-end
        const transformedProduct: GlobalProduct = {
            ...savedProduct,
            product_id: `PROD-${savedProduct.product_id}`, 
            unit_price: parseFloat(savedProduct.unit_price),
            current_stock_total: savedProduct.current_stock_total || 0,
            minimum_stock: parseInt(savedProduct.minimum_stock, 10),
            category_id: parseInt(savedProduct.category_id, 10),
        };
        
        // Actualización de la caché
        if (isEditMode) {
            productsCache = productsCache.map(p => p.product_id === id ? transformedProduct : p);
        } else {
            productsCache.push(transformedProduct);
        }

        return transformedProduct;

    } catch (error) {
        console.error("[ProductStore] Error al guardar producto:", error);
        throw error;
    }
};

/**
 * [DELETE] Eliminar un producto.
 */
export const deleteProduct = async (id: string, token: string | null): Promise<void> => {
    if (!token) throw new Error("Token no proporcionado para eliminar producto.");
    
    const numericId = id.split('-')[1];
    if (!numericId || isNaN(parseInt(numericId, 10))) {
        throw new Error(`ID de producto inválido para eliminar: ${id}`);
    }

    const url = `${API_URL}/products/${numericId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });

        if (response.status === 409) { // Conflicto (tiene stock)
            const errorData = await response.json();
            throw new Error(errorData.msg);
        }

        if (!response.ok) {
            throw new Error(`Error al eliminar: ${response.statusText}`);
        }

        // Si es exitoso, actualizamos la caché local
        productsCache = productsCache.filter(p => p.product_id !== id);

    } catch (error) {
        console.error("[ProductStore] Error al eliminar producto:", error);
        throw error;
    }
};

// Puedes añadir una función para obtener solo la caché local si es necesario
export const getLocalProductsCache = (): GlobalProduct[] => productsCache;