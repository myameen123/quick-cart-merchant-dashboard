/* eslint-disable import/order */
import React from 'react';

import AmmountSummary from './AmmountSummary';
import ProductInfo from './ProductInfo';
import useCartService from '@/lib/hooks/useCartStore';

function OrderSummary() {
  const {items, itemsPrice} = useCartService()
  return (
    <div>
      {items.map((it)=><ProductInfo
       key={it._id}
       name = {it.name}
       description = {it.description}
       qty = {it.qty}
       price = {it.price}
       color = {it.color}
       image = {it.image}
       />)}
      
      <AmmountSummary itemsPrice = {itemsPrice} />
    </div>
  );
}

export default OrderSummary;
