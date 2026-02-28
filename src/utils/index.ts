import type { OrderItem } from "@/types";

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

export const toLowerFirstChar = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toLowerCase();
};

export const calculateTotal = (orders: OrderItem[]) => {
    return orders.reduce((total, order) => {
        return total + order.price * order.quantity;
    }, 0);
};

export const formatOrders = (orders: OrderItem[]) => {
    let contents = "";

    orders.map((order) => {
        contents += `<li><span class="font-bold">${order.quantity} x</span> - ${order.name} ${order.size ? `(${order.size})` : ""}  - ${formatCurrency(order.price)}</li>`;
    });

    return contents;
};
