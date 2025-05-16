/* eslint-disable import/order */
import AdminLayout from '@/components/admin/AdminLayout'
import React from 'react'
import Checkout from './Checkout'
import RiskCard from './_components/RiskCards'

function Page() {
  return (
    <AdminLayout activeItem='checkout'>
    <Checkout />
    <RiskCard/>
  </AdminLayout>
  )
}

export default Page