import type { Dish } from "./Dish";
import type { Drink } from "./Drink";

export interface Promotion {
  _id?: string;
  nombre: string;
  descripcion: string;
  entrante?: Dish | string;
  principal?: Dish | string;
  postre?: Dish | string;
  bebida?: Drink | string;
  precio: number;
  cantidad: number;
  activo: boolean;
  imagen: string;
}
