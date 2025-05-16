/* eslint-disable import/order */
'use client';
// QuickCartModal.tsx

import React, { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ModalLayout from './ModalLayout/modal-layout';
import { CheckoutProvider, useCheckout } from '../contexts/CheckoutContext';
import {
  CustomerProvider,
  useCustomer,
} from '@/components/contexts/CustomerContext';
import PhoneForm from './_components/mobile/PhoneForm';
import OtpForm from './_components/mobile/OtpForm';
import AddressesList from './_components/address/AddressesList';
// import AddressForm from './_components/address/AddressForm';
import UpdateAddress from './_components/address/UpdateAddress';
import PaymentList from './_components/payment/PaymentList';
import AddCard from './_components/payment/AddCard';
import ConfirmOrder from './_components/payment/ConfirmOrder';
import OrderConfirmed from './_components/order/OrderConfirmed';
import AddressForm from './_components/address/addressForm';
import DebitCardForm from './_components/payment/DebitCardForm';
import CardList from "./_components/payment/CardList"


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
function QuickCartModal({ onClose, open }) {
  return (
    <CheckoutProvider>
      <CustomerProvider>
        <QuickCartContent onClose={onClose} open={open} />
      </CustomerProvider>
    </CheckoutProvider>
  );
}

const QuickCartContent = ({ onClose, open }) => {
  const { step, subSteps, goToStep } = useCheckout();
  const { customer } = useCustomer();
  useEffect(() => {
    if (!customer && step > 0) {
      goToStep(0);
    }
  }, [customer, step, goToStep]);

  const renderSubStepComponent = () => {
    if (!customer && step > 0) {
      return null;
    }
    switch (step) {
      case 0:
        return subSteps[0] === 0 ? <PhoneForm /> : <OtpForm />;
      case 1:
        switch (subSteps[1]) {
          case 0:
            return <AddressesList />;
          case 1:
            return <AddressForm />;
          case 2:
            return <UpdateAddress />;
          default:
            return null;
        }
      case 2:
        switch (subSteps[2]) {
          case 0:
            return <PaymentList />;
          case 1:
            return <AddCard />;
          case 2:
            return <DebitCardForm />;
          case 3:
            return <ConfirmOrder />;
          case 4:
            return <CardList />;
          default:
            return null;
        }
      case 3:
        return <OrderConfirmed />;
      default:
        return null;
    }
  };

  return (
    <ModalLayout onClose={onClose} open={open} activeStep={step}>
       <Elements stripe={stripePromise}>
      {renderSubStepComponent()}
       </Elements>
    </ModalLayout>
  );
};

export default QuickCartModal;
