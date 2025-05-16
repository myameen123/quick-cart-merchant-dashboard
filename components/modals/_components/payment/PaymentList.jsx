/* eslint-disable import/order */
'use client';
import React, { useEffect, useState } from 'react';
import { useCheckout } from '@/components/contexts/CheckoutContext';
import { useCustomer } from '@/components/contexts/CustomerContext';
import useCartService from '@/lib/hooks/useCartStore';
import DeliveryCard from './DeliveryCard';
import { Loader } from "lucide-react";
import PaymentMethod from './PaymentMethod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from 'react-hot-toast';
// import PaymentMethodCard from './PaymentMethod';
function PaymentList() {
  const {
    setButtonDisabled,
    setOnContinue,
    goToStep,
    goToSubStep,
    setIsLoading,
    setAddressIdToEdit,
  } = useCheckout();
  const { customer } = useCustomer();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls alert dialog
  const [isRequesting, setIsRequesting] = useState(false); // Controls alert dialog
  const { items, itemsPrice} = useCartService();

  const PaymentMethods = [
    {
      id: '1',
      type: 'Dabit/Credit Cards',
      price: itemsPrice - itemsPrice*0.15,
      isExtra: false,
      isDiscount: true,
      message:"Extra 15% discount + cashback",
      discount: 15,
      extraCharges: 0,
  
      methods: [
        {
          id: 'e',
          name: 'Mastercard',
        },
        {
          id: 'd',
          name: 'visa',
        },
      ],
    },
    {
      id: '2',
      type: 'Wallets',
      price: itemsPrice,
      message:"Get cashback",
      isDiscount: true,
      discount: 15,
      isExtra: false,
      extraCharges: 0,
  
      methods: [
        {
          id: 'a',
          name: 'Easypaisa',
        },
        {
          id: 'b',
          name: 'Jazzcash',
        },
      ],
    },
    {
      id: '3',
      type: customer.status ==="medium"?'Partial Payment (COD)':'Cash On Delivery',
      price: customer.status ==="medium"?Math.ceil(itemsPrice*customer.prediction):itemsPrice+200,
      isExtra: true,
      message:"Rs 200 COD fee added",
      isDiscount: false,
      discount: 0,
      extraCharges: 200,
  
      methods: [
        {
          id: 'c',
          name: customer.status ==="medium"?`Pay ${Math.round(customer.prediction*100)}% charges now. Rest on delivery`:"Additional fee charged for delivery",
        },
      ],
    },
  ];

  useEffect(() => {
    setButtonDisabled(true); // Disable the button initially
    setOnContinue(() => () => {}); // Set an empty onContinue function
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array
  useEffect(() => {
    if (!customer) {
      goToStep(0);
    }
  }, [customer, goToStep]);

  const onEdit = () => {
    goToStep(0);
  };
  const handleEditAddress = (addressId) => {
    setAddressIdToEdit(addressId);
    goToSubStep(1, 2);
  };
  const handlePaymentClick = (paymentId) => {
    if (paymentId === '1') {
      goToSubStep(2, 1);
    } else if (paymentId === '2') {
      goToSubStep(2, 2);
    } else if (paymentId === '3') {
      // customer.status==="low"? goToStep(3): goToSubStep(2, 3)
      setIsDialogOpen(true)
     
    }
  };

  const handleCODOrder = async () => {
    setIsRequesting(true);

    try {
      if (customer.status ==="medium"){
        goToSubStep(2, 1);
      }else{
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerPhone: customer.phoneNumber,
            items,
            paymentMethod: "COD", // Set payment type as COD
            paymentIntent: null, // No paymentIntent for COD
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) throw new Error(data.error || "Failed to place order");
    
        toast.success("Order placed successfully!"); // Show success message
        setIsDialogOpen(false); // Close dialog
        goToStep(3);
  
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsRequesting(false);
    }
  };
  
  const selectedAddress =
    customer.addresses.find((address) => address.isSelected) || {};

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <p className=' text-sm'>Hey! Welcome back +92{customer.phoneNumber}</p>
        <button
          onClick={onEdit}
          className='rounded-full bg-slate-200 px-3 py-[2px] text-xs text-blue-900'
        >
          Edit
        </button>
      </div>
      <DeliveryCard
        id={selectedAddress._id}
        fullName={selectedAddress.fullName}
        address={selectedAddress.fullAddress}
        email={selectedAddress.email}
        postalCode={selectedAddress.postalCode}
        city={selectedAddress.city}
        state={selectedAddress.state}
        isSelected={selectedAddress.isSelected}
        onEdit={() => handleEditAddress(selectedAddress._id)}
      />
      <div>
        <p className='mb-2'>Payment Options</p>
        {PaymentMethods.map((p) => (
          <PaymentMethod
            key={p.id}
            type={p.type}
            price={p.price}
            methods={p.methods}
            id ={p.id}
            isDiscount={p.isDiscount}
            isExtra={p.isExtra}
            discount={p.discount}
            message = {p.message}
            extraCharges={p.extraCharges}
            onClick={() => handlePaymentClick(p.id)}
          />
        ))}
      </div>
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {customer.status === "medium" ? "Mode of payment" : "Order confirmation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {customer.status === "medium"
                ? "How would you like to pay partial payment?"
                : "Are you sure to place order?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              {customer.status === "medium" ? "Easypaisa/JazzCash" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCODOrder} disabled={isRequesting}>
              {isRequesting ? (
                <Loader className="w-5 h-5 spinner" />
              ) : customer.status === "medium" ? (
                "Debit/CreditCard"
              ) : (
                "Place order"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      
    </div>
  );
}

export default PaymentList;
