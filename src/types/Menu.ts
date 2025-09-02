import type { Dish } from "./Dish";
import type { Drink } from "./Drink";

export interface Menu {
  _id?: string;
  nombre: string;
  descripcion: string;
  entrante: Dish | string;
  principal: Dish | string;
  postre?: Dish | string;
  bebida: Drink | string;
  precio: number;
  activo: boolean;
  imagen: string;
}
