'use client';

import { Button } from './ui';
import { useState } from 'react';

type Props = {
    message: string;
};

export const DeliveryMessageDisplay = ({ message }: Props) => {
    const [copySuccess, setCopySuccess] = useState(false);

    if (!message) return null;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-red-600 mb-2 border-b pb-2">📋 Ficha da Entrega (Entregador):</h3>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm font-mono border border-dashed border-gray-300">
                {message}
            </pre>
            <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                onClick={copyToClipboard}
            >
                {copySuccess ? 'Copiado! ✅' : 'Copiar Dados Entrega'}
            </Button>
        </div>
    );
};
