// lib/almacen-store.ts -- bd temporal

import { initialAlmacenes, type Almacen } from './data';

// Hacemos una copia mutable de los datos iniciales que vivirá en la memoria del cliente.
let almacenesEnMemoria: Almacen[] = [...initialAlmacenes];

// Creamos funciones para interactuar con nuestros datos, como si fuera una API.
export const getAlmacenes = () => {
  return almacenesEnMemoria;
};

export const getAlmacenById = (id: string) => {
  return almacenesEnMemoria.find(a => a.id === id);
};

export const saveAlmacen = (data: Omit<Almacen, 'id' | 'materiaPrima' | 'productos' | 'insumos'>, id?: string) => {
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
      materiaPrima: [],
      productos: [],
      insumos: [],
    };
    almacenesEnMemoria.push(newAlmacen);
  }
};

export const deleteAlmacenById = (id: string) => {
  almacenesEnMemoria = almacenesEnMemoria.filter(a => a.id !== id);
};