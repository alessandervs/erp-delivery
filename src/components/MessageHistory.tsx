'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Eye, Copy, Check } from 'lucide-react';
import { Input, Button } from './ui';
import { ClientMessageDisplay } from './ClientMessageDisplay';
import { DeliveryMessageDisplay } from './DeliveryMessageDisplay';

type MessageEntry = {
    id: number;
    type: 'CLIENT' | 'DELIVERY';
    content: string;
    createdAt: Date;
    clientName: string;
    orderId: number;
};

type Props = {
    orders: any[]; // We'll derive messages from orders
};

export const MessageHistory = ({ orders }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<MessageEntry | null>(null);

    // Flatten orders into messages
    const allMessages: MessageEntry[] = orders.flatMap(order => {
        const msgs: MessageEntry[] = [];
        if (order.clientMessages) {
            order.clientMessages.forEach((m: any) => msgs.push({
                id: m.id,
                type: 'CLIENT',
                content: m.content,
                createdAt: new Date(m.createdAt),
                clientName: order.snapshotName || order.clientName, // Fallback
                orderId: order.id
            }));
        }
        if (order.deliveryMessages) {
            order.deliveryMessages.forEach((m: any) => msgs.push({
                id: m.id,
                type: 'DELIVERY',
                content: m.content,
                createdAt: new Date(m.createdAt),
                clientName: order.snapshotName || order.clientName,
                orderId: order.id
            }));
        }
        return msgs;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const filteredMessages = allMessages.filter(msg =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
            <div className="p-6 border-b bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    ✉️ Histórico de Mensagens
                </h2>
                <div className="mt-4">
                    <div className="relative">
                        <Input
                            placeholder="Buscar nas mensagens..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold uppercase">
                        <tr>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredMessages.map((msg) => (
                            <tr key={`${msg.type}-${msg.id}`} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(msg.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${msg.type === 'CLIENT' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {msg.type === 'CLIENT' ? 'CLIENTE' : 'ENTREGA'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {msg.clientName}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedMessage(msg)}
                                        className="text-gray-500 hover:text-blue-600 p-1"
                                        title="Ver Mensagem"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredMessages.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    Nenhuma mensagem encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative">
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
                        >
                            ✖
                        </button>

                        <div className="p-2">
                            {selectedMessage.type === 'CLIENT' ? (
                                <ClientMessageDisplay message={selectedMessage.content} />
                            ) : (
                                <DeliveryMessageDisplay message={selectedMessage.content} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
