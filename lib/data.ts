// --- TIPOS Y DATOS DE VENTAS ---
export type OrderStatus = 'Pendiente' | 'En proceso de preparar' | 'Aceptado' | 'En Camino' | 'Rechazado';

export interface OrdenDeCompra {
  codigo: string;
  folio: string;
  fechaCreacion: string;
  producto: string;
  cliente: string;
  cantidad: number;
  valorTotal: number; // Nuevo campo
  status: OrderStatus;
}


export const initialOrdenes: OrdenDeCompra[] = [
  { codigo: 'OC-2025-001', folio: 'FS-A001', fechaCreacion: '15/09/2025', producto: 'Tornillo 1/4"', cliente: 'Constructora XYZ', cantidad: 5000, valorTotal: 7500.00, status: 'Aceptado' },
  { codigo: 'OC-2025-002', folio: 'FS-A002', fechaCreacion: '16/09/2025', producto: 'Placa de Acero 2mm', cliente: 'Industrias GAMA', cantidad: 150, valorTotal: 18000.00, status: 'En Camino' },
]


// --- TIPOS Y DATOS DE ALMACENES ---
export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  peso: number;
  unidadPeso: 'g' | 'kg';
  observaciones?: string; // Nuevo campo opcional
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

export interface CategoryItem {
  id: string | number;
  nombre: string;
  descripcion: string;
  product_count: number; // Campo que devuelve tu API
}

export interface GlobalProduct {
  product_id: number | string;
  product_name: string; 
  description: string;
  unit_price: number;
  unit_of_measure: string;
  minimum_stock: number;
  category_id: number;
  categoria_nombre: string; 
  current_stock_total: number;
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

export type TraspasoStatus = 'pendiente' | 'aceptado' | 'rechazado';

export interface Traspaso {
  id: string;
  serie: string;
  folio: string;
  fecha: string;
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  almacen_salida_id: string;
  inventario_salida_id: string;
  almacen_entrada_id: string;
  inventario_entrada_id: string;
  estatus: TraspasoStatus;
  usuario_responsable: string;
  observaciones?: string;
}

export const initialTraspasos: Traspaso[] = [
  {
    id: 'TR-001',
    serie: 'TRB',
    folio: 'TRB-0001',
    fecha: new Date().toLocaleString('es-MX'),
    producto_id: 'PROD-001',
    producto_nombre: 'Tornillo 1/4"',
    cantidad: 500,
    almacen_salida_id: 'ALM-001',
    inventario_salida_id: 'INV-01',
    almacen_entrada_id: 'ALM-002',
    inventario_entrada_id: 'INV-03',
    estatus: 'aceptado',
    usuario_responsable: 'Ana López'
  }
];
