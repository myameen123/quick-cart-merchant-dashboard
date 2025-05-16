'use client';
// import {
//   useCheckout,
//   CheckoutProvider,
// } from '@/components/contexts/CheckoutContext';
// import CartModal from '@/components/modals/CartModal';

// import Address from './_components/address/Address';
// import OtpForm from './_components/mobile/OtpForm';
// import PhoneForm from './_components/mobile/PhoneForm';
// import PaymentForm from './_components/payment/PaymentForm';

const ShippingPage = () => {
  // Ensure you wrap the entire component in the `CheckoutProvider`
//   return (
//     <CheckoutProvider>
//       <ShippingContent />
//     </CheckoutProvider>
//   );
// };

// // Separated content logic to avoid using `useCheckout()` before wrapping in provider
// const ShippingContent = () => {
//   const { step, subSteps } = useCheckout(); // Now this will be within the provider context

//   const renderSubStepComponent = () => {
//     // Step 0: Mobile
//     if (step === 0) {
//       switch (subSteps[0]) {
//         case 0:
//           return <PhoneForm />;
//         case 1:
//           return <OtpForm />;
//         default:
//           return null;
//       }
//     }

//     // Step 1: Address
//     else if (step === 1) {
//       return <Address />;
//     }

//     // Step 2: Payment
//     else if (step === 2) {
//       return <PaymentForm />;
//     }
//   };

  return (
    <div className=' flex h-full w-full items-center justify-center text-sm'>
      {/* <CartModal checkoutSteps={step}>{renderSubStepComponent()}</CartModal> */}
      hi
    </div>
  );
};

export default ShippingPage;
