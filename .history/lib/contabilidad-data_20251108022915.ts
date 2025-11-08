// Agregar esta interfaz a tu archivo lib/data.ts existente
export interface Poliza {
  id: number;
  fecha: string;
  tipo: string;
  numero: string;
  concepto: string;
  cargos: number;
  abonos: number;
}

export interface PolizaFilters {
  mes: string;
  año: string;
  tipo: string;
  busqueda: string;
}
