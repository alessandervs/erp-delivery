'use client';

import { OrderForm } from './OrderForm';
import { OrderOutput } from './OrderOutput';
import { OrderHistory } from './OrderHistory';
import { MessageHistory } from './MessageHistory';
import { useState } from 'react';

export const OrderManager = ({ initialOrders }: { initialOrders: any[] }) => {
    const [messages, setMessages] = useState({ client: '', delivery: '' });

    const handleOrderGenerated = (data: any, clientMsg: string, deliveryMsg: string) => {
        setMessages({ client: clientMsg, delivery: deliveryMsg });
    };


    return (
        <div className="container mx-auto max-w-5xl py-8 px-4">
            <OrderForm onOrderGenerated={handleOrderGenerated} />
            <OrderOutput clientMsg={messages.client} deliveryMsg={messages.delivery} />
            <MessageHistory orders={initialOrders} />
            <OrderHistory orders={initialOrders} />
        </div>
    );
};
