import { verifySession } from "@/auth/dal";
import { OrderItemSchema } from "@/types";
import { calculateTotal, formatOrders } from "@/utils";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const orders = {
    createOrder: defineAction({
        accept: "json",
        input: z.object({
            name: z.string().min(1, "El nombre es requerido"),
            orders: OrderItemSchema.array().min(
                1,
                "El pedido no puede estar vacío",
            ),
        }),
        handler: async (input, ctx) => {
            const token = ctx.cookies.get("FRESHCOOFEE_TOKEN")?.value;

            const user = ctx.locals.user;

            const content = formatOrders(input.orders);
            const total = calculateTotal(input.orders);

            const res = await fetch(
                `${import.meta.env.API_URL}/freshcoffee_order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: `Orden de: ${input.name}`,
                        content,
                        status: "publish",
                        acf: {
                            total,
                            status: "pending",
                            name: input.name,
                        },
                    }),
                },
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to create order");
            }

            const { id }: { id: number } = await res.json();

            return {
                message: `Orden creada exitosamente con ID: ${id}`,
            };
        },
    }),
    updateStatus: defineAction({
        accept: "json",
        input: z.object({
            id: z.number(),
            status: z.string(),
        }),
        handler: async (input, ctx) => {
            const token = ctx.cookies.get("FRESHCOOFEE_TOKEN")?.value;

            const user = ctx.locals.user;

            if (user.role !== "administrator") {
                throw new ActionError({
                    message: "Hubo un error al actualizar la orden",
                    code: "BAD_REQUEST",
                });
            }

            const res = await fetch(
                `${import.meta.env.API_URL}/freshcoffee_order/${input.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        acf: {
                            status: input.status,
                        },
                    }),
                },
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update order");
            }

            return {
                message: "Orden actualizada",
            };
        },
    }),
};
