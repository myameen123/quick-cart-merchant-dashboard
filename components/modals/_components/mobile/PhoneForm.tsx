/* eslint-disable import/order */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import {
  useEffect,
  useState,

} from 'react';

import axios from 'axios';

import { useCheckout } from '@/components/contexts/CheckoutContext';
import PhoneNumberInput from '@/components/inputs/PhoneNumberInput';
import toast from 'react-hot-toast';

const PhoneForm = () => {
  const {
    setOnContinue,
    nextSubStep,
    setButtonDisabled,
    setMobile,
    setOtp,
    setIsLoading,
    otp,
    confirmationResult,
  } = useCheckout();
  const [phoneNumber, setPhoneNumber] = useState(''); // State to hold mobile number
  const [isValid, setIsValid] = useState(false); // State to track validation
  const [notify, setNotify] = useState(true); // State to track checkbox

  useEffect(() => {
    setButtonDisabled(true); // Disable the button initially
    setOnContinue(() => () => {}); // Set an empty onContinue function
    setOtp("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array

  useEffect(() => {
    setButtonDisabled(!isValid); // Enable button when valid
  }, [isValid]);

  const generateOTP = () => {
    const number = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    setOtp(number.toString());
  };

  useEffect(() => {
    if (isValid) {
      setOnContinue(() => generateOTP);
      generateOTP();
    }
  }, [isValid]); // Depend on the function state

 

  // const requestOtp = async () => {
  //   try {
  //     setIsLoading(true)
  //     const response = await axios.post('/api/otp', {
  //       phoneNumber: phoneNumber, 
  //       otp: otp,
  //     });
  
  //     // Check if response is unsuccessful (e.g., API returns 4xx/5xx status codes)
  //     if (response.status !== 200) {
  //       toast.error(response.data?.message || 'Failed to send OTP.'); 
  //     }
  
  //     setMobile(phoneNumber);
  //     toast.success('OTP sent successfully.');
  //     nextSubStep(); // Move to the next sub-step 
  
  //   } catch (error) {  
  //     // Handle axios error properly
  //     if (axios.isAxiosError(error)) {
  //       toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
  //     } else {
  //       toast.error('An unexpected error occurred.');
  //     }
  //   } finally{
  //     setIsLoading(false)
  //   }
  // };
  
  const requestOtp = async () => {
    try {
        setIsLoading(true);
        // const response = await axios.post('/api/otp', {
        //     phoneNumber: phoneNumber, 
        //     otp: otp,
        // });

        // // If status is not 200, handle the error
        // if (response.status !== 200) {
        //     throw new Error(response.data?.message || 'Failed to send OTP.');
        // }

        setMobile(phoneNumber);
        toast.success('OTP sent successfully.');
        nextSubStep(); // Move to the next sub-step 

    } catch (error) {  
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } else {
            toast.error('An unexpected error occurred.');
        }
    } finally {
        setIsLoading(false);
    }
};


  // useEffect to trigger the API call after OTP is generated
  useEffect(() => {
    if (otp) {
      requestOtp();
    }
  }, [otp]);

  return (
    <div className='mt-4 flex flex-col items-center gap-4'>
      <p className=' text-lg text-blue-950'>Enter Mobile Number</p>

      {!confirmationResult && (
        <>
          <PhoneNumberInput
            value={phoneNumber}
            onChange={setPhoneNumber} // Update the mobile state
            onValidation={setIsValid} // Track validation status
            required
          />

          {/* Checkbox Component */}
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='notify'
              name='notify'
              checked={notify}
              onChange={() => setNotify(!notify)} // Toggle the notify state
              className='checkbox'
            />
            <label htmlFor='notify' className='cursor-pointer'>
              Notify me for orders, updates & offers
            </label>
          </div>
        </>
      )}

      <style jsx>{`
        .checkbox {
          width: 15px;
          height: 15px;
          position: relative;
          cursor: pointer;
          appearance: none;
          border: 2px solid black;
          border-radius: 4px;
          background-color: white;
        }

        .checkbox::before {
          content: ''; /* Create the outer layer */
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;

          border-radius: 4px;
          background-color: white;
          z-index: 1;
        }

        .checkbox::after {
          content: '✔'; /* Add the checkmark */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10px;
          color: white;
          visibility: hidden;
          z-index: 2;
        }

        .checkbox:checked::before {
          background-color: black; /* Change the background when checked */
        }

        .checkbox:checked::after {
          visibility: visible; /* Show the checkmark when checked */
        }
      `}</style>
    </div>
  );
};

export default PhoneForm;
// /* eslint-disable import/order */
// /* eslint-disable react-hooks/exhaustive-deps */
// 'use client';
// import {
//   useEffect,
//   useState,

// } from 'react';

// import axios from 'axios';

// import { useCheckout } from '@/components/contexts/CheckoutContext';
// import PhoneNumberInput from '@/components/inputs/PhoneNumberInput';
// import toast from 'react-hot-toast';

// const PhoneForm = () => {
//   const {
//     setOnContinue,
//     nextSubStep,
//     setButtonDisabled,
//     setMobile,
//     setOtp,
//     otp,
//     confirmationResult,
//   } = useCheckout();
//   const [phoneNumber, setPhoneNumber] = useState(''); // State to hold mobile number
//   const [isValid, setIsValid] = useState(false); // State to track validation
//   const [notify, setNotify] = useState(true); // State to track checkbox

//   useEffect(() => {
//     setButtonDisabled(true); // Disable the button initially
//     setOnContinue(() => () => {}); // Set an empty onContinue function
//     setOtp("")
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // Empty dependency array

//   useEffect(() => {
//     setButtonDisabled(!isValid); // Enable button when valid
//   }, [isValid]);

//   const generateOTP = () => {
//     const number = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
//     setOtp(number.toString());
//   };

//   useEffect(() => {
//     if (isValid) {
//       setOnContinue(() => generateOTP);
//       generateOTP();
//     }
//   }, [isValid]); // Depend on the function state

 

//   const requestOtp = async () => {
//     try {
//       const response = await axios.post('/api/otp', {
//         phoneNumber: phoneNumber, 
//         otp: otp,
//       });
  
//       // Check if response is unsuccessful (e.g., API returns 4xx/5xx status codes)
//       if (response.status !== 200) {
//         toast.error(response.data?.message || 'Failed to send OTP.'); 
//       }
  
//       setMobile(phoneNumber);
//       toast.success('OTP sent successfully.');
//       nextSubStep(); // Move to the next sub-step 
  
//     } catch (error) {  
//       // Handle axios error properly
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
//       } else {
//         toast.error('An unexpected error occurred.');
//       }
//     }
//   };
  

//   // useEffect to trigger the API call after OTP is generated
//   useEffect(() => {
//     if (otp) {
//       requestOtp();
//     }
//   }, [otp]);

//   return (
//     <div className='mt-4 flex flex-col items-center gap-4'>
//       <p className=' text-lg text-blue-950'>Enter Mobile Number</p>

//       {!confirmationResult && (
//         <>
//           <PhoneNumberInput
//             value={phoneNumber}
//             onChange={setPhoneNumber} // Update the mobile state
//             onValidation={setIsValid} // Track validation status
//             required
//           />

//           {/* Checkbox Component */}
//           <div className='flex items-center gap-2'>
//             <input
//               type='checkbox'
//               id='notify'
//               name='notify'
//               checked={notify}
//               onChange={() => setNotify(!notify)} // Toggle the notify state
//               className='checkbox'
//             />
//             <label htmlFor='notify' className='cursor-pointer'>
//               Notify me for orders, updates & offers
//             </label>
//           </div>
//         </>
//       )}

//       <style jsx>{`
//         .checkbox {
//           width: 15px;
//           height: 15px;
//           position: relative;
//           cursor: pointer;
//           appearance: none;
//           border: 2px solid black;
//           border-radius: 4px;
//           background-color: white;
//         }

//         .checkbox::before {
//           content: ''; /* Create the outer layer */
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;

//           border-radius: 4px;
//           background-color: white;
//           z-index: 1;
//         }

//         .checkbox::after {
//           content: '✔'; /* Add the checkmark */
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           font-size: 10px;
//           color: white;
//           visibility: hidden;
//           z-index: 2;
//         }

//         .checkbox:checked::before {
//           background-color: black; /* Change the background when checked */
//         }

//         .checkbox:checked::after {
//           visibility: visible; /* Show the checkmark when checked */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PhoneForm;
