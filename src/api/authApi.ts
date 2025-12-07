const API_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T = any> {
    message?: string;
    token?: string;
    user?: {
        id: string;
        usuario: string;
    };
    data?: T;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
    async register(usuario: string, contraseña: string) {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, contraseña }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al registrarse");
        return data;
    },

    async login(usuario: string, contraseña: string) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, contraseña }),
        });

        const data: ApiResponse = await res.json();
        if (!res.ok) throw new Error(data.message || "Usuario o contraseña incorrectos");

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    },

    async me() {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            } as Record<string, string>,
        });

        if (!res.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            throw new Error("Sesión expirada");
        }

        const data = await res.json();
        return data.user;
    },

    async get<T = any>(endpoint: string): Promise<T> {
        const res = await fetch(`${API_URL}/api${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            } as Record<string, string>,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error en la petición");
        }

        return res.json();
    },

    async post<T = any>(endpoint: string, body: any): Promise<T> {
        const res = await fetch(`${API_URL}/api${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            } as Record<string, string>,
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al crear");
        }

        return res.json();
    },

    async put<T = any>(endpoint: string, body: any): Promise<T> {
        const res = await fetch(`${API_URL}/api${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            } as Record<string, string>,
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al actualizar");
        }

        return res.json();
    },

    async delete(endpoint: string) {
        const res = await fetch(`${API_URL}/api${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            } as Record<string, string>,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al eliminar");
        }

        return res.json();
    },

    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`${API_URL}/uploads`, {
            method: "POST",
            headers: getAuthHeaders() as Record<string, string>,
            body: formData,
        });

        if (!res.ok) throw new Error("Error al subir imagen");
        const data = await res.json();
        return `${API_URL}/uploads/${data.filename}`;
    },
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};