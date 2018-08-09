/**
 * Estructura del objeto que contiene la informacino basica de una orden
 * que se muestra en el grid de ordenes-vendedor
 *
 * @export
 * @interface BasicInfoOrden
 */
export interface BasicInfoOrden {
  id: number;
  cliente: string;
  created_at: string;
  total: number;
  cantItems: number;
  estado: string;
}
