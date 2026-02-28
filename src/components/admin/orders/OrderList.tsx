type Props = {
    status: string;
};

export const OrderList = ({ status }: Props) => {
    return <div>OrderList - {status}</div>;
};
