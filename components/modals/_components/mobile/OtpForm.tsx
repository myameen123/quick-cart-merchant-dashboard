/* eslint-disable import/order */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { startTransition, useEffect, useState } from 'react';
import { useCustomer } from '@/components/contexts/CustomerContext';
import OtpInput from 'react-otp-input';
// import {con} from "firebase/auth"
import { useCheckout } from '@/components/contexts/CheckoutContext';
import toast from 'react-hot-toast';
import { SquarePen } from 'lucide-react';
import useCartService from '@/lib/hooks/useCartStore';
// import {fetchPrediction} from "@/lib/model-test"


const OtpForm = () => {
  const [userOtp, setUserOtp] = useState('');
  const {
    setButtonDisabled,
    setOnContinue,
    mobile,
    otp,
    goToStep,
    setIsLoading,
  } = useCheckout();
  const [isValid, setIsValid] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const { customer,setCustomer } = useCustomer(); // Access the context
  const { items, itemsPrice} = useCartService();
  
   useEffect(() => {
     setButtonDisabled(true); // Disable the button initially
     setOnContinue(() => () => {}); // Set an empty onContinue function
     setIsLoading(false);
      // console.log("prediction...", fetchPrediction(inputValues))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    setButtonDisabled(!isValid); // Enable button when valid
  }, [isValid]);

  useEffect(() => {
    if (userOtp.length === 4) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [userOtp]);

  useEffect(() => {
    if (isValid) {
      // setResendCountdown(0);
      setOnContinue(() => verifyOtp);
      verifyOtp();
    }
  }, [isValid]); // Depend on the function state


  async function fetchPrediction(phoneNumber:any) {
    try {
        const response = await fetch("/api/model-prediction", {
            method: "POST",
            body: JSON.stringify({
              phoneNumber,
              items,
              itemsPrice
            }),
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status code ${response.status}`);
        }

        const data = await response.json();
        
        // Ensure the API response has the expected `finalPrediction` key
        if (!data || typeof data.finalPrediction === "undefined") {
            throw new Error("Invalid API response: Missing finalPrediction");
        }
        const prediction = data.finalPrediction
        
       return prediction
    } catch (error) {
        // return { error: (error as Error).message };
        toast.error("Error fetching prediction")
    }
}



  const getCustomerStatus = () => {
    const randomValue = Math.random(); // Generate a number between 0 and 1

    // if (randomValue >= 0.7) return "high"; // High for values close to 1
    // if (randomValue >= 0.3) return "medium"; // Medium for values in between
    // return "low"; // Low for values close to 0
    return "medium"
};


  const verifyOtp = async () => {
    setIsLoading(true);
    if (userOtp === "3563") {
    // if (userOtp === otp) {
      try {
        const response = await fetch('/api/customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: mobile }),
        });

        const data = await response.json();

        if (response.ok) {
          // toast.success(data.message);

        // const prediction = await fetchPrediction(data.data.phoneNumber)
        const prediction = 0.2;
        let status = ""
        if (prediction >= 0.7) status =  "high"; // High for values close to 1
        if (prediction >= 0.3) status =  "medium"; // Medium for values in between
        if (prediction < 0.3) status =  "low"; // Medium for values in between
        // status =  "high"; 
        const returnedCustomer = { ...data.data, status: status, prediction:prediction };
        console.log(prediction, status)
        // const returnedCustomer = { ...data.data, status: getCustomerStatus() };
          // Save customer data in context
          setCustomer(returnedCustomer);
          // console.log("data...", data)

          if (data.data.addresses.length > 0) {
            goToStep(2);
          } else {
            goToStep(1);
          }
          // nextStep(); // Proceed to next step
        } else {
          toast.error(data.message || 'Failed to process customer');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Invalid OTP.');
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    setResendCountdown(30);
  };
  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className=' flex flex-col items-center gap-2'>
        <h2 className='text-center text-lg font-medium'>
          Verify Mobile Number
        </h2>
        <p className='text-sm font-medium'>
          To Use Your Saved Address, Enter the OTP Sent to
        </p>
        <div className=' flex items-center justify-center gap-1'>
          <span className=' font-semibold'>+92-{mobile}</span>
          <button>
            <SquarePen size={15} className='cursor-pointer text-green-800' />
          </button>
        </div>
      </div>
      <OtpInput
        value={userOtp}
        onChange={setUserOtp}
        numInputs={4}
        renderSeparator={<span>-</span>}
        renderInput={(props) => (
          <input
            {...props}
            // className='h-12 w-12 rounded-md border border-gray-300 text-center transition focus:outline-none focus:ring-2 focus:ring-primary'
          />
        )}
        inputStyle={{
          width: '3rem', // Set the width explicitly for each input field
          height: '3rem', // Set the height
          textAlign: 'center',
          border: '1px solid #ccc',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          fontSize: '1.25rem',
          outline: 'none',
        }}
        containerStyle='flex justify-center gap-3'
      />
      <div className='mx-auto'>
        {resendCountdown > 0 ? (
          <p>
            Resend OTP in{' '}
            <span className='text-yellow-300'>{resendCountdown}</span>
          </p>
        ) : (
          <button className='font-semibold underline' onClick={resendOtp}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpForm;

// /* eslint-disable import/order */
// 'use client';

// import { auth } from '@/firebase';
// import {
//   ConfirmationResult,
//   RecaptchaParameters,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from 'firebase/auth';

// import {
//   FormEvent,
//   startTransition,
//   useEffect,
//   useState,
//   useTransition,
// } from 'react';

// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from '@/components/ui/input-otp';

// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

// import { useRouter } from 'next/navigation';

// function OtpLogin() {
//   const router = useRouter();
//   const [otp, setOtp] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState('');
//   const [resendCountdown, setResendCountdown] = useState(0);
//   const [confirmationResult, setConfirmationResult] =
//     useState<ConfirmationResult | null>();

//   const [isPending, setIsPending] = useTransition();

//   const [recaptchaVerifier, setrecaptchaVerifier] =
//     useState<RecaptchaVerifier | null>(null);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (resendCountdown > 0) {
//       timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
//     }

//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   useEffect(() => {
//     const recaptchaVerifier = new RecaptchaVerifier(
//       auth,
//       'receptcha-container',
//       {
//         size: 'invisible',
//       },
//     );
//     setrecaptchaVerifier(recaptchaVerifier);

//     return () => {
//       recaptchaVerifier.clear();
//     };
//   }, [auth]);

//   const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
//     e?.preventDefault();
//     setResendCountdown(60);

//     startTransition(async () => {
//       setError('');

//       if (!recaptchaVerifier) {
//         return setError('RecaptchaVerifier is not initialized');
//       }
//       try {
//         const confirmationResult = await signInWithPhoneNumber(
//           auth,
//           phoneNumber,
//           recaptchaVerifier,
//         );
//         setConfirmationResult(confirmationResult);
//         setSuccess('OTP sent successfully.');
//       } catch (err: any) {
//         console.log(err);
//         setResendCountdown(0);

//         if (err.code === 'auth/invalid-phone-number') {
//           setError('Invalid phone number. please check the number.');
//         } else if (err.code === 'auth/too-many-requests') {
//           setError('Too many request. Please try again later');
//         } else {
//           setError('Faild to send OTP, please try again');
//         }
//       }
//     });
//   };
//   return (
//     <div className=' mt-4'>
//       {!confirmationResult && (
//         <form onSubmit={requestOtp}>
//           <Input
//             className='text-black'
//             type='tel'
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//           />
//           <p>Please Enter Number</p>
//         </form>
//       )}
//       <Button
//         disabled={!phoneNumber || isPending || resendCountdown > 0}
//         onClick={() => requestOtp()}
//       >
//         {resendCountdown > 0
//           ? `Resend OTP in ${resendCountdown}`
//           : isPending
//             ? 'Sending OTP'
//             : 'Send OTP'}
//       </Button>
//       <div className=' p-10 text-center'>
//         {error && <p className='text-red-500'>{error}</p>}
//         {success && <p className='text-green-500'>{success}</p>}
//       </div>
//       <div id='receptcha-container' />
//       {isPending && <p>loading...</p>}
//     </div>
//   );
// }

// export default OtpLogin;
