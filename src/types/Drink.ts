export interface Drink {
  _id?: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  activo: boolean;
}
