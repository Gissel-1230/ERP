import { initialAlmacenes, type Almacen, type Inventario, type Producto } from './data';

// Creamos una copia profunda de los datos para evitar mutar el array original al importarlo.
// Esto asegura que nuestro "store" se comporte como una base de datos en memoria independiente.
let almacenesEnMemoria: Almacen[] = JSON.parse(JSON.stringify(initialAlmacenes));

/**
 * Devuelve todos los almacenes.
 */
export const getAlmacenes = (): Almacen[] => {
  return almacenesEnMemoria;
};

/**
 * Busca y devuelve un almacén por su ID.
 */
export const getAlmacenById = (id: string): Almacen | undefined => {
  return almacenesEnMemoria.find(a => a.id === id);
};

/**
 * Guarda (Crea o Edita) un almacén.
 */
export const saveAlmacen = (data: Omit<Almacen, 'id' | 'inventarios'>, id?: string) => {
  if (id) {
    // Lógica de Edición
    almacenesEnMemoria = almacenesEnMemoria.map(a => 
      a.id === id ? { ...a, ...data } : a
    );
  } else {
    // Lógica de Creación
    const newAlmacen: Almacen = {
      id: `ALM-${String(Date.now()).slice(-4)}`,
      ...data,
      inventarios: [],
    };
    almacenesEnMemoria.push(newAlmacen);
  }
};

/**
 * Elimina un almacén por su ID.
 */
export const deleteAlmacenById = (id: string) => {
  almacenesEnMemoria = almacenesEnMemoria.filter(a => a.id !== id);
};

/**
 * Busca y devuelve un inventario específico dentro de un almacén.
 */
export const getInventarioById = (almacenId: string, inventarioId: string): Inventario | undefined => {
  const almacen = getAlmacenById(almacenId);
  return almacen?.inventarios.find(inv => inv.id === inventarioId);
};

/**
 * Agrega un nuevo inventario a un almacén específico.
 */
export const addInventarioToAlmacen = (almacenId: string, inventarioData: Omit<Inventario, 'id' | 'productos'>) => {
  const almacen = almacenesEnMemoria.find(a => a.id === almacenId);
  // La regla de negocio de 10 inventarios por almacén se aplica aquí.
  if (almacen && almacen.inventarios.length < 10) {
    const newInventario: Inventario = {
      id: `INV-${String(Date.now()).slice(-3)}`,
      ...inventarioData,
      productos: [],
    };
    almacen.inventarios.push(newInventario);
  }
};

/**
 * Agrega un nuevo producto a un inventario específico.
 */
export const addProductoToInventario = (almacenId: string, inventarioId: string, productoData: Omit<Producto, 'id'>) => {
  const inventario = getInventarioById(almacenId, inventarioId);
  if (inventario) {
    const newProducto: Producto = {
      id: `PROD-${String(Date.now()).slice(-4)}`,
      ...productoData,
    };
    inventario.productos.push(newProducto);
  }
};