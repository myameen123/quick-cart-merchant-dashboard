/* eslint-disable import/order */
"use client";
import React, { useEffect, useState } from "react";
import DeliveryTime from "./DeliveryTime";
import { MoveLeft, Plus } from "lucide-react";
import { useCheckout } from "@/components/contexts/CheckoutContext";
import { useCustomer } from "@/components/contexts/CustomerContext";
import CreditCard from "./creditCard";
import toast from "react-hot-toast";
import Image from "next/image";

function CardList() {
  const {
    setButtonDisabled,
    setOnContinue,
    goToStep,
    goToSubStep,
    setIsLoading,
  } = useCheckout();

  const { customer, setCustomer } = useCustomer();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);


    useEffect(() => {
      setButtonDisabled(true);
      setOnContinue(() => () => {});
      setIsLoading(false);
    }, []);

  // Fetch customer's payment methods
  useEffect(() => {
    if (customer?.phoneNumber) {
      fetchPaymentMethods(customer.phoneNumber);
    }
  }, [customer?.phoneNumber]);

  async function fetchPaymentMethods(phoneNumber) {
    setLoading(true);
    try {
      setIsLoading(true)
      const res = await fetch(`/api/payment/get-payment-methods?phoneNumber=${phoneNumber}`);
      const data = await res.json();

      if (data.paymentMethods) {
        setPaymentMethods(data.paymentMethods);
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods.");
      setIsLoading(false)
    } finally {
      setLoading(false);
    }
  }

  const onLeft = () => {
    goToStep(2);
  };

  const onAddCard = () => {
    goToSubStep(2, 2);
  };

  const handleCardSelect = async (id) => {
    if (!customer || !customer.phoneNumber) {
      toast.error("Customer information is missing.");
      return;
    }

    const selectedMethod = paymentMethods.find((method) => method.id === id && method.isSelected);

    if (selectedMethod) {
      goToSubStep(2, 1);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/customer/card", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: customer.phoneNumber,
          stripePaymentMethodId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment method.");
      }

      const updatedCustomer = await response.json();
      // console.log("yoooo..",updatedCustomer)
      // setCustomer(updatedCustomer.data);
      // fetchPaymentMethods(customer.phoneNumber); // Refresh card list
      goToSubStep(2, 1);
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Failed to update payment method. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card flex mt-4 flex-col gap-3">
      <DeliveryTime />
      <button className="my-4 flex gap-4" onClick={onLeft}>
        <MoveLeft />
        <span>Credit/Debit Cards</span>
      </button>

      <div className="flex flex-col">
        {loading ? (
          <p>Loading payment methods...</p>
        ) : paymentMethods.length > 0 ? (
          paymentMethods.map((card) => (
            <CreditCard key={card.id} card={card} onSelect={() => handleCardSelect(card.id)} />
          ))
        ) : (
          <p>No saved cards found.</p>
        )}
      </div>

      <div className="flex cursor-pointer items-center gap-2" onClick={onAddCard}>
        <span className="rounded-md border p-1">
          <Plus />
        </span>
        <p>Add Card</p>
      </div>
    </div>
  );
}

export default CardList;

// /* eslint-disable import/order */
// import React from 'react';
// import DeliveryTime from './DeliveryTime';
// import { MoveLeft, Plus } from 'lucide-react';
// import { useCheckout } from '@/components/contexts/CheckoutContext';
// import { useCustomer } from '@/components/contexts/CustomerContext';
// import CreditCard from "./creditCard"
// import toast from 'react-hot-toast';
// import Image from 'next/image';
// function CardList() {
//   const {
//     setButtonDisabled,
//     setOnContinue,
//     goToStep,
//     goToSubStep,
//     setIsLoading,
//   } = useCheckout();
//   const { customer, setCustomer } = useCustomer();
//   const onLeft = () => {
//     goToStep(2);
//   };
//   const onAddCard = () => {
//     goToSubStep(2, 2);
//   };
//   const debitCreditCards = customer?.paymentMethods?.filter(
//     (method) => method.type === 'debit/credit card'
//   ) || [];

//   const handleCardSelect = async (id) => {
//     if (!customer || !customer.phoneNumber) {
//       toast.error('Customer information is missing.');
//       return;
//     }
//     const selectedMethod = customer.paymentMethods?.find(
//       (method) => method._id === id && method.isSelected
//     );
  
//     if (selectedMethod) {
//       goToSubStep(2,1)
//       return
//     }    
//     try {
//       setIsLoading(true);

  
//       const response = await fetch('/api/customer/card', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phoneNumber: customer.phoneNumber,
//           paymentMethodId: id, // ID of the selected payment method
//         }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to update payment method.');
//       }
  
//       const updatedCustomer = await response.json();
  
//       // Update customer data in the context
//       setCustomer(updatedCustomer.data);
//       goToSubStep(2,1)
//       // toast.success('Payment method updated successfully!');
//     } catch (error) {
//       console.error('Error updating payment method:', error);
//       toast.error('Failed to update payment method. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <div className='card flex mt-4 flex-col gap-3 '>
//       <DeliveryTime />
//       <div className='flex  flex-col'>

//       {debitCreditCards.length > 0 && (
//         debitCreditCards.map((card) => (
//           <CreditCard key={card._id} card={card} onSelect={() => handleCardSelect(card._id)}/>
          
//         ))
//       )}
//       </div>

//       <div className='flex cursor-pointer items-center gap-2' onClick={onAddCard}>
//         <span className='rounded-md border p-1'>
//           <Plus />
//         </span>
//         <p>Add Card</p>
//       </div>
//     </div>
//   );
// }

// export default CardList;
