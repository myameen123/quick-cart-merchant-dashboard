import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type PaymentMethod = {
  id: string;
  name: string;
  icon: any;
};

type PaymentMethodCardProps = {
  type: string;
  price: number;
  methods: PaymentMethod[];
  isExtra: boolean;
  isDiscount: boolean;
  discount: number;
  extraCharges: number;
  //   onSelect: (method: PaymentMethod) => void;
};

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  type,
  price,
  methods,
  isDiscount,
  isExtra,
  discount,
  extraCharges,
  //   onSelect,
}) => {
  const formattedPrice = price.toLocaleString('en-PK', {
    style: 'currency',
    currency: 'PKR',
  });
  return (
    <div className='card mb-4 cursor-pointer flex-row justify-between bg-white p-4 shadow-inner'>
      <div className='w-full'>
        <div className='flex items-center gap-3'>
          <span className='text-lg font-semibold'>{formattedPrice}</span>
          {isDiscount && !isExtra && (
            <p className=' max-w-fit rounded-full border border-green-800 bg-green-300 px-2 text-xs text-green-800'>
              Extra {discount}% Discount
            </p>
          )}
          {!isDiscount && isExtra && (
            <p className=' max-w-fit rounded-full border border-red-800 bg-red-200 px-2 text-xs text-red-800'>
              RS {extraCharges} COD fee added
            </p>
          )}
        </div>
        <div className='flex justify-between'>
          <div className=' flex flex-col gap-1'>
            <span className='font-bold'>{type}</span>
            <div className=' flex gap-1 text-xs'>
              {methods.map((m) => (
                <span key={m.id}>{m.name}</span>
              ))}
            </div>
          </div>
          <div className='flex items-center justify-center  gap-1'>
            {methods.map((m) => (
              <Image
                key={m.id}
                alt='icon'
                src={m.icon}
                width={30}
                height={30}
              />
            ))}
          </div>
        </div>
      </div>
      <div className=' flex items-center justify-center'>
        <ChevronRight />
      </div>
    </div>
  );
};

export default PaymentMethodCard;
