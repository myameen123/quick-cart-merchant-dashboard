'use client';
import React, { useState } from 'react';

import { useCheckout } from '@/components/contexts/CheckoutContext';
import PhoneNumberInput from '@/components/inputs/PhoneNumberInput';

const PhoneForm = () => {
  const { nextSubStep, step, subSteps, prevStep } = useCheckout();
  const [mobile, setMobile] = useState(''); // State to hold mobile number
  const [isValid, setIsValid] = useState(false); // State to track validation

  // Submit function for handling mobile validation
  const submitMobile = () => {
    if (isValid) {
      nextSubStep(); // Proceed to the next step if the number is valid
    } else {
      alert('Please enter a valid phone number');
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Phone Number Input Component */}
      <PhoneNumberInput
        value={mobile}
        onChange={setMobile} // Update the mobile state
        onValidation={setIsValid} // Track validation status
        required
      />
      <button className='btn btn-primary w-full' onClick={submitMobile}>
        Get OTP
      </button>
      {(step > 0 || subSteps[0] > 0) && (
        <button className='btn' onClick={prevStep}>
          Back
        </button>
      )}
    </div>
  );
};

export default PhoneForm;
