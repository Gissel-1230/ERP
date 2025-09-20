// lib/data.ts

// -- DEFINICIÓN DE TIPOS --
export interface Item {
  id: string;
  nombre: string;
  precio: number;
}

export interface Almacen {
  id: string;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  materiaPrima: Item[];
  productos: Item[];
  insumos: Item[];
}

// -- DATOS MOCK EXPORTADOS --
export const initialAlmacenes: Almacen[] = [
  { 
    id: 'ALM-001', 
    nombre: 'Almacén Central', 
    ubicacion: 'Nave Principal, Sector A', 
    descripcion: 'Almacén de productos de alta rotación.',
    materiaPrima: [{ id: 'MP-1', nombre: 'Acero', precio: 2500 }],
    productos: [{ id: 'PROD-1', nombre: 'Tornillo 1/4"', precio: 1.5 }],
    insumos: [{ id: 'INS-1', nombre: 'Aceite Lubricante', precio: 150 }],
  },
  { 
    id: 'ALM-002', 
    nombre: 'Bodega de Materia Prima', 
    ubicacion: 'Edificio B, Planta Baja', 
    descripcion: 'Materiales para producción.',
    materiaPrima: [{ id: 'MP-2', nombre: 'Aluminio', precio: 3200 }],
    productos: [],
    insumos: [],
  },
];