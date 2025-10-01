// lib/ventas-store.ts

import { initialOrdenes, type OrdenDeCompra, type OrderStatus } from './data';

let ordenesEnMemoria: OrdenDeCompra[] = [...initialOrdenes];

export const getOrdenes = (): OrdenDeCompra[] => {
  return ordenesEnMemoria;
};

export const addOrden = (orden: OrdenDeCompra) => {
  ordenesEnMemoria.push(orden);
};

// --- NUEVA FUNCIÓN PARA ACTUALIZAR ESTADO ---
export const updateOrdenStatus = (codigo: string, status: OrderStatus) => {
  ordenesEnMemoria = ordenesEnMemoria.map(orden => 
    orden.codigo === codigo ? { ...orden, status } : orden
  );
};