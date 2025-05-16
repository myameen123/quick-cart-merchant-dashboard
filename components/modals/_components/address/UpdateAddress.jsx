/* eslint-disable import/order */
'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCustomer } from '@/components/contexts/CustomerContext';
import { useCheckout } from '@/components/contexts/CheckoutContext';
import { TextField } from '@mui/material';
import toast from 'react-hot-toast';

const UpdateAddress = () => {
  const { customer, setCustomer } = useCustomer();
  const { setIsLoading, goToSubStep, addressIdToEdit, setAddressIdToEdit } =
    useCheckout();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (customer && customer.addresses && customer.addresses.length <= 0) {
      goToSubStep(1, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  useEffect(() => {
    const addressToEdit = customer?.addresses?.find(
      (addr) => addr._id === addressIdToEdit,
    );
    if (addressToEdit) {
      setValue('postalCode', addressToEdit.postalCode);
      setValue('city', addressToEdit.city);
      setValue('state', addressToEdit.state);
      setValue('fullName', addressToEdit.fullName);
      setValue('email', addressToEdit.email);
      setValue('fullAddress', addressToEdit.fullAddress);
      setValue('addressType', addressToEdit.addressType);
    } else {
      goToSubStep(1, 0);
    }
  }, [addressIdToEdit, customer?.addresses, setValue]);

  const onSubmit = async (data) => {
    if (!customer || !customer.phoneNumber) {
      toast.error('Customer information is missing.');
      return;
    }

    try {
      setIsLoading(true);

      const updatedAddress = {
        postalCode: data.postalCode,
        city: data.city,
        state: data.state,
        fullName: data.fullName,
        email: data.email,
        fullAddress: data.fullAddress,
        addressType: data.addressType,
      };

      const response = await fetch('/api/customer/save-address', {
        method: 'PUT', // Use PUT to update the specific address
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: customer.phoneNumber,
          addressId: addressIdToEdit,
          updatedAddress, // Send the updated address here
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update address.');
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer.data);
      setAddressIdToEdit('');
      toast.success('Address updated successfully!');
      setIsLoading(false);
      goToSubStep(1, 0);
    } catch (error) {
      console.error('Error updating address:', error);
      setIsLoading(false);
      toast.error('Failed to update address. Please try again.');
    }
  };

  return (
    <div className='mt-4'>
      <div className='flex items-end justify-between px-2'>
        <p className='font-medium'>Update Address</p>
        <p className='text-xs'>* Mandatory Fields</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
        {/* Postal Code Field */}
        <div className='mb-4'>
          <TextField
            label='PostalCode'
            variant='outlined'
            required
            fullWidth
            id='postalCode'
            {...register('postalCode', {
              required: 'Postal code is required',
              pattern: {
                value: /^[0-9]{5}$/,
                message: 'Postal code must be 5 digits',
              },
            })}
          />
          {errors.postalCode && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.postalCode.message}
            </p>
          )}
        </div>

        {/* Other Fields */}
        <div className='flex gap-2'>
          <div className='mb-4'>
            <TextField
              variant='outlined'
              label='City'
              required
              id='city'
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && (
              <p className='mt-1 text-sm text-red-500'>{errors.city.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <TextField
              variant='outlined'
              label='State'
              required
              disabled
              id='state'
              {...register('state', { required: 'State is required' })}
            />
            {errors.state && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        <div className='mb-4'>
          <TextField
            variant='outlined'
            label='Full Name'
            required
            id='fullName'
            fullWidth
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className='mb-4'>
          <TextField
            variant='outlined'
            label='Email Address'
            required
            id='email'
            fullWidth
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <p className='mt-1 text-sm text-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <TextField
            placeholder='Full Address (House no, Area etc)'
            required
            id='fullAddress'
            {...register('fullAddress', {
              required: 'Full address is required',
            })}
            fullWidth
          />
          {errors.fullAddress && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.fullAddress.message}
            </p>
          )}
        </div>

        <div className='mb-4'>
          <label className='mb-1 block font-medium'>Address Type</label>
          <div className='flex items-center gap-4'>
            <label className='flex items-center gap-2 rounded-md border bg-white px-4 py-2'>
              <input
                type='radio'
                value='Home'
                {...register('addressType', { required: true })}
              />
              Home
            </label>
            <label className='flex items-center gap-2 rounded-md border bg-white px-4 py-2'>
              <input
                type='radio'
                value='Work'
                {...register('addressType', { required: true })}
              />
              Work
            </label>
          </div>
          {errors.addressType && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.addressType.message}
            </p>
          )}
        </div>

        <button type='submit' className='btn btn-primary mt-4'>
          Update Address
        </button>
      </form>
    </div>
  );
};

export default UpdateAddress;
