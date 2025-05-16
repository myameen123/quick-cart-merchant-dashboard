import React from 'react';

function ConfirmOrder() {
  return <div className='confirm-card bg-white rounded-md'>
    <div className=' p-4 flex flex-col items-center gap-3'>
    <p className=' text-lg text-blue-950 font-semibold'>Comfirm your Order</p>
    <p className='text-xs'>Your COD order will place, are you sure?</p>
    <button  className='btn bg-black confirm-btn w-full'>Confirm</button>
    <button className='btn bg-white text-black w-full hover:bg-white'>Save Rs 200 with Card payment</button>
    </div>
  </div>;
}

export default ConfirmOrder;
