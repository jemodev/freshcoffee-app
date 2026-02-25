import { defineAction } from "astro:actions";
import { guestCredentials } from "@/auth/dal";

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
};
