// lib/ventas-store.ts
import { initialOrdenes, type OrdenDeCompra, type OrderStatus } from './data';

let ordenesEnMemoria: OrdenDeCompra[] = JSON.parse(JSON.stringify(initialOrdenes));

export const getOrdenes = (): OrdenDeCompra[] => {
  return ordenesEnMemoria;
};


// Actualizamos la función 'addOrden' para que reciba también el valorTotal
export const addOrden = (ordenData: Omit<OrdenDeCompra, 'codigo' | 'fechaCreacion' | 'status'>) => {
  const nuevaOrden: OrdenDeCompra = {
    ...ordenData,
    codigo: `OC-${String(Date.now()).slice(-4)}`,
    fechaCreacion: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    status: 'Pendiente',
  };
  ordenesEnMemoria.push(nuevaOrden);
};


// --- NUEVA FUNCIÓN PARA ACTUALIZAR ESTADO ---
export const updateOrdenStatus = (codigo: string, status: OrderStatus) => {
  ordenesEnMemoria = ordenesEnMemoria.map(orden => 
    orden.codigo === codigo ? { ...orden, status } : orden
  );
};

