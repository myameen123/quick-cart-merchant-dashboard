/* eslint-disable import/order */
import React, { useEffect, useState } from 'react';

import { useCheckout } from '@/components/contexts/CheckoutContext';
import { useCustomer } from '@/components/contexts/CustomerContext';
import AddressForm from './addressForm';
import StoredAddresses from './StoredAddresses';

const Address = () => {
  const { customer } = useCustomer();
  // const [hasStoredAddress, setHasStoredAddress] = useState(false);
  const { subSteps, goToMobile } = useCheckout();

  useEffect(() => {
    // If no customer exists, redirect to mobile verification
    if (!customer) {
      goToMobile();
      return;
    }
  }, [customer, goToMobile]);

  return (
    <div>
      {/* <AddressesList /> */}
      <AddressForm />
      {/* <UpdateAddress/> */}
    </div>
  );
};

export default Address;
