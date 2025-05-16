/* eslint-disable import/order */
'use client';
import { Modal, Paper, IconButton, CircularProgress } from '@mui/material';
import { Check, ShoppingCart, X } from 'lucide-react';
import './ModalLayout.css';
import Image from 'next/image';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import OrderSummary from '../_components/order/OrderSummary';
import pciImage from '@/public/images/cart/pci_certified.png';
import securePaymentImage from '@/public/images/cart/secure_payment.png';
import verifiedMerchantImage from '@/public/images/cart/verfied_merchant.png';
import { useCheckout } from '@/components/contexts/CheckoutContext';
import useCartService from '@/lib/hooks/useCartStore';
import { useState } from 'react';

function ModalLayout({
  open,
  onClose,
  children,
  activeStep,
  width = '450px',
  height = '530px',
  borderRadius = '20px',
  closable = true,
  padding = '1rem',
}) {
  const {
    buttonDisabled,
    onContinue,
    goToMobile,
    goToAddress,
    isLoading,
    goToStep,
  } = useCheckout();


  const { itemsPrice} = useCartService();

  // const discount = 500;
  // const subtotal = itemsPrice-discount
  // const totalPrice = subtotal 
  // const price = 3699;
  const formattedPrice = itemsPrice.toLocaleString('en-PK', {
    style: 'currency',
    currency: 'PKR',
  });

  // const onMobileClick = () => {
  //   setStep(0);
  //   setSubSteps({ [0]: 0 });
  // };
  // const onAddressClick = () => {
  //   setStep(1);
  //   setSubSteps({ [1]: 0 });
  // };
  // console.log(totalPrice, itemsPrice)
  
  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 10 }}>
      <Paper
        className='modal-content-container'
        style={{
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoading && (
          <div className='loader-container'>
            <CircularProgress size={60} />
          </div>
        )}
        {/* Header */}
        <div className='modal-header sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4'>
          <Link href='/' className='text-lg font-semibold'>
            <Image src='/logo.png' alt='logo' width={70} height={50} />
          </Link>
          <div className='steps-container flex items-center justify-center'>
            <div
              onClick={() => goToStep(0)}
              className={`step cursor-pointer ${activeStep === 0 ? 'active' : ''} ${activeStep > 0 ? 'complete' : ''} `}
            >
              {activeStep > 0 ? (
                <div className='flex items-center gap-1'>
                  <Check size={12} strokeWidth={4} />
                  <span>Mobile</span>
                </div>
              ) : (
                <span>Mobile</span>
              )}
            </div>
            <div
              className={`text-[10px] ${activeStep > 0 ? 'text-green-700' : 'dots'}`}
            >
              - - -
            </div>
            <div
              onClick={activeStep >= 1 ? () => goToStep(1) : () => {}}
              className={`step ${activeStep >= 1 ? ' cursor-pointer' : ''} ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'complete' : ''} `}
            >
              {activeStep > 1 ? (
                <div className='flex items-center gap-1'>
                  <Check size={12} strokeWidth={4} />
                  <span>Address</span>
                </div>
              ) : (
                <span>Address</span>
              )}
            </div>
            <div
              className={`text-[10px] ${activeStep > 1 ? 'text-green-700' : 'dots'}`}
            >
              - - -
            </div>
            <div className={`step ${activeStep === 2 ? 'active' : ''}`}>
              Pay
            </div>
          </div>

          {closable && (
            <IconButton onClick={onClose}>
              <X />
            </IconButton>
          )}
        </div>

        {/* Main Content */}
        <div
          className='modal-body flex-1 overflow-y-auto p-4'
          style={{ padding }}
        >
          <div className=' flex flex-col gap-2'>
            <Accordion
              type='single'
              collapsible
              className='w-full rounded-lg bg-white px-2'
            >
              <AccordionItem value='item-1'>
                <AccordionTrigger>
                  <div className=' flex w-full items-center justify-between px-4'>
                    <div className='flex items-center justify-center gap-2'>
                      <ShoppingCart size={20}/>
                      <span className='text-sm'>Order Summary</span>
                    </div>
                    <span className='text-sm'>{formattedPrice}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <OrderSummary />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className='flex flex-1 mb-2 items-center justify-between rounded-lg bg-white p-4 font-medium'>
              <p className='font-semibold text-sm'>Login to Redeem Loyalty Points</p>
            </div>
          </div>
          {children}
        </div>

        {/* Footer */}
        <div className=' flex flex-col gap-2'>
          <div className='px-4'>
            <button
              className='btn btn-primary w-full'
              onClick={onContinue}
              disabled={buttonDisabled}
            >
              Continue
            </button>
          </div>

          <div className='modal-footer sticky bottom-0 flex items-center justify-between border-t bg-white p-3'>
            <div className='privacy-div'>T&C | Privacy</div>
            <div className='flex gap-2'>
              <Image src={pciImage} width={70} height={70} alt='pci image' />
              <Image
                src={securePaymentImage}
                width={70}
                height={70}
                alt='secure_payment image'
              />
              <Image
                src={verifiedMerchantImage}
                width={70}
                height={70}
                alt='verfied_merchant image'
              />
            </div>
            <div className='flex flex-col items-center justify-center gap-1'>
              <p>Powered by</p>
              <Image
                src='/images/Quick-Checkout.svg'
                alt='QuickCart'
                width={70}
                height={70}
              />
            </div>
          </div>
        </div>
      </Paper>
    </Modal>
  );
}

export default ModalLayout;
