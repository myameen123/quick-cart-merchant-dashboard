/* eslint-disable import/order */
"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";


import "./order.css"
import { Button } from "@/components/ui/button";
import useCartService from "@/lib/hooks/useCartStore";

function OrderConfirmed() {
  const router = useRouter();
  const { clear } = useCartService();
  const continueShopping = ()=>{
    clear()
    router.push("/")
  } 
  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 ">
      <div className="bg-white  order-confirmed text-center w-full">
        <CheckCircle className="text-green-500  mx-auto mb-4"  size={35}/>
        <h1 className="text-2xl font-semibold text-gray-800">Thank You!</h1>
        <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
        <p className="text-gray-500 text-sm mt-1">We appreciate your trust in us.</p>
        
        <Button
          onClick={continueShopping}
          className="my-2"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default OrderConfirmed;
