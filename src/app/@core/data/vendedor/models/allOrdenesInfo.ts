/**
 * Estructura basica de la informacion mostrada de las ordenes en el dashboard
 * cada posicion tiene el nombre de usuario de cada vendedor y info sobre las ordenes
 * de dicho vendedor, la cantidad total, las ordenes con errores, pendientes etc
 *
 * @export
 * @interface AllOrdenesInfo
 */
export interface AllOrdenesInfo {
  vendedor: string;
  numOrdenes: number;
  numOrdenesErr: string;
  numOrdenesPend: number;
  numOrdenesVistas: number;
}
