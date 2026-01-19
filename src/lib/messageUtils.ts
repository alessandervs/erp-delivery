
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
    valueFormatted: string; // Passed from UI for display fidelity
};

export function generateDeliveryMessage(data: OrderData): string {
    const linkWaze = "https://waze.com/ul?q=" + encodeURIComponent(data.address);

    let msg = `ORDEM DE ENTREGA\n🛵 Entregador: ${data.deliveryPerson || 'Não informado'}\n-------------------------------\n👤 Cliente: ${data.clientName}\n🛒 Canal: ${data.channel}\n📞 Tel: ${data.phone}\n🚚 Endereço: ${data.address}\n📦 Produto: ${data.product}\n`;
    if (data.info) msg += `📝 Info: ${data.info}\n`;
    msg += `💳 Pagamento: ${data.paymentMethod}\n💵 Valor: R$ ${data.valueFormatted}\n-------------------------------\n📍 Waze: ${linkWaze}`;

    return msg;
}

export function generateClientMessage(data: OrderData): string {
    return `Olá, ${data.clientName}! 👋\n\nSeu pedido via ${data.channel} está a caminho!\n\n🛵 Entregador: ${data.deliveryPerson || 'Não informado'}\n👤 Cliente: ${data.clientName}\n📞 Tel: ${data.phone}\n🚚 Endereço: ${data.address}\n📦 Produto: ${data.product}\n💳 Pagamento: ${data.paymentMethod}\n💵 Valor: R$ ${data.valueFormatted}\n\nContato da revenda: 31-98255 7807\n-------------------------------\n\nO tempo da entrega aproximado de 30 minutos, podendo chegar antes.\n\nCanoas gás agradece sua confiança e preferência.`;
}
