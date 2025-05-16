/* eslint-disable import/order */
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCustomer } from '@/components/contexts/CustomerContext';
import { useCheckout } from '@/components/contexts/CheckoutContext';
import { Input, TextareaAutosize, TextField } from '@mui/material';
import toast from 'react-hot-toast';

type AddressFormValues = {
  postalCode: string;
  city: string;
  state: string;
  fullName: string;
  email: string;
  fullAddress: string;
  addressType: 'Work' | 'Home';
};

const AddressForm: React.FC = () => {
  const { customer, setCustomer } = useCustomer();
  const [isPostalCodeValid, setIsPostalCodeValid] = useState(false);
  const { nextStep, setIsLoading, goToSubStep } = useCheckout();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: {
      postalCode: '',
      city: '',
      state: '',
      fullName: '',
      email: '',
      fullAddress: '',
      addressType: 'Home',
    },
  });

  const postalCode = watch('postalCode');

  // Validate postal code and fetch city/state from the API
  useEffect(() => {
    if (postalCode.length === 5) {
      setIsLoading(true);
      fetch(`http://api.zippopotam.us/PK/${postalCode}`)
        .then((response) => {
          if (!response.ok) throw new Error('Invalid postal code');
          return response.json();
        })
        .then((data) => {
          const place = data.places[0];
          setValue('city', place['place name']);
          setValue('state', place['state']);
          // If customer already has an address, set email from the address array
          if (customer && customer.addresses && customer.addresses.length > 0) {
            const firstAddress = customer.addresses[0];
            if (firstAddress.email) {
              setValue('email', firstAddress.email);
            }
          }
          setIsPostalCodeValid(true);
        })
        .catch((e) => {
          console.log(e);
          setIsPostalCodeValid(false);
          alert('Could not fetch city/state for the given postal code.');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsPostalCodeValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalCode, setValue]);

  const onSubmit: SubmitHandler<AddressFormValues> = async (data) => {
    if (!customer || !customer.phoneNumber) {
      toast.error('Customer information is missing.');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare the updated addresses array
      const updatedAddresses = (customer.addresses || []).map((address) => ({
        ...address,
        isSelected: false, // Deselect all existing addresses
      }));

      // Add the new address with isSelected set to true
      const newAddress = { ...data, isSelected: true };
      updatedAddresses.push(newAddress);

      // Send updated addresses to the server
      const response = await fetch('/api/customer/save-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: customer.phoneNumber,
          addresses: updatedAddresses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save address.');
      }

      const updatedCustomer = await response.json();
      // Update the customer context
      setCustomer(updatedCustomer.data);

      toast.success('Address saved successfully!');
      setIsLoading(false);
      goToSubStep(1, 0); // Proceed to the next step if applicable
    } catch (error) {
      console.error('Error saving address:', error);
      setIsLoading(false);
      toast.error('Failed to save address. Please try again.');
    }
  };
  // const onSubmit: SubmitHandler<AddressFormValues> = async (data) => {
  //   if (!customer || !customer.phoneNumber) {
  //     toast.error('Customer information is missing.');
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);

  //     // Add the new address to the customer's address array
  //     const updatedAddresses = [...(customer.addresses || []), data];
  //     console.log('address', updatedAddresses);
  //     const response = await fetch('/api/customer/save-address', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         phoneNumber: customer.phoneNumber,
  //         addresses: updatedAddresses,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save address.');
  //     }

  //     const updatedCustomer = await response.json();
  //     console.log(updatedCustomer);
  //     // Update the customer context
  //     setCustomer(updatedCustomer.data);

  //     toast.success('Address saved successfully!');
  //     setIsLoading(false);
  //     goToSubStep(1, 0); // Proceed to the next step if applicable
  //   } catch (error) {
  //     console.error('Error saving address:', error);
  //     setIsLoading(false);
  //     toast.error('Failed to save address. Please try again.');
  //   }
  // };

  return (
    <div className=' mt-4'>
      <div className=' flex items-end justify-between px-2'>
        <p className='font-medium'>Add New Address</p>
        <p className=' text-xs'>* Mandadory Fields</p>
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
        {isPostalCodeValid && (
          <>
            <div className=' flex gap-2 '>
              <div className='mb-4'>
                <TextField
                  variant='outlined'
                  label='City'
                  required
                  id='city'
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className='mb-4'>
                <TextField
                  variant='outlined'
                  label='State'
                  required
                  disabled
                  type='text'
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
                type='text'
                id='fullName'
                fullWidth
                {...register('fullName', { required: 'Full name is required' })}
                // className='input input-bordered w-full max-w-sm bg-white'
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
                type='email'
                id='email'
                fullWidth
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.email.message}
                </p>
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
                className='textarea textarea-bordered w-full max-w-sm bg-white'
              />
              {errors.fullAddress && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.fullAddress.message}
                </p>
              )}
            </div>

            <div className='mb-4 '>
              <label className='mb-1 block font-medium'>Address Type</label>
              <div className='flex items-center gap-4 '>
                <label className='flex items-center gap-2 rounded-md border bg-white px-4 py-2'>
                  <input
                    type='radio'
                    value='Home'
                    {...register('addressType', { required: true })}
                  />
                  Home
                </label>
                <label className='flex items-center gap-2 rounded-md border bg-white  px-4 py-2'>
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

            <button type='submit' className={`btn btn-primary mt-4`}>
              Save Address
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddressForm;
