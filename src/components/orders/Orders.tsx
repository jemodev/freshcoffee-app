import { useOrderStore } from "@/store/order";
import ProductDetails from "./ProductDetails";
import { formatCurrency } from "@/utils";
import { SubmitOrderForm } from "@/components/orders/SubmitOrderForm";

export default function Orders() {
    const { orders } = useOrderStore();
    const totalToPay = orders.reduce(
        (total, order) => total + order.price * order.quantity,
        0,
    );

    return (
        <>
            {orders.length === 0 ? (
                <p className="text-center text-gray-500 py-10 text-xl">
                    No hay productos en el pedido.
                </p>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Ajusta tu pedido
                    </h2>

                    {orders.map((order) => {
                        const key = order.size
                            ? `${order.id}-${order.size}`
                            : order.id;
                        return <ProductDetails key={key} order={order} />;
                    })}

                    <h2 className="mt-5 text-2xl font-bold text-right">
                        Total a pagar: {formatCurrency(totalToPay)}
                    </h2>

                    <SubmitOrderForm />
                </>
            )}
        </>
    );
}
