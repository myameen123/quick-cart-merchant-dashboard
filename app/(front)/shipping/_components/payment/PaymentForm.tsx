import React from 'react';

import { useCheckout } from '@/components/contexts/CheckoutContext';
import cashLogo from '@/public/images/cash.png';
import easypaisaLogo from '@/public/images/easypaisa.png';
import jazzcashLogo from '@/public/images/jasscash.png';
import masterLogo from '@/public/images/masterCard.png';
import visaLogo from '@/public/images/visa_icon.png';

import PaymentMethodCard from './paymentMethodCard';

const PaymentMethods = [
  {
    id: '1',
    type: 'Pay via UPI',
    price: 3750,
    isDiscount: true,
    discount: 15,
    isExtra: false,
    extraCharges: 0,
    methods: [
      {
        id: 'a',
        name: 'Easypaisa',
        icon: easypaisaLogo,
      },
      {
        id: 'b',
        name: 'Jazzcash',
        icon: jazzcashLogo,
      },
    ],
  },
  {
    id: '2',
    type: 'Cash On Delivery',
    price: 5200,
    isExtra: true,
    isDiscount: false,
    discount: 0,
    extraCharges: 200,
    methods: [
      {
        id: 'c',
        name: 'Additional fee charged for delivery',
        icon: cashLogo,
      },
    ],
  },
  {
    id: '3',
    type: 'Pay via card',
    price: 4999,
    isExtra: false,
    isDiscount: false,
    discount: 0,
    extraCharges: 0,
    methods: [
      {
        id: 'e',
        name: 'master card',
        icon: masterLogo,
      },
      {
        id: 'd',
        name: 'visa',
        icon: visaLogo,
      },
    ],
  },
];

const PaymentForm = () => {
  const { prevStep } = useCheckout();
  const placeOrder = () => {
    alert('Order Placed Successfully!');
  };

  return (
    <div className='flex flex-col gap-2'>
      <p>Payment Options</p>
      {PaymentMethods.map((p) => (
        <PaymentMethodCard
          key={p.id}
          type={p.type}
          price={p.price}
          methods={p.methods}
          isDiscount={p.isDiscount}
          isExtra={p.isExtra}
          discount={p.discount}
          extraCharges={p.extraCharges}
        />
      ))}

      <button className='btn btn-primary w-full' onClick={prevStep}>
        Back
      </button>
    </div>
  );
};

export default PaymentForm;
