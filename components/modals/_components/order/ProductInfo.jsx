import Image from 'next/image';
import React from 'react';

function ProductInfo(
{  name,
  description,
  qty,
  price,
  color,
  image}
) {
  // const price = 4999;
  const formattedPrice = price.toLocaleString('en-PK', {
    style: 'currency',
    currency: 'PKR',
  });
  return (
    <div className=' my-4 flex items-center gap-2 border-b p-2'>
      <div>
        <Image src={image} alt='shirt' width={150} height={150} />
      </div>
      <div className=' flex-col gap-1 text-sm '>
        <div className=' flex gap-2'>
          <p>
            {name} | {description} - {color}
          </p>
        </div>
        <div className=' flex gap-1'>
          <span>Price:</span>
          <span className='line-through'>{formattedPrice}</span>
          {/* <span>discount</span>s */}
        </div>
        <div>
          <span>Quantity: {qty}</span>
          {/* <span></span> */}
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
