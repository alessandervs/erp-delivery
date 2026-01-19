'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select, TextArea, Label } from './ui';
import { generateClientMessage, generateDeliveryMessage } from '@/lib/messageUtils';
import { createOrder, getEarlierClientData, updateClient } from '@/app/actions';
import { ClientSearchModal } from './ClientSearchModal';
import { ClientEditModal } from './ClientEditModal';
import { Search, Pencil } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type OrderFormValues = {
    clientName: string;
    phone: string;
    channel: string;
    product: string;
    address: string;
    info: string;
    deliveryPerson: string;
    paymentMethod: string;
    value: string; // Keep as string for masking, convert on submit
};

type Props = {
    onOrderGenerated: (data: any, clientMsg: string, deliveryMsg: string) => void;
};

const CANAL_OPTIONS = [
    "DISK ENTREGA", "APP GAS", "PRECO DO GAS", "PORTARIA",
    "GAS DO POVO PORTARIA", "DISK GOOGLE - HENRIQUE", "TAXA DISK GAS POVO"
];

const PRODUTO_OPTIONS = [
    "Gás 13kls", "Água Mineral", "Botijão 45kls",
    "Botijão 13kls completo", "Água Mineral completa"
];

const PAGAMENTO_OPTIONS = [
    "Dinheiro", "Pix", "Débito", "Crédito", "ON LINE"
];

export const OrderForm = ({ onOrderGenerated }: Props) => {
    const { register, handleSubmit, setValue, watch, control, reset } = useForm<OrderFormValues>({
        defaultValues: {
            clientName: '',
            phone: '',
            channel: 'DISK ENTREGA',
            product: 'Gás 13kls',
            address: '',
            info: '',
            deliveryPerson: '',
            paymentMethod: 'Dinheiro',
            value: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleClientSelect = (client: any) => {
        setValue('clientName', client.clientName);
        setValue('phone', client.phone || '');
        setValue('address', client.address || '');
        setValue('product', client.product || 'Gás 13kls');
        // setValue('channel', client.channel); // Optional
    };

    const handleEditSave = async (data: any) => {
        setLoading(true);
        const oldName = watch('clientName');

        // Update form values immediately (ClientEditModal acts as a detailed editor)
        setValue('clientName', data.clientName);
        setValue('phone', data.phone);
        setValue('address', data.address);

        // Attempt to update DB if client exists
        // If client doesn't exist (new order flow), this will fail but that's expected/ignored
        // The client will be created when the order is finalized.
        if (oldName && oldName.length > 2) {
            const result = await updateClient(oldName, {
                name: data.clientName,
                phone: data.phone,
                address: data.address
            });

            if (!result.success && result.error !== "Client not found") {
                console.error("Failed to sync client update to DB:", result.error);
            }
        }
        setLoading(false);
    };

    // Masks
    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        if (v.length > 9) v = `${v.slice(0, 9)}-${v.slice(9)}`; // (XX) XXXXX-XXXX
        setValue('phone', v);
    };

    const handleCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, "");
        v = (Number(v) / 100).toFixed(2).replace('.', ',');
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        setValue('value', v);
    };

    // Auto-complete
    const handleClientBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (name.length < 3) return;

        const previous = await getEarlierClientData(name);
        if (previous) {
            setValue('phone', previous.phone || '');
            setValue('address', previous.address || '');
            //setValue('product', previous.product || 'Gás 13kls');
            // setValue('value', String(previous.value).replace('.', ',')); // Optional: restore last price?
            // Don't restore delivery person as per original requirement
        }
    };

    const onSubmit = async (data: OrderFormValues) => {
        setLoading(true);
        const numericValue = parseFloat(data.value.replace(/\./g, '').replace(',', '.'));

        if (!data.clientName || !data.address || isNaN(numericValue)) {
            alert("Preencha Nome, Endereço e Valor corretamente.");
            setLoading(false);
            return;
        }

        const linkWaze = "https://waze.com/ul?q=" + encodeURIComponent(data.address);

        const orderData = {
            ...data,
            valueFormatted: data.value, // Pass string formatted value to generator
            value: numericValue
        };

        const deliveryMsg = generateDeliveryMessage(orderData);
        const clientMsg = generateClientMessage(orderData);

        const result = await createOrder({
            ...data,
            value: numericValue,
            message: clientMsg,
            deliveryMsg: deliveryMsg,
            phone: data.phone || 'Não informado'
        });

        if (result.success) {
            onOrderGenerated(result.order, clientMsg, deliveryMsg);

        } else {
            alert("Erro ao salvar pedido!");
        }
        setLoading(false);

    };

    const handleClear = () => {
        reset();
        onOrderGenerated(null, '', '');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                    <Image
                        src="/logo.jpeg"
                        alt="Logo Canoas Gás"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-red-600 text-center">
                    Gerador de Pedidos
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>👤 Nome do Cliente:</Label>
                    <div className="relative">
                        <Input {...register('clientName')} onBlur={handleClientBlur} placeholder="Digite o nome..." list="listaClientes" autoComplete="off" />
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Pesquisar Cliente"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div>
                    <Label>📞 Telefone:</Label>
                    <Input {...register('phone')} onChange={handlePhone} placeholder="(00) 00000-0000" maxLength={15} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>🛒 Canal de Venda:</Label>
                    <Select {...register('channel')}>
                        {CANAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                </div>
                <div>
                    <Label>📦 Produto:</Label>
                    <Select {...register('product')}>
                        {PRODUTO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>🚚 Endereço de Entrega:</Label>
                    <TextArea {...register('address')} placeholder="Rua, número, bairro" />
                </div>
                <div>
                    <Label>📝 Informações (Apenas Entregador):</Label>
                    <TextArea {...register('info')} placeholder="Troco, ponto de referência..." />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label>🛵 Entregador:</Label>
                    <Input {...register('deliveryPerson')} placeholder="Ex: João" />
                </div>
                <div>
                    <Label>💳 Pagamento:</Label>
                    <Select {...register('paymentMethod')}>
                        {PAGAMENTO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                </div>
                <div>
                    <Label>💵 Valor (R$):</Label>
                    <Input {...register('value')} onChange={handleCurrency} placeholder="0,00" />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? 'Gerando...' : 'Gerar e Salvar'}
                </Button>
                <Button type="button" onClick={() => setIsEditOpen(true)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black flex items-center justify-center gap-2">
                    <Pencil className="w-4 h-4" /> Editar
                </Button>
                <Button type="button" variant="secondary" onClick={handleClear} className="flex-1">
                    Limpar Campos
                </Button>
            </div>

            <ClientSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectClient={handleClientSelect}
            />

            <ClientEditModal
                isOpen={isEditOpen}
                initialData={{
                    clientName: watch('clientName'),
                    phone: watch('phone'),
                    address: watch('address')
                }}
                onClose={() => setIsEditOpen(false)}
                onSave={handleEditSave}
            />
        </form>
    );
};
