import React from 'react';

import styles from './style.module.css';

function AmmountSummary({itemsPrice}) {
  const discount = 0;
  const subtotal = itemsPrice-discount
  const totalPrice = subtotal 
  const calculatFormattedPrice = (price) => {
    const formattedPrice = price.toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
    });

    return formattedPrice;
  };
  return (
    <div>
      <div className=' flex justify-between border-b text-base'>
        <div className='flex flex-col p-2'>
          <span>MRP Total</span>
          <span>Discount</span>
          <span>Subtotal</span>
          <span>Shipping</span>
        </div>
        <div className={`flex flex-col ${styles['item-end']}`}>
          <span>{calculatFormattedPrice(itemsPrice)}</span>
          <span>{calculatFormattedPrice(discount)}</span>
          <span>{calculatFormattedPrice(subtotal)}</span>
          <span>To be calculated</span>
        </div>
      </div>
      <div className='mt-3 flex justify-between p-3 font-bold border-y'>
        <span>To Pay</span>
        <span>{calculatFormattedPrice(totalPrice)}</span>
      </div>
    </div>
  );
}

export default AmmountSummary;
