import CheckCircle from "@/assets/icons/circle-check-big.svg";
import Clock from "@/assets/icons/clock.svg";
import Coffee from "@/assets/icons/coffee.svg";
import XCircle from "@/assets/icons/circle-x.svg";
import type { OrderContent } from "@/types";
import { formatCurrency } from "@/utils";
import { orderStatusOptions } from "@/utils/constants";
import { actions } from "astro:actions";
import { toast } from "react-toastify";
import type { KeyedMutator } from "swr";

type Props = {
    order: OrderContent;
    mutate: KeyedMutator<OrderContent[]>;
};

export type OrderStatus = "pending" | "in_progress" | "cancelled" | "completed"

const statusConfig: Record<OrderStatus, { label: string; color: string; borderColor: string; icon: React.ReactNode }> = {
    pending: {
        label: "Pendiente",
        color: "bg-amber-50 text-amber-600 border-amber-200",
        borderColor: "border-t-amber-400",
        icon: <img src={Clock.src} className="h-3.5 w-3.5" alt="Pendiente" />,
    },
    in_progress: {
        label: "Preparando",
        color: "bg-blue-50 text-blue-600 border-blue-200",
        borderColor: "border-t-blue-500",
        icon: <img src={Coffee.src} className="h-3.5 w-3.5" alt="Preparando" />,
    },
    completed: {
        label: "Completada",
        color: "bg-green-50 text-green-600 border-green-200",
        borderColor: "border-t-green-500",
        icon: <img src={CheckCircle.src} className="h-3.5 w-3.5" alt="Completada" />,
    },
    cancelled: {
        label: "Cancelada",
        color: "bg-red-50 text-red-600 border-red-200",
        borderColor: "border-t-red-500",
        icon: <img src={XCircle.src} className="h-3.5 w-3.5" alt="Cancelada" />,
    },
}

export const OrderCard = ({ order, mutate }: Props) => {
    const config = statusConfig[order.status as OrderStatus]
    const statuses: OrderStatus[] = ["pending", "in_progress", "completed", "cancelled"]

    // const handleChangeStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     e.preventDefault();
    //     const status = e.target.value;

    //     const { data, error } = await actions.orders.updateStatus({ id: order.id, status });

    //     if (data && !error) {
    //         toast.success(data.message);
    //         mutate();
    //     }
    // };

    const handleClickStatus = async (status: string) => {
        const { data, error } = await actions.orders.updateStatus({ id: order.id, status });
        if (data && !error) {
            toast.success(data.message);
            mutate();
        }
    };

    const statusButtonConfig: Record<OrderStatus, { bgActive: string; iconColor: string }> = {
        pending: { bgActive: "bg-amber-100", iconColor: "text-amber-500" },
        in_progress: { bgActive: "bg-blue-100", iconColor: "text-blue-500" },
        completed: { bgActive: "bg-green-100", iconColor: "text-green-500" },
        cancelled: { bgActive: "bg-red-100", iconColor: "text-red-500" },
    }

    return <div className={`bg-card p-5 shadow-sm space-y-5 rounded-lg border border-transparent border-t-4 ${config.borderColor}`}>
        <div className='text-sm grid grid-cols-2 justify-between text-gray-600'>
            <h2>Orden #<span className='font-black'>{order.id}</span></h2>
            <p className='text-right'>Cliente: {order.name}</p>
        </div>
        <div>
            <div className="px-4 text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: order.contents }}></div>
        </div>

        <div className="mb-4">
            <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                Cambiar estado de la orden:
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-1.5">
                {orderStatusOptions.map((option) => {
                    const btnConfig = statusButtonConfig[option.value as OrderStatus]
                    const isActive = option.value === order.status;
                    return (
                        <button
                            key={option.value}
                            className={`flex h-9 items-center justify-center rounded-md border transition-colors ${isActive ? `${btnConfig.bgActive} ${btnConfig.iconColor} border-transparent` : "border-slate-200 bg-background text-muted-foreground hover:bg-muted"
                                }`}
                            onClick={() => handleClickStatus(option.value)}
                        >
                            {option.value === 'pending' && <img src={Clock.src} className="size-4" alt="Pendiente" />}
                            {option.value === 'in_progress' && <img src={Coffee.src} className="size-4" alt="En progreso" />}
                            {option.value === 'completed' && <img src={CheckCircle.src} className="size-4" alt="Completado" />}
                            {option.value === 'cancelled' && <img src={XCircle.src} className="size-4" alt="Cancelado" />}
                        </button>
                    )
                })}
            </div>

            {/* <select onChange={handleChangeStatus} value={order.status} className='border border-gray-300 w-full p-2 text-center'>
            {orderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select> */}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-t-slate-200">
            <span className='text-[10px] font-semibold text-slate-700 uppercase tracking-wider'>Total orden:
            </span>
            <span className='text-xl font-bold text-amber-500'>
                {formatCurrency(order.total)}
            </span>
        </div>
    </div >;
};