import { ArrowLeft, ChevronDown, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';

import CheckoutSteps from '../checkout/CheckoutSteps';

type CartType = {
  children: ReactNode;
  checkoutSteps: number;
};
const price = 5000;
const formattedPrice = price.toLocaleString('en-PK', {
  style: 'currency',
  currency: 'PKR',
});

function CartModal({ children, checkoutSteps }: CartType) {
  return (
    <div className='card mx-auto my-4 w-full bg-gray-50 shadow-lg sm:max-w-md'>
      <CheckoutSteps current={checkoutSteps} />
      <div className='card-body gap-6 p-4 sm:p-6'>
        <div className=' flex cursor-pointer justify-between rounded-lg bg-white p-3 shadow-inner'>
          <div className=' flex items-center gap-2'>
            <ShoppingCart size={20} />
            <span>Order summary</span>
            <ChevronDown size={20} />
          </div>
          <span>{formattedPrice}</span>
        </div>
        {children}
      </div>
      <div className=' m-2 flex justify-between text-xs text-gray-400'>
        <p>T&C | Privacy | 1d4a8fc3</p>
        <div className='flex items-center justify-center gap-1'>
          <p>Powered by</p>
          <Image
            src='/images/Quick-Checkout.svg'
            alt='QuickCart'
            width={70}
            height={70}
          />
        </div>
      </div>
    </div>
  );
}

export default CartModal;
