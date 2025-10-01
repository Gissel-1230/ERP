// --- TIPOS Y DATOS DE VENTAS ---
export type OrderStatus = 'Pendiente' | 'En proceso de preparar' | 'Aceptado' | 'En Camino' | 'Rechazado';

export interface OrdenDeCompra {
  codigo: string;
  producto: string;
  cliente: string;
  cantidad: number;
  status: OrderStatus;
}

export const initialOrdenes: OrdenDeCompra[] = [
  { codigo: 'OC-2025-001', producto: 'Tornillo 1/4"', cliente: 'Constructora XYZ', cantidad: 5000, status: 'Aceptado' },
  { codigo: 'OC-2025-002', producto: 'Placa de Acero 2mm', cliente: 'Industrias GAMA', cantidad: 150, status: 'En Camino' },
  { codigo: 'OC-2025-003', producto: 'Viga de Aluminio', cliente: 'Arquitectura Delta', cantidad: 50, status: 'Pendiente' },
  { codigo: 'OC-2025-004', producto: 'Aceite Lubricante', cliente: 'Taller Central', cantidad: 20, status: 'En proceso de preparar' },
  { codigo: 'OC-2025-005', producto: 'Tornillo 1/2"', cliente: 'Constructora XYZ', cantidad: 1000, status: 'Rechazado' },
];


// --- TIPOS Y DATOS DE ALMACENES ---
export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  peso: number;
  unidadPeso: 'g' | 'kg';
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

export const initialAlmacenes: Almacen[] = [
  { 
    id: 'ALM-001', 
    nombre: 'Almacén Central', 
    ubicacion: 'Nave Principal, Sector A', 
    descripcion: 'Almacén de productos de alta rotación.',
    inventarios: [
      { 
        id: 'INV-01', 
        nombre: 'Tornillería', 
        descripcion: 'Tornillos y tuercas de varias medidas',
        productos: [
          { id: 'PROD-001', nombre: 'Tornillo 1/4"', cantidad: 8500, precioUnitario: 1.5, peso: 5, unidadPeso: 'g' },
          { id: 'PROD-004', nombre: 'Tuerca 1/4"', cantidad: 8500, precioUnitario: 0.5, peso: 2, unidadPeso: 'g' },
        ]
      },
      {
        id: 'INV-02',
        nombre: 'Placas Metálicas',
        descripcion: 'Placas de acero y aluminio',
        productos: [
          { id: 'PROD-002', nombre: 'Placa de Acero', cantidad: 300, precioUnitario: 120, peso: 2.5, unidadPeso: 'kg' },
        ]
      }
    ]
  },
  { 
    id: 'ALM-002', 
    nombre: 'Bodega de Materia Prima', 
    ubicacion: 'Edificio B, Planta Baja', 
    descripcion: 'Materiales para producción.',
    inventarios: [
      { 
        id: 'INV-03', 
        nombre: 'Materia Prima Pesada', 
        descripcion: 'Rollos de metal y otros materiales base.',
        productos: [
          { id: 'PROD-003', nombre: 'Rollo de Aluminio', cantidad: 50, precioUnitario: 3200, peso: 15, unidadPeso: 'kg' },
        ]
      },
    ]
  },
];