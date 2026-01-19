'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type OrderData = {
    clientName: string;
    phone: string;
    channel: string;
    product: string;
    address: string;
    info?: string;
    deliveryPerson?: string;
    paymentMethod: string;
    value: number;
    message?: string; // Input only
    deliveryMsg?: string; // Input only
};

export async function createOrder(data: OrderData) {
    try {
        let client = await prisma.client.findUnique({
            where: { name: data.clientName }
        });

        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: data.clientName,
                    phone: data.phone,
                    address: data.address,
                }
            });
        } else {
            await prisma.client.update({
                where: { id: client.id },
                data: {
                    phone: data.phone,
                    address: data.address,
                }
            });
        }

        // Create Order without message fields
        const order = await prisma.order.create({
            data: {
                channel: data.channel,
                product: data.product,
                info: data.info,
                deliveryPerson: data.deliveryPerson || 'Não informado',
                paymentMethod: data.paymentMethod,
                value: data.value,
                snapshotName: data.clientName,
                snapshotPhone: data.phone,
                snapshotAddress: data.address,
                client: {
                    connect: { id: client.id }
                }
            },
        });

        // Create Messages if provided
        if (data.message) {
            await prisma.clientMessage.create({
                data: {
                    content: data.message,
                    orderId: order.id
                }
            });
        }

        if (data.deliveryMsg) {
            await prisma.deliveryMessage.create({
                data: {
                    content: data.deliveryMsg,
                    orderId: order.id
                }
            });
        }

        revalidatePath('/');
        return { success: true, order };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

export async function getOrders(query?: string) {
    try {
        const orders = await prisma.order.findMany({
            where: query
                ? {
                    OR: [
                        { snapshotName: { contains: query } },
                        { snapshotAddress: { contains: query } },
                        { client: { name: { contains: query } } }
                    ],
                }
                : undefined,
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
            include: {
                client: true,
                clientMessages: true,
                deliveryMessages: true
            }
        });

        return orders.map(o => ({
            ...o,
            clientName: o.snapshotName,
            address: o.snapshotAddress,
            // Flatten messages for easier UI consumption if needed, or pass as is
            // UI expects 'message' and 'deliveryMsg' string for display? 
            // The OrderHistory usually showed just order details.
            // But we'll pass arrays.
        }));
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

export async function deleteOrder(id: number) {
    try {
        await prisma.order.delete({
            where: { id },
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting order:', error);
        return { success: false, error: 'Failed to delete order' };
    }
}

export async function getEarlierClientData(name: string) {
    try {
        const client = await prisma.client.findUnique({
            where: { name }
        });
        if (client) {
            return {
                clientName: client.name,
                phone: client.phone,
                address: client.address
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function searchClients(term: string) {
    try {
        if (!term || term.length < 2) return [];

        const clients = await prisma.client.findMany({
            where: {
                name: { contains: term }
            },
            orderBy: { name: 'asc' },
            take: 20
        });

        return clients.map(c => ({
            clientName: c.name,
            phone: c.phone,
            address: c.address,
            id: c.id
        }));
    } catch (error) {
        console.error('Error searching clients:', error);
        return [];
    }
}

export async function updateClient(oldName: string, data: { name: string, phone: string, address: string }) {
    try {
        const client = await prisma.client.findUnique({ where: { name: oldName } });
        if (!client) return { success: false, error: "Client not found" };

        await prisma.client.update({
            where: { id: client.id },
            data: {
                name: data.name,
                phone: data.phone,
                address: data.address
            }
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error updating client:", error);
        return { success: false, error: "Failed to update client" };
    }
}
