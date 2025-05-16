'use client';

import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

import { useCheckout } from '@/components/contexts/CheckoutContext';

const OtpForm = () => {
  const [otp, setOtp] = useState('');
  const { nextStep, prevStep } = useCheckout();

  const verifyOtp = () => {
    if (otp.length === 4) {
      console.log(otp);
      nextStep();
    } else {
      alert('Please enter a valid OTP');
    }
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='mb-2 text-center text-lg font-semibold'>Enter OTP</h2>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        renderSeparator={<span className='mx-2'>-</span>}
        renderInput={(props) => (
          <input
            {...props}
            // className='h-12 w-12 rounded-md border border-gray-300 text-center transition focus:outline-none focus:ring-2 focus:ring-primary'
          />
        )}
        inputStyle={{
          width: '3rem', // Set the width explicitly for each input field
          height: '3rem', // Set the height
          textAlign: 'center',
          border: '1px solid #ccc',
          borderRadius: '0.5rem',
          fontSize: '1.25rem',
          outline: 'none',
        }}
        containerStyle='flex justify-center gap-3 mb-4'
      />
      <button className='btn btn-primary w-full' onClick={verifyOtp}>
        Verify OTP
      </button>
      <button className='btn btn-primary w-full' onClick={prevStep}>
        Back
      </button>
    </div>
  );
};

export default OtpForm;
