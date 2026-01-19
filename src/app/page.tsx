import { getOrders } from './actions';
import { OrderManager } from '@/components/OrderManager';

export const dynamic = 'force-dynamic'; // Ensure orders are fetched fresh on each render if revalidated

export default async function Home() {
  const orders = await getOrders();

  return (
    <main className="min-h-screen bg-gray-100">
      <OrderManager initialOrders={orders} />
    </main>
  );
}
