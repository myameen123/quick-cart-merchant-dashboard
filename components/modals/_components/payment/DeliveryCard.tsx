/* eslint-disable import/order */

import React from 'react';
import { useCustomer } from '@/components/contexts/CustomerContext';
import { useCheckout } from '@/components/contexts/CheckoutContext';
import toast from 'react-hot-toast';

type DeliveryCardProps = {
  fullName: string;
  email: string;
  id: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void; // Add an onEdit function prop
};

function DeliveryCard({
  fullName,
  id,
  email,
  address,
  postalCode,
  city,
  state,
  onEdit,
}: DeliveryCardProps) {
  const { setIsLoading, goToSubStep } = useCheckout();
  const onNew = () => {
    goToSubStep(1, 1);
  };
  return (
    <div className='card flex w-full cursor-pointer flex-row items-start border-[1px] border-gray-300 bg-white p-4 text-sm shadow-inner'>
      <div className='w-full'>
        <div className=' mb-4 flex justify-between'>
          <p className=' text-lg'>
            <strong>Deliver To</strong>
          </p>
          <div className='flex gap-2'>
            <button
              className='rounded-full bg-slate-200 px-4 py-[2px] text-sm text-blue-900'
              onClick={onEdit}
              title='Edit Address'
            >
              Edit
            </button>
            <button
              className='rounded-full bg-slate-200 px-4 py-[2px] text-sm text-blue-900'
              onClick={onNew}
              title='Add New Address'
            >
              New
            </button>
          </div>
        </div>
        <p className='mb-2'>
          <strong>{fullName}</strong>
        </p>
        <p className='mb-4'>
          {address}, {city}, {state}, {postalCode}
        </p>
        <p className='rounded-full bg-slate-200 px-4 py-[2px] text-sm text-blue-900 w-fit'>{email}</p>
      </div>
    </div>
  );
}

export default DeliveryCard;
