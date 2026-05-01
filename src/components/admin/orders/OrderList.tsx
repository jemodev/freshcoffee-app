import type { OrderContent } from "@/types";
import useSWR from "swr";
import { OrderCard } from "./OrderCard";
import Clock from "@/assets/icons/clock.svg";
import Coffee from "@/assets/icons/coffee.svg";
import CheckCircle from "@/assets/icons/circle-check-big.svg";
import XCircle from "@/assets/icons/circle-x.svg";

type Props = {
    status: string;
};

export type OrderStatus = "pending" | "in_progress" | "cancelled" | "completed"

const statusConfig: Record<OrderStatus, { label: string; color: string; borderColor: string; icon: React.ReactNode }> = {
    pending: {
        label: "Pendiente",
        color: "bg-amber-50 text-amber-600 border-amber-200",
        borderColor: "border-t-amber-400",
        icon: <img src={Clock.src} className="size-12 mx-auto" alt="Pendiente" />,
    },
    in_progress: {
        label: "Preparando",
        color: "bg-blue-50 text-blue-600 border-blue-200",
        borderColor: "border-t-blue-500",
        icon: <img src={Coffee.src} className="size-12 mx-auto" alt="Preparando" />,
    },
    completed: {
        label: "Completada",
        color: "bg-green-50 text-green-600 border-green-200",
        borderColor: "border-t-green-500",
        icon: <img src={CheckCircle.src} className="size-12 mx-auto" alt="Completada" />,
    },
    cancelled: {
        label: "Cancelada",
        color: "bg-red-50 text-red-600 border-red-200",
        borderColor: "border-t-red-500",
        icon: <img src={XCircle.src} className="size-12 mx-auto" alt="Cancelada" />,
    },
}

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
            <div className="text-center">
                {statusConfig[status as OrderStatus].icon}
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay ordenes</h3>
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
