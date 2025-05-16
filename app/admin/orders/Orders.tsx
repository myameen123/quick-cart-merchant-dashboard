'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { Order } from '@/lib/models/OrderModel';

export default function Orders() {
  const { data: orders, error, isLoading } = useSWR(`/api/admin/orders`);

  if (error) return 'An error has occurred.';
  if (isLoading) return 'Loading...';
  // const formattedPrice = order.totalPrice.toLocaleString('en-PK', {
  //   style: 'currency',
  //   currency: 'PKR',
  // });
  return (
    <div>
      <h1 className='py-4 text-2xl'>Orders</h1>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => ( 
              <tr key={order._id}>
                <td>..{order.customer}</td>
                <td>{order.shippingAddress?.fullName || 'Deleted user'}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>
                  {order.totalPrice.toLocaleString('en-PK', {
                    style: 'currency',
                    currency: 'PKR',
                  })}
                </td>
                <td>
                  {order.isPaid && order.paidAt
                    ? `${order.paidAt.substring(0, 10)}`
                    : 'not paid'}
                </td>
                <td>
                  {order.isDelivered && order.deliveredAt
                    ? `${order.deliveredAt.substring(0, 10)}`
                    : 'not delivered'}
                </td>
                <td>
                  <Link href={`/order/${order._id}`} passHref>
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
