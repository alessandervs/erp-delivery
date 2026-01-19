'use client';

import { useState } from 'react';
import { Button, Input } from './ui';
import { deleteOrder, OrderData } from '@/app/actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Extend OrderData to include DB fields
type Order = any; // Avoid complex generic typing vs Prisma type matching for now, simplistic view

type Props = {
    orders: Order[];
};

export const OrderHistory = ({ orders }: Props) => {
    const [filter, setFilter] = useState('');

    const filteredOrders = orders.filter((o: any) => {
        const search = filter.toLowerCase();
        return (
            o.clientName.toLowerCase().includes(search) ||
            o.product.toLowerCase().includes(search) ||
            o.address.toLowerCase().includes(search)
        );
    });

    const handleDelete = async (id: number) => {
        if (confirm("Deseja eliminar este registo?")) {
            await deleteOrder(id);
        }
    };

    const copyMessage = (msg: string) => {
        navigator.clipboard.writeText(msg);
        // Could show toast
    };

    const exportExcel = () => {
        // Simple HTML table export trick as per original
        const table = document.getElementById('tabelaPedidos');
        if (!table) return;

        // Clone to remove action buttons? complex in React. 
        // We'll just generate CSV content manually for cleaner React approach
        const csvContent = [
            ["Data", "Cliente", "Canal", "Produto", "Endereço", "Pagamento", "Valor", "Entregador"],
            ...filteredOrders.map((o: any) => [
                format(new Date(o.createdAt), 'dd/MM/yyyy HH:mm'),
                o.clientName,
                o.channel,
                o.product,
                `"${o.address}"`, // Escape quotes
                o.paymentMethod,
                String(o.value).replace('.', ','),
                o.deliveryPerson
            ])
        ].map(e => e.join(";")).join("\n");

        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "relatorio_vendas.csv";
        link.click();
    };

    return (
        <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Histórico de Pedidos</h3>

            <div className="mb-4">
                <Input
                    placeholder="🔍 Pesquisar..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border-blue-400 rounded-full"
                />
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
                <Button onClick={exportExcel} className="flex-2 bg-green-800 hover:bg-green-900">📊 Exportar CSV</Button>
                {/* Backup JSON feature omitted or can be added */}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse" id="tabelaPedidos">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Data</th>
                            <th className="p-2 border">Cliente</th>
                            <th className="p-2 border">Canal</th>
                            <th className="p-2 border">Produto</th>
                            <th className="p-2 border">Endereço</th>
                            <th className="p-2 border">Pagamento</th>
                            <th className="p-2 border">Valor</th>
                            <th className="p-2 border">Entregador</th>
                            <th className="p-2 border">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50 text-center">
                                <td className="p-2 border">{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                                <td className="p-2 border">{order.clientName}</td>
                                <td className="p-2 border">{order.channel}</td>
                                <td className="p-2 border">{order.product}</td>
                                <td className="p-2 border max-w-[150px] truncate" title={order.address}>{order.address}</td>
                                <td className="p-2 border">{order.paymentMethod}</td>
                                <td className="p-2 border">R$ {order.value.toFixed(2).replace('.', ',')}</td>
                                <td className="p-2 border">{order.deliveryPerson}</td>
                                <td className="p-2 border flex gap-1 justify-center">
                                    <button
                                        onClick={() => copyMessage(order.message || '')}
                                        className="bg-yellow-400 text-black px-2 py-1 rounded font-bold text-xs hover:bg-yellow-500"
                                        title="Copiar Mensagem"
                                    >
                                        💬
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="bg-red-600 text-white px-2 py-1 rounded font-bold text-xs hover:bg-red-700"
                                        title="Excluir"
                                    >
                                        ✖
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && <p className="text-center p-4 text-gray-500">Nenhum pedido encontrado.</p>}
            </div>
        </div>
    );
};
