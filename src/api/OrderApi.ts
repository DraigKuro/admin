import type { Order, OrderStatus } from "../types/Order";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const orderApi = {
    getActiveOrders: async (): Promise<{ success: boolean; orders: Order[] }> => {
        const res = await fetch(`${API_BASE}/orders/active`);
        if (!res.ok) throw new Error("Error al obtener las órdenes activas");
        return res.json();
    },

    updateStatus: async (
        orderId: string,
        newStatus: OrderStatus
    ): Promise<{ success: boolean; message: string; order: Order }> => {
        const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al actualizar el estado de la orden");
        }

        return res.json();
    },

    getByTable: async (tableId: string): Promise<{ success: boolean; orders: Order[] }> => {
        const res = await fetch(`${API_BASE}/orders/table/${tableId}`);
        if (!res.ok) throw new Error("Error al obtener órdenes de la mesa");
        return res.json();
    }
};