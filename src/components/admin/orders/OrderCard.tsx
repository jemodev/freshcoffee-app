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

export const OrderCard = ({ order, mutate }: Props) => {
    const handleChangeStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const status = e.target.value;

        const { data, error } = await actions.orders.updateStatus({ id: order.id, status });

        if (data && !error) {
            toast.success(data.message);
            mutate();
        }
    };

    return <div className="p-5 shadow-lg space-y-5 border border-gray-200 ">
        <div className='text-sm grid grid-cols-2 justify-between text-gray-600'>
            <h2>ID Orden: <span className='font-black'>{order.id}</span></h2>
            <p className='text-right'>Cliente: {order.name}</p>
        </div>
        <div>
            Contenido:
            <div className="px-4" dangerouslySetInnerHTML={{ __html: order.contents }}></div>
        </div>

        <select onChange={handleChangeStatus} value={order.status} className='border border-gray-300 w-full p-2 text-center'>
            {orderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>

        <p className='text-right text-lg'>Total orden:
            <span className='text-amber-400 font-black pl-2'>
                {formatCurrency(order.total)}
            </span>
        </p>
    </div>;
};