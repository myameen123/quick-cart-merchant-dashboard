import { Truck } from 'lucide-react';
import React from 'react';
import './cardStyling.css';

function DeliveryTime() {
  return (
    <div className=' timeColor flex gap-2 rounded-lg bg-white p-3'>
      <Truck />
      <p>Earliest Delivery by 22 Dec, 11 am</p>
    </div>
  );
}

export default DeliveryTime;
