/* eslint-disable import/order */

import React from 'react';
import { useCustomer } from '@/components/contexts/CustomerContext';
import { useCheckout } from '@/components/contexts/CheckoutContext';
import toast from 'react-hot-toast';

type AddressCardProps = {
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

function AddressCard({
  fullName,
  id,
  email,
  address,
  postalCode,
  isSelected,
  onSelect,
  city,
  state,
  onEdit,
}: AddressCardProps) {
  const { customer, setCustomer } = useCustomer();
  const { setIsLoading } = useCheckout();

  const onDelete = async () => {
    if (!customer || !customer.phoneNumber) {
      toast.error('Customer information is missing.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/customer/save-address', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: customer.phoneNumber,
          addressId: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete address.');
      }

      const updatedCustomer = await response.json();
      // Update the customer context
      setCustomer(updatedCustomer.data);

      toast.success('Address deleted successfully!');
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting address:', error);
      setIsLoading(false);
      toast.error('Failed to delete address. Please try again.');
    }
  };
  return (
    <label className='card relative flex w-full cursor-pointer flex-row items-start border-2 border-black bg-white p-4 text-sm shadow-inner'>
      <input
        className='mr-3 mt-1'
        type='radio'
        name='address'
        checked={isSelected}
        onChange={onSelect}
      />
      <div className='w-full'>
        <div className=' mb-4 flex justify-between'>
          <p className=' '>
            <strong>{fullName}</strong>
          </p>
          <div className='flex gap-2 underline'>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        </div>

        <p className='mb-4'>
          {address}, {city}, {state}, {postalCode}
        </p>
        <p className='text-xs text-gray-600'>{email}</p>
      </div>

      {/* Edit button */}
      {/* <button
        className='absolute bottom-2 right-2 text-blue-500 underline'
        onClick={onEdit}
        title='Edit'
        type='button'
      >
        <SquarePen size={15} />
      </button> */}
    </label>
  );
}

export default AddressCard;
