import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {

    const url = `${import.meta.env.SITE_URL}/wp-json/freshcoffee/api/v1/filter-orders?status=${params.status}`;

    const response = await fetch(url);
    const data = await response.json();


    return new Response(JSON.stringify(data));
};
