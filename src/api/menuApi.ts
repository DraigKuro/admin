import type { Menu } from "../types/Menu";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const menuApi = {
    getAll: async (): Promise<Menu[]> => {
        const res = await fetch(`${API_BASE}/menus`);
        if (!res.ok) throw new Error("Error al obtener menús");
        return res.json();
    },

    getById: async (id: string): Promise<Menu> => {
        const res = await fetch(`${API_BASE}/menus/${id}`);
        if (!res.ok) throw new Error("Error al obtener menú");
        return res.json();
    },

    create: async (data: Menu, file?: File): Promise<Menu> => {
        const formData = new FormData();
        formData.append("nombre", data.nombre);
        formData.append("descripcion", data.descripcion);
        formData.append("entrante", typeof data.entrante === "string" ? data.entrante : data.entrante._id!);
        formData.append("principal", typeof data.principal === "string" ? data.principal : data.principal._id!);
        formData.append("bebida", typeof data.bebida === "string" ? data.bebida : data.bebida._id!);
        if (data.postre) formData.append("postre", typeof data.postre === "string" ? data.postre : data.postre._id!);
        formData.append("precio", data.precio.toString());
        formData.append("activo", data.activo.toString());

        if (file) formData.append("image", file);

        const res = await fetch(`${API_BASE}/menus`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Error al crear menú");
        return res.json();
    },

    update: async (id: string, data: Partial<Menu>, file?: File): Promise<Menu> => {
        const formData = new FormData();
        if (data.nombre) formData.append("nombre", data.nombre);
        if (data.descripcion) formData.append("descripcion", data.descripcion);
        if (data.entrante) formData.append("entrante", typeof data.entrante === "string" ? data.entrante : data.entrante._id!);
        if (data.principal) formData.append("principal", typeof data.principal === "string" ? data.principal : data.principal._id!);
        if (data.bebida) formData.append("bebida", typeof data.bebida === "string" ? data.bebida : data.bebida._id!);
        if (data.postre !== undefined) formData.append("postre", typeof data.postre === "string" ? data.postre : data.postre?._id!);
        if (data.precio !== undefined) formData.append("precio", data.precio.toString());
        if (data.activo !== undefined) formData.append("activo", data.activo.toString());

        if (file) formData.append("image", file);

        const res = await fetch(`${API_BASE}/menus/${id}`, {
            method: "PUT",
            body: formData,
        });

        if (!res.ok) throw new Error("Error al actualizar menú");
        return res.json();
    },

    remove: async (id: string): Promise<Menu> => {
        const res = await fetch(`${API_BASE}/menus/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar menú");
        return res.json();
    },
};
