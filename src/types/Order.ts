export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "served";

export interface OrderItem {
    type: "dish" | "drink" | "menu" | "promotion";
    itemId: string;
    quantity: number;
    price: number;
    name: string;
}

export interface Order {
    _id: string;
    tableId: string;
    items: OrderItem[];
    status: OrderStatus;
    total: number;
    paidAt?: string | Date | null;
    createdAt: string | Date;
    updatedAt: string | Date;
}