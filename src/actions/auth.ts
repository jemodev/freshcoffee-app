import { ActionError, defineAction } from "astro:actions";
import { guestCredentials } from "@/auth/dal";
import { z } from "astro:schema";
import { nullToEmptyString } from "@/utils";

export const auth = {
    signInAsGuest: defineAction({
        handler: async (intput, ctx) => {
            const res = await fetch(import.meta.env.AUTH_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(guestCredentials),
            });

            if (!res.ok) {
                throw new Error("Failed to sign in as guest");
            }

            const data = await res.json();
            ctx.cookies.set("FRESHCOOFEE_TOKEN", data.token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            });

            return true;
        },
    }),

    signIn: defineAction({
        accept: "form",
        input: z.object({
            username: z.preprocess(
                nullToEmptyString,
                z.string().min(1, "Usuario es requerido"),
            ),
            password: z.preprocess(
                nullToEmptyString,
                z.string().min(1, "Contraseña es requerida"),
            ),
        }),
        handler: async (input, ctx) => {
            // Implement regular sign-in logic here if needed
            const res = await fetch(import.meta.env.AUTH_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });
            const data = await res.json();

            if (data.code === "[jwt_auth] incorrect_password") {
                throw new ActionError({
                    message: "Contraseña incorrecta",
                    code: "UNAUTHORIZED",
                });
            }

            if (data.code === "[jwt_auth] invalid_username") {
                throw new ActionError({
                    message: "Usuario no encontrado",
                    code: "UNAUTHORIZED",
                });
            }

            ctx.cookies.set("FRESHCOOFEE_TOKEN", data.token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            });

            return true;
        },
    }),

    signOut: defineAction({
        handler: (_, ctx) => {
            ctx.cookies.delete("FRESHCOOFEE_TOKEN", { path: "/" });
            return true;
        },
    }),
};
