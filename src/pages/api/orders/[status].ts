import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {

    const url = new URL(request.url);
    const perPage = Number(url.searchParams.get("per_page")) || 100;
    console.log(perPage);
    const finalUrl = `${import.meta.env.SITE_URL}/wp-json/freshcoffee/api/v1/filter-orders?status=${params.status}&per_page=${perPage}`;

    const response = await fetch(finalUrl);
    const data = await response.json();


    return new Response(JSON.stringify(data));
};
