// CheckoutContext.tsx
import { ConfirmationResult } from 'firebase/auth';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the context
type CheckoutContextType = {
  step: number;
  mobile: string;
  otp: string;
  setMobile: React.Dispatch<React.SetStateAction<string>>;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  addressIdToEdit: string;
  setAddressIdToEdit: React.Dispatch<React.SetStateAction<string>>;
  subSteps: SubStepsType;
  nextStep: () => void;
  nextSubStep: () => void;
  goToStep: (step: number) => void;
  goToSubStep: (step: number, subStep: number) => void;
  prevStep: () => void;
  setSubSteps: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  buttonDisabled: boolean;
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onContinue: () => void;
  setOnContinue: React.Dispatch<React.SetStateAction<() => void>>;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: React.Dispatch<
    React.SetStateAction<ConfirmationResult | null>
  >;
};

type SubStepsType = {
  [key: number]: number;
};

// Create the context
const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

// Provide the context to components
export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [addressIdToEdit, setAddressIdToEdit] = useState('');
  const [subSteps, setSubSteps] = useState<SubStepsType>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [onContinue, setOnContinue] = useState(() => () => {});
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const nextSubStep = () => {
    setSubSteps((prevSubSteps) => ({
      ...prevSubSteps,
      [step]: prevSubSteps[step] + 1,
    }));
  };

  const goToStep = (targetStep: number) => {
    setStep(targetStep);
    setSubSteps((prev) => ({ ...prev, [targetStep]: 0 }));
  };

  const goToSubStep = (targetStep: number, targetSubStep: number) => {
    setStep(targetStep);
    setSubSteps((prev) => ({ ...prev, [targetStep]: targetSubStep }));
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    if (subSteps[step] > 0) {
      setSubSteps((prev) => ({
        ...prev,
        [step]: prev[step] - 1,
      }));
    } else if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        subSteps,
        nextStep,
        nextSubStep,
        prevStep,
        setSubSteps,
        buttonDisabled,
        setButtonDisabled,
        onContinue,
        setOnContinue,
        setStep,
        mobile,
        setMobile,
        otp,
        setOtp,
        goToStep,
        goToSubStep,
        confirmationResult,
        setConfirmationResult,
        isLoading,
        setIsLoading,
        addressIdToEdit,
        setAddressIdToEdit,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook to use CheckoutContext
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// // Define types for the context
// type CheckoutContextType = {
//   step: number;
//   subSteps: SubStepsType;
//   nextStep: () => void;
//   nextSubStep: () => void;
//   prevStep: () => void;
//   setSubSteps: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>;
// };

// type SubStepsType = {
//   [key: number]: number;
// };

// // Create the context
// const CheckoutContext = createContext<CheckoutContextType | undefined>(
//   undefined,
// );

// // Provide the context to components
// export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
//   const [step, setStep] = useState(0);
//   const [subSteps, setSubSteps] = useState<SubStepsType>({ 0: 0, 1: 0, 2: 0 });

//   const nextSubStep = () => {
//     setSubSteps((prevSubSteps) => ({
//       ...prevSubSteps,
//       [step]: prevSubSteps[step] + 1,
//     }));
//   };

//   const nextStep = () => {
//     setStep((prevStep) => prevStep + 1);
//   };

//   const prevStep = () => {
//     if (subSteps[step] > 0) {
//       setSubSteps((prev) => ({
//         ...prev,
//         [step]: prev[step] - 1,
//       }));
//     } else if (step > 0) {
//       setStep((prev) => prev - 1);
//     }
//   };

//   return (
//     <CheckoutContext.Provider
//       value={{ step, subSteps, nextStep, nextSubStep, prevStep, setSubSteps }}
//     >
//       {children}
//     </CheckoutContext.Provider>
//   );
// };

// // Custom hook to use the Checkout context
// export const useCheckout = () => {
//   const context = useContext(CheckoutContext);
//   if (!context) {
//     throw new Error('useCheckout must be used within a CheckoutProvider');
//   }
//   return context;
// };
