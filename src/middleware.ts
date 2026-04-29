import { defineMiddleware } from "astro:middleware";
import { verifySession } from "./auth/dal";

export const onRequest = defineMiddleware(async (ctx, next) => {
    const { pathname } = ctx.url;
    const isAdminRoute = pathname.startsWith("/admin");
    const isOrderRoute = pathname.startsWith("/order");
    const isOrderActionRoute = pathname.startsWith("/_actions/orders");

    const isProtectedRoute = isAdminRoute || isOrderRoute || isOrderActionRoute;

    if (!isProtectedRoute) return next();

    const token = ctx.cookies.get("FRESHCOOFEE_TOKEN")?.value ?? "";

    const { user } = await verifySession(token);

    if (!user) return Response.redirect(new URL("/", ctx.url), 302);

    ctx.locals.user = user;

    const { role } = user;

    if (role === "administrator") {
        return next();
    }

    if (role === "freshcoffee_customer") {
        if (isAdminRoute) {
            ctx.cookies.delete("FRESHCOOFEE_TOKEN", {
                path: "/",
            });
            return Response.redirect(new URL("/", ctx.url), 302);
        }

        return next();
    }

    return new Response("Rol no permitido", { status: 403 });
});
