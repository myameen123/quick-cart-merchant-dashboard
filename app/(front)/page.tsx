/* eslint-disable import/order */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Quick Cart',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Empowering Ecommerce',
};

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/admin/dashboard')
  
}