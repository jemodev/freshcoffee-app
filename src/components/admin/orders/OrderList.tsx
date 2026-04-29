import type { OrderContent } from "@/types";
import useSWR from "swr";
import { OrderCard } from "./OrderCard";

type Props = {
    status: string;
};

export const OrderList = ({ status }: Props) => {
    const url = `/api/orders/${status}`;

    const fetcher = () =>
        fetch(url)
            .then((res) => res.json())
            .then((data) => data);
    const config = { refreshInterval: 60 * 1000 };

    const { data, error, isLoading, mutate } = useSWR<OrderContent[]>(url, fetcher, config);

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar las ordenes</div>;

    if (data) {
        return data.length === 0 ? (
            <div className="text-red-500 text-center text-lg font-medium">
                No hay ordenes
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {data.map((order) => (
                    <div key={order.id}><OrderCard order={order} mutate={mutate} /></div>
                ))}
            </div>
        );
    }


    return <div>OrderList - {status}</div>;
};
