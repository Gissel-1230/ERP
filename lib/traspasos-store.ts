// lib/traspasos-store.ts
import { initialTraspasos, type Traspaso, type TraspasoStatus } from './data';
import { getProductoStock, updateProductoStock, getInventarioById } from './almacen-store';

let traspasosEnMemoria: Traspaso[] = JSON.parse(JSON.stringify(initialTraspasos));

const getNextFolio = (): string => {
  const ultimoFolio = traspasosEnMemoria.length > 0 ? traspasosEnMemoria[traspasosEnMemoria.length - 1].folio : 'TRB-0000';
  const ultimoNumero = parseInt(ultimoFolio.split('-')[1], 10);
  return `TRB-${String(ultimoNumero + 1).padStart(4, '0')}`;
};

export const getTraspasos = (): Traspaso[] => {
  return traspasosEnMemoria;
};

interface AddTraspasoData {
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  almacen_salida_id: string;
  inventario_salida_id: string;
  almacen_entrada_id: string;
  inventario_entrada_id: string;
  observaciones?: string;
}

export const addTraspaso = (data: AddTraspasoData): { success: boolean, message: string } => {
  // 1. Validar que origen y destino no sean el mismo
  if (data.inventario_salida_id === data.inventario_entrada_id) {
    return { success: false, message: 'El inventario de origen y destino no pueden ser el mismo.' };
  }

  // 2. Validar existencias
  const stockDisponible = getProductoStock(data.inventario_salida_id, data.producto_id);
  if (data.cantidad > stockDisponible) {
    return { success: false, message: `Stock insuficiente. Disponible: ${stockDisponible}` };
  }

  // 3. Crear el registro
  const nuevoTraspaso: Traspaso = {
    ...data,
    id: `TR-${String(Date.now()).slice(-4)}`,
    serie: 'TRB',
    folio: getNextFolio(),
    fecha: new Date().toLocaleString('es-MX'),
    estatus: 'pendiente',
    usuario_responsable: 'Ana López (Mock)', // Simulado, se obtendría del AuthContext
  };

  traspasosEnMemoria.push(nuevoTraspaso);
  return { success: true, message: 'Traspaso creado con éxito.' };
};

export const updateTraspasoStatus = (id: string, newStatus: TraspasoStatus) => {
  const traspaso = traspasosEnMemoria.find(t => t.id === id);
  if (!traspaso) return;

  // Si se acepta, se ejecuta el movimiento de stock
  if (newStatus === 'aceptado' && traspaso.estatus === 'pendiente') {
    const stockSalida = getProductoStock(traspaso.inventario_salida_id, traspaso.producto_id);
    const stockEntrada = getProductoStock(traspaso.inventario_entrada_id, traspaso.producto_id);
    
    // Validar stock de nuevo por si acaso
    if (traspaso.cantidad > stockSalida) {
      alert(`Error: Stock insuficiente en origen al momento de aceptar.`);
      return;
    }
    
    // Actualizar ambos inventarios
    updateProductoStock(traspaso.inventario_salida_id, traspaso.producto_id, stockSalida - traspaso.cantidad);
    updateProductoStock(traspaso.inventario_entrada_id, traspaso.producto_id, stockEntrada + traspaso.cantidad);
  }
  
  // Si se rechaza (y estaba pendiente), no se hace nada al stock, solo se actualiza el estatus.

  traspaso.estatus = newStatus;
};