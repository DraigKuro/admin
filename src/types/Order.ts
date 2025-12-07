import type { Table } from "./Table";

export interface Order {
    id: string;
    mesa: string;
    descripcion: string;
    estado: "preparando" | "listo" | "servido";
};