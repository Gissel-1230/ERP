// lib/data.ts

// --- TIPOS DE VENTAS ---
export type OrderStatus = 'pendiente' | 'en proceso de preparar' | 'aceptado' | 'en camino' | 'rechazado';
export interface OrdenDeCompra {
  codigo: string;
  folio: string;
  fechaCreacion: string;
  producto: string;
  cliente: string;
  cantidad: number;
  valorTotal: number;
  status: OrderStatus;
}
export const initialOrdenes: OrdenDeCompra[] = [
  { codigo: 'OC-2025-001', folio: 'FS-A001', fechaCreacion: '15/09/2025', producto: 'Tornillo 1/4"', cliente: 'Constructora XYZ', cantidad: 5000, valorTotal: 7500.00, status: 'aceptado' },
  { codigo: 'OC-2025-002', folio: 'FS-A002', fechaCreacion: '16/09/2025', producto: 'Placa de Acero 2mm', cliente: 'Industrias GAMA', cantidad: 150, valorTotal: 18000.00, status: 'en camino' },
];

// --- TIPOS DE ALMACENES ---
export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  peso: number;
  unidadPeso: 'g' | 'kg';
  observaciones?: string;
}
export interface Inventario {
  id: string;
  nombre: string;
  descripcion: string;
  productos: Producto[];
}
export interface Almacen {
  id: string;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  inventarios: Inventario[];
}
export const initialAlmacenes: Almacen[] = [ /* ... Tus datos de ejemplo ... */ ];
export interface GlobalProduct { /* ... Tu definición de GlobalProduct ... */ }
export interface CategoryItem { /* ... Tu definición de CategoryItem ... */ }


// --- TIPOS DE TRASPASOS (CORREGIDOS) ---
export type TraspasoStatus = 'pending' | 'approved' | 'rejected' | string;

// Esta interfaz ahora coincide 100% con lo que la API devuelve
// y lo que el store transforma en getTraspasos
export interface Traspaso {
  id: number;
  folio: string;
  product_name: string;
  quantity: number;
  from_warehouse_name: string;
  to_warehouse_name: string;
  request_date: string;
  status: TraspasoStatus;
  requester_name: string;
  producto_id?: number | string;
  almacen_salida_id?: number | string;
  almacen_entrada_id?: number | string;
  observations?: string;
}