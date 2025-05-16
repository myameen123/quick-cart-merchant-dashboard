/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
"use client";
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import DeliveryTime from "./DeliveryTime";
import { MoveLeft, Plus } from "lucide-react";
import { useCheckout } from "@/components/contexts/CheckoutContext";
import { useCustomer } from "@/components/contexts/CustomerContext";
import useCartService from '@/lib/hooks/useCartStore';
import toast from "react-hot-toast";
import Image from "next/image";
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
function AddCard() {
  const {
    setButtonDisabled,
    setOnContinue,
    goToStep,
    goToSubStep,
    setIsLoading,

  } = useCheckout();

  const { customer } = useCustomer();
  const [selectedMethod, setSelectedMethod] = useState(null); // Selected card details
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls alert dialog
  const [isRequesting, setIsRequesting] = useState(false); // Controls alert dialog
  const { items, itemsPrice} = useCartService();

  useEffect(() => {
    setButtonDisabled(true);
    setOnContinue(() => () => {});
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (customer?.phoneNumber) {
      fetchPaymentMethods(customer.phoneNumber);
    }
  }, [customer?.phoneNumber]);

  // Fetch payment methods from API
  async function fetchPaymentMethods(phoneNumber) {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/payment/get-payment-methods?phoneNumber=${phoneNumber}`);
      const data = await res.json();
      // console.log("data....",data)
      if (data.paymentMethods) {
        // Find the selected payment method
        const selected = data.paymentMethods.find((method) => method.isSelected);
        if (selected) {
          setSelectedMethod(selected); // Update state with fetched details
          setButtonDisabled(false);
          setIsLoading(false)
          // setOnContinue(() => () => handlePayment(selected));
          setOnContinue(() => () => setIsDialogOpen(true));
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods.");
      setIsLoading(false)

    }finally{
      setIsLoading(false)
    }
  }

  const onLeft = () => {
    goToStep(2);
  };

  const onAddCard = () => {
    goToSubStep(2, 2);
  };

  const onChangeCard = () => {
    goToSubStep(2, 4);
  };

  const discount = 500;
  const subtotal = itemsPrice-discount
  
  const handlePayment = async () => {
    setIsRequesting(true); // Start loading
    try {
      const amountInPaisa = subtotal * 100;
      console.log(items);
      console.log(customer);
      
      const response = await fetch("/api/payment/charge-saved-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: customer.phoneNumber,
          amount: amountInPaisa,
        }),
      });
  
      const { success, error, paymentIntent } = await response.json();
  
      if (success) {
        console.log(paymentIntent);
        toast.success("Payment successful!");
        
        // Save the order in the database after successful payment
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerPhone: customer.phoneNumber,
            items,
            paymentIntent,
            paymentMethod:"debit/credit card"
          }),
        });
  
        const orderData = await orderResponse.json();
        
        if (orderResponse.ok) {
          console.log("Order placed successfully:", orderData.order);
          toast.success("Order placed successfully!");
          goToStep(3);
        } else {
          toast.error("Failed to place order: " + orderData.error);
        }
      } else {
        toast.error("Payment failed: " + error);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsRequesting(false); // Stop loading
      setIsDialogOpen(false);
    }
  };
  
  // const handlePayment = async () => {
  //   setIsRequesting(true); // Start loading
  //   try {
      
  //     const amountInPaisa = subtotal * 100
  //     setIsRequesting(true)
  //     console.log(items)
  //     console.log(customer)
  //     const response = await fetch("/api/payment/charge-saved-card", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phoneNumber: customer.phoneNumber,
  //         amount: amountInPaisa,
  //         // currency: "pkr",
  //       }),
  //     });
  
  //     const { success, error, paymentIntent } = await response.json();
  
  //     if (success) {
  //       console.log(paymentIntent)
  //       toast.success("Payment successful!");
  //       goToStep(3)
  //     } else {
  //       toast.error("Payment failed: " + error);
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong!");
  //   } finally {
  //     setIsRequesting(false); // Stop loading
  //     setIsDialogOpen(false)
  //   }
  // };
  const formattedPrice = subtotal.toLocaleString('en-PK', {
    style: 'currency',
    currency: 'PKR',
  });
  return (
    <div className="mt-4 flex flex-col gap-3">
      <DeliveryTime />
      <button className="my-4 flex gap-4" onClick={onLeft}>
        <MoveLeft />
        <span>Credit/Debit Cards</span>
      </button>

      {selectedMethod ? (
        <div className="mb-4 h-12 flex w-full justify-between border p-4 flex-row items-center bg-white text-sm border-black debit-card rounded-md">
          <div className="flex items-center gap-4 w-full">
            <Image
              src={selectedMethod.brand === "visa" ? "/visa.svg" : "/master_card.svg"}
              alt="logo"
              width={60}
              height={60}
            />
            <p className="w-full">
              {selectedMethod.brand?.toUpperCase() || "Card"} &#8226;&#8226;&#8226;&#8226; {selectedMethod.last4}
            </p>
          </div>
          <button className="font-semibold" onClick={onChangeCard}>Change</button>
        </div>
      ) : (
        <div className="flex cursor-pointer items-center gap-2" onClick={onAddCard}>
          <span className="rounded-md border p-1">
            <Plus />
          </span>
          <p>Add Card</p>
        </div>
      )}
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to proceed with this payment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePayment} disabled={isRequesting}>
              {isRequesting ? <Loader className="w-5 h-5 spinner" /> : `Pay ${formattedPrice}`}
            </AlertDialogAction>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AddCard;


// /* eslint-disable import/order */
// "use client"
// import React, { useEffect } from 'react';
// import DeliveryTime from './DeliveryTime';
// import { MoveLeft, Plus } from 'lucide-react';
// import { useCheckout } from '@/components/contexts/CheckoutContext';
// import { useCustomer } from '@/components/contexts/CustomerContext';
// import CreditCard from "./creditCard"
// import toast from 'react-hot-toast';
// import Image from 'next/image';
// function AddCard() {
//   const {
//     setButtonDisabled,
//     setOnContinue,
//     goToStep,
//     goToSubStep,
//     setIsLoading,
//   } = useCheckout();
//   const { customer, setCustomer } = useCustomer();
//    useEffect(() => {
//       setButtonDisabled(true); // Disable the button initially
//       setOnContinue(() => () => {}); // Set an empty onContinue function
//       setIsLoading(false);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []); // Empty dependency array
   

//   const onLeft = () => {
//     goToStep(2);
//   };
//   const onAddCard = () => {
//     goToSubStep(2, 2);
//   };
//   const debitCreditCards = customer?.paymentMethods?.filter(
//     (method) => method.type === 'debit/credit card'
//   ) || [];

//   useEffect(() => {
//     if(debitCreditCards.length>0){
//       setButtonDisabled(false)
//       setOnContinue(() => () => handlePayment());
//       setIsLoading(false);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [setOnContinue,  setIsLoading]);
//   const onChangeCard = ()=>{
//     goToSubStep(2, 4);
//   }
//   const selectedMethod = customer.paymentMethods?.find(
//     (method) =>  method.isSelected
//   );
//   const handlePayment = ()=>{
//     console.log("paymentt.....",selectedMethod.cardDetails
//     )
//   }
//   return (
//     <div className='flec mt-4 flex-col gap-3'>
//       <DeliveryTime />
//       <button className='my-4 flex gap-4' onClick={onLeft}>
//         <MoveLeft />
//         <span>Credit/Debit Cards</span>
//       </button>
//       {/* {debitCreditCards.length > 0 && (
//         debitCreditCards.map((card) => (
//           <CreditCard key={card._id} card={card} onSelect={() => handleCardSelect(card._id)}/>
          
//         ))
//       )} */}
//       {debitCreditCards.length>0? (
//         <div className={`mb-4 h-12  flex w-full justify-between border  p-4  flex-row items-center bg-white  text-sm border-black debit-card rounded-md`}>
//           <div className='flex items-center gap-4 w-full'>
//                 <Image
//                   src={`${selectedMethod.cardDetails.cardType==="Visa"?"/visa.svg":"/master_card.svg"}`}
//                   className=''
//                   alt='logo'
//                   width={60}
//                   height={60}
//                 />
//                 <p className=' w-full   '>
//                   {selectedMethod.cardDetails.cardType || 'Card'} &#8226;&#8226;&#8226;&#8226;  {selectedMethod.cardDetails?.cardNumber?.slice(-4)}
//                 </p>
//               </div>
//               <button className='font-semibold' onClick={onChangeCard}>Change</button>
//         </div>
//       ):
//       (
//         <div className='flex cursor-pointer items-center gap-2' onClick={onAddCard}>
//         <span className='rounded-md border p-1'>
//           <Plus />
//         </span>
//         <p>Add Card</p>
//       </div>)}
      
//     </div>
//   );
// }

// export default AddCard;
