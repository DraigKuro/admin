import type { Table } from "../types/Table";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const tableApi = {
    getAll: async (): Promise<Table[]> => {
        const res = await fetch(`${API_BASE}/tables`);
        if (!res.ok) throw new Error("Error al obtener mesas");
        return res.json();
    },

    getById: async (id: string): Promise<Table> => {
        const res = await fetch(`${API_BASE}/tables/${id}`);
        if (!res.ok) throw new Error("Error al obtener la mesa");
        return res.json();
    },

    create: async (data: { nombre: string; estado?: boolean; activo?: boolean }): Promise<Table> => {
        const res = await fetch(`${API_BASE}/tables`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear mesa");
        return res.json();
    },

    update: async (
        id: string,
        data: Partial<{ nombre: string; estado: boolean; activo: boolean }>
    ): Promise<Table> => {
        const res = await fetch(`${API_BASE}/tables/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar mesa");
        return res.json();
    },

    remove: async (id: string) => {
        const res = await fetch(`${API_BASE}/tables/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar mesa");
        return res.json();
    },
};
