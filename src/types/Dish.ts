export interface Dish {
  _id?: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  activo: boolean;
}