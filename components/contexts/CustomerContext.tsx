import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of the customer data
interface Customer {
  _id?: string; // MongoDB ID, optional
  phoneNumber: string;
  addresses?: Array<{
    postalCode: string;
    fullName: string;
    city: string;
    state: string;
    email: string;
    fullAddress: string;
    addressType: 'Work' | 'Home';
    isSelected?: boolean;
  }>;
  paymentMethods?: Array<{
    type: 'debit/credit card' | 'wallet';
    cardDetails?: {
      fullName: string;
      cardNumber: string;
      expiryDate: string;
      cvc: string;
    };
    walletDetails?: {
      phoneNumber: string;
      franchise: 'JazzCash' | 'EasyPaisa';
    };
     isSelected?: boolean;
  }>;
}

// Define the context structure
interface CustomerContextType {
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
  clearCustomer: () => void;
}

// Create the context
const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined,
);

// Provider component
export const CustomerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const clearCustomer = () => setCustomer(null);

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, clearCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the context
export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
