/* eslint-disable import/order */
'use client';
import React, { useEffect } from 'react';
import { useCustomer } from '@/components/contexts/CustomerContext';
import { useCheckout } from '@/components/contexts/CheckoutContext';
import AddressCard from './AddressCard';
import toast from 'react-hot-toast';
function AddressesList() {
  const { customer, setCustomer } = useCustomer();
  const {
    goToSubStep,
    setAddressIdToEdit,
    goToStep,
    setIsLoading,
    setButtonDisabled,
    setOnContinue,
  } = useCheckout();

  useEffect(() => {
    setOnContinue(() => proccedToPayment); // Set an empty onContinue function
    setIsLoading(false);
    setButtonDisabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
  }, []); // Empty dependency array

  useEffect(() => {
    if (customer.addresses && customer.addresses.length <= 0) {
      goToSubStep(1, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const handleEditAddress = (addressId) => {
    setAddressIdToEdit(addressId);
    goToSubStep(1, 2);
  };

  const handleAddressSelect = async (id) => {
    if (!customer || !customer.phoneNumber) {
      toast.error('Customer information is missing.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/customer/save-address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: customer.phoneNumber,
          addressId: id,
          updatedAddress: { isSelected: true }, // Set selected address
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to select address.');
      }

      const updatedCustomer = await response.json();

      // Update customer data in the context
      setCustomer(updatedCustomer.data);

      toast.success('Address selected successfully!');
    } catch (error) {
      console.error('Error selecting address:', error);
      toast.error('Failed to select address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const proccedToPayment = () => {
    goToStep(2);
  };
  const onAddAddress = () => {
    goToSubStep(1, 1);
  };
  const onEdit = () => {
    goToStep(0);
  };
  console.log("customer....",customer)
  return (
    <div className=' mt-4 flex flex-col gap-2'>
      <div className='my-4 flex items-center gap-2'>
        <p>Hey! Welcome back +92{customer.phoneNumber}</p>
        <button
          onClick={onEdit}
          className='rounded-full bg-slate-200 px-4 py-[2px] text-sm text-blue-900'
        >
          Edit
        </button>
      </div>
      <div className=' flex items-end justify-between px-2'>
        <p className='font-medium'>Shipping Address</p>
        <button onClick={onAddAddress} className='text-sm font-bold '>
          + Add addresss
        </button>
      </div>

      {customer.addresses.map((ad) => (
        <AddressCard
          key={ad._id}
          id={ad._id}
          fullName={ad.fullName}
          address={ad.fullAddress}
          email={ad.email}
          postalCode={ad.postalCode}
          city={ad.city}
          state={ad.state}
          isSelected={ad.isSelected}
          onSelect={() => handleAddressSelect(ad._id)}
          onEdit={() => handleEditAddress(ad._id)}
        />
      ))}
    </div>
  );
}

export default AddressesList;
