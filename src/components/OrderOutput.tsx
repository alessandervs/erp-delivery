'use client';

import { ClientMessageDisplay } from './ClientMessageDisplay';
import { DeliveryMessageDisplay } from './DeliveryMessageDisplay';

type Props = {
    clientMsg: string;
    deliveryMsg: string;
};

export const OrderOutput = ({ clientMsg, deliveryMsg }: Props) => {
    if (!clientMsg && !deliveryMsg) return null;

    return (
        <div className="space-y-6 mt-8">
            {deliveryMsg && <DeliveryMessageDisplay message={deliveryMsg} />}
            {clientMsg && <ClientMessageDisplay message={clientMsg} />}
        </div>
    );
};
