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
  anio: string;
  tipo: string;
  busqueda: string;
}
