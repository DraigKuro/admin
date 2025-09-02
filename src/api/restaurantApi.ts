const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const restaurantApi = {
    getRestaurant: async () => {
        const res = await fetch(`${API_BASE}/restaurant`);
        if (!res.ok) throw new Error("Error al obtener datos del restaurante");
        return res.json();
    },

    updateBasicInfo: async (data: {
        name?: string;
        cif?: string;
        openingHours?: { open: string; close: string };
    }) => {
        const res = await fetch(`${API_BASE}/restaurant/basic`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar información básica");
        return res.json();
    },

    updateContactInfo: async (data: {
        email?: string;
        phone?: string;
        socialLinks?: {
            facebook?: { enabled: boolean; url?: string };
            instagram?: { enabled: boolean; url?: string };
            twitter?: { enabled: boolean; url?: string };
            tiktok?: { enabled: boolean; url?: string };
        };
    }) => {
        const res = await fetch(`${API_BASE}/restaurant/contact`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Error al actualizar contacto");
        return res.json();
    },

    updateAddressInfo: async (data: {
        address?: string;
        reference?: string;
        mapUrl?: string;
    }) => {
        const res = await fetch(`${API_BASE}/restaurant/address`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar dirección");
        return res.json();
    },

    updateLogo: async (file: File) => {
        const formData = new FormData();
        formData.append("logo", file);

        const res = await fetch(`${API_BASE}/restaurant/logo`, {
            method: "PUT",
            body: formData,
        });
        if (!res.ok) throw new Error("Error al subir logo");
        return res.json();
    },

    deleteLogo: async (restaurantId: string) => {
        const res = await fetch(`${API_BASE}/restaurant/logo/${restaurantId}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar logo");
        return res.json();
    },
};
