import type { Dish } from "../types/Dish";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const dishApi = {
    getAll: async () => {
        const res = await fetch(`${API_BASE}/dishes`);
        if (!res.ok) throw new Error("Error al obtener platos");
        return res.json();
    },

    getById: async (id: string) => {
        const res = await fetch(`${API_BASE}/dishes/${id}`);
        if (!res.ok) throw new Error("Error al obtener plato");
        return res.json();
    },

    create: async (data: Dish, file?: File) => {
        const formData = new FormData();
        formData.append("name", data.nombre);
        formData.append("categoria", data.categoria);
        formData.append("description", data.descripcion);
        formData.append("price", data.precio.toString());
        formData.append("activo", data.activo.toString());

        if (file) {
            formData.append("image", file);
        }

        const res = await fetch(`${API_BASE}/dishes`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Error al crear plato");
        return res.json();
    },


    update: async (
        id: string,
        data: { name?: string; description?: string; price?: number; activo?: boolean; },
        file?: File
    ) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);
        if (data.price !== undefined) formData.append("price", data.price.toString());
        if (data.activo !== undefined) formData.append("activo", data.activo.toString());

        if (file) {
            formData.append("image", file);
        }

        const res = await fetch(`${API_BASE}/dishes/${id}`, {
            method: "PUT",
            body: formData,
        });

        if (!res.ok) throw new Error("Error al actualizar plato");
        return res.json();
    },

    remove: async (id: string) => {
        const res = await fetch(`${API_BASE}/dishes/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Error al eliminar plato");
        return res.json();
    },
};
