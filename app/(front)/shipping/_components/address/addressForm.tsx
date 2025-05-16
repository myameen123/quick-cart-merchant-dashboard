import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useCheckout } from '@/components/contexts/CheckoutContext';

type AddressFormProps = {
  initialValues?: {
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  // onSubmit: (values: {
  //   fullName: string;
  //   address: string;
  //   city: string;
  //   postalCode: string;
  //   country: string;
  // }) => void;
  onCancel?: () => void;
};

const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  // onSubmit,
  onCancel,
}) => {
  const { nextStep, prevStep } = useCheckout();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('fullName', initialValues.fullName || '');
      setValue('address', initialValues.address || '');
      setValue('email', initialValues.email || 'hii');
      setValue('city', initialValues.city || '');
      setValue('postalCode', initialValues.postalCode || '');
      setValue('country', initialValues.country || '');
    }
  }, [initialValues, setValue]);

  const formSubmit: SubmitHandler<{
    fullName: string;
    address: string;
    email: string;
    city: string;
    postalCode: string;
    country: string;
  }> = async (data) => {
    // onSubmit(data);
  };

  type FormFields =
    | 'fullName'
    | 'address'
    | 'city'
    | 'postalCode'
    | 'country'
    | 'email';

  const FormInput = ({
    id,
    name,
    required,
  }: {
    id: FormFields;
    name: string;
    required?: boolean;
  }) => (
    <div className='mb-2'>
      <label className='label' htmlFor={id}>
        {name}
      </label>
      <input
        type='text'
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
        })}
        className='input input-bordered w-full max-w-sm'
      />
      {/* {errors[id]?.message && (
        <div className='text-error'>{errors[id]?.message}</div>
      )} */}
    </div>
  );

  return (
    <div className='card  mx-auto my-4 w-full bg-base-300'>
      <div className='card-body'>
        <h1 className='card-title'>Shipping Address</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name='Full Name' id='fullName' required />
          <FormInput name='email' id='email' required />
          <FormInput name='Address' id='address' required />
          <FormInput name='City' id='city' required />
          <FormInput name='Postal Code' id='postalCode' required />
          <FormInput name='Country' id='country' required />
          <div className='my-2'>
            <button
              type='submit'
              disabled={isSubmitting}
              onClick={nextStep}
              className='btn btn-primary w-full'
            >
              {isSubmitting && <span className='loading loading-spinner' />}
              Submit
            </button>
            {onCancel && (
              <button
                type='button'
                onClick={onCancel}
                className='btn btn-primary mt-2 w-full'
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
