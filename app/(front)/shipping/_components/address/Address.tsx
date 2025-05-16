import React, { useState } from 'react';

import { useCheckout } from '@/components/contexts/CheckoutContext';

import AddressForm from './addressForm';
import StoredAddresses from './StoredAddresses';

const Address = () => {
  const [hasStoredAddress, setHasStoredAddress] = useState<boolean>(true);
  const { subSteps } = useCheckout();

  return (
    <div>
      {subSteps[1] === 0 ? (
        hasStoredAddress ? (
          <StoredAddresses />
        ) : (
          <AddressForm />
        )
      ) : (
        <AddressForm />
      )}
    </div>
  );
};

export default Address;
