/* eslint-disable import/order */
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import Link from 'next/link';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import useSWR from 'swr';
import OrderChart from "../checkout/_components/OrderChart"
import RiskSimulation from "../checkout/_components/RiskSimulation"
import CheckoutCRChart from "../checkout/_components/CheckoutCRChart"
import PaymentMethodDistribution from "../checkout/_components/PaymentMethodDistribution"
import { formatNumber } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const Dashboard = () => {
  // const { data: summary, error } = useSWR(`/api/admin/summary`);

  // console.log(summary);

  // if (error) return error.message;
  // if (!summary) return 'Loading...';

  return (
    <div>
      {/* <div className='stats stats-vertical my-4 inline-grid shadow md:stats-horizontal md:flex'>
        <div className='stat'>
          <div className='stat-title'>Sales</div>
          <div className='stat-value text-primary'>
            Rs {formatNumber(summary.ordersPrice)}
          </div>
          <div className='stat-desc'>
            <Link href='/admin/orders'>View sales</Link>
          </div>
        </div>
        <div className='stat'>
          <div className='stat-title'> Orders</div>
          <div className='stat-value text-primary'>{summary.ordersCount}</div>
          <div className='stat-desc'>
            <Link href='/admin/orders'>View orders</Link>
          </div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Products</div>
          <div className='stat-value text-primary'>{summary.productsCount}</div>
          <div className='stat-desc'>
            <Link href='/admin/products'>View products</Link>
          </div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Users</div>
          <div className='stat-value text-primary'>{summary.usersCount}</div>
          <div className='stat-desc'>
            <Link href='/admin/users'>View users</Link>
          </div>
        </div>
      </div> */}
      <div className=''>
        <OrderChart/>
       
      </div>
      <div className='my-7'>
        <PaymentMethodDistribution/>
      </div>
        <div>
          <CheckoutCRChart/>
        </div>
      <div>
        <RiskSimulation/>
      </div>
    </div>
  );
};

export default Dashboard;
