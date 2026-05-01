import useSWR from "swr";
import type { OrderContent } from "@/types";

const cleanContents = (htmlContent: string) => {
    if (!htmlContent) return "";

    // Esta expresión regular busca: un guion, espacio, signo $, números y decimales
    // al final de la cadena o antes de un salto de línea.
    return htmlContent.replace(/\s*-\s*\$\d+(\.\d{2,3})?/g, "");
};

export const PickupDisplay = () => {
    const url = `/api/orders/completed?per_page=5`;

    const fetcher = () =>
        fetch(url)
            .then((res) => res.json())
            .then((data) => data);
    const config = {
        refreshInterval: 1000 * 60,
    };

    const { data, isLoading } = useSWR<OrderContent[]>(url, fetcher, config);

    if (isLoading) return <div>Cargando ordenes...</div>;

    return !data || data.length === 0 ? (
        <p className="text-center text-xl text-slate-500 mt-10">
            No hay ordenes listas
        </p>
    ) : (
        <div className="grid grid-cols-1 gap-5 w-full">
            {data.map((order) => (
                <div key={order.id} className="shadow p-5 border border-gray-200 ">
                    <p className="text-2xl font-mono font-bold">Orden #{order.id}</p>
                    <p className="text-3xl font-mono font-bold text-amber-700">{order.name}</p>
                    <p
                        dangerouslySetInnerHTML={{ __html: cleanContents(order.contents) }}
                        className="pl-4 mt-2 text-lg font-mono"
                    />
                </div>
            ))}
        </div>
    );
};