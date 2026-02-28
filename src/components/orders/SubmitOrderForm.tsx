import { useOrderStore } from "@/store/order";
import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { toast } from "react-toastify";

export const SubmitOrderForm = () => {
    const { orders } = useOrderStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get("name")?.toString() as string;

        const { data, error } = await actions.orders.createOrder({
            name,
            orders,
        });

        const actionError = isActionError(error) ? error.message : null;
        if (actionError) {
            toast.error(actionError);
            return;
        }

        const inputErrors = isInputError(error) ? error.issues : [];
        if (error && inputErrors.length > 0) {
            inputErrors.forEach((err) => toast.error(err.message));
            return;
        }

        if (data && !error) {
            toast.success(data.message);

            setTimeout(() => {
                navigate("/");
            }, 5000);
        }

        form.reset();
    };

    return (
        <form className="mt-5" onSubmit={handleSubmit}>
            <div className="space-y-3">
                <label htmlFor="name" className="font-bold text-lg">
                    Tu Nombre:
                </label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Coloca tu Nombre"
                    className="border border-gray-300 p-2 w-full rounded-xl"
                />
            </div>
            <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-xl py-3 mt-5 text-lg font-bold uppercase cursor-pointer"
                type="submit"
            >
                Realizar Pedido
            </button>
        </form>
    );
};
