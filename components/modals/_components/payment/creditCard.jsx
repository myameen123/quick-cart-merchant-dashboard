/* eslint-disable import/order */
import React from 'react'
import Image from 'next/image';
import { Delete, DeleteIcon, Trash2 } from 'lucide-react';
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
function CreditCard({card, onSelect}) {
   
  return (
    <label className={`mb-4 h-10   flex w-full justify-between border py-6 px-2 cursor-pointer flex-row items-center bg-white  text-sm shadow-inner debit-card ${card.isSelected?'border-black':''} rounded-md`}>
      <input
        className='hidden'
        type='radio'
        name='creditCard'
        checked={false}
        onChange={onSelect}
      />
    <div className='flex items-center gap-4 w-full'>
      <Image
        src={`${card.brand==="visa"?"/visa.svg":"/master_card.svg"}`}
        className=''
        alt='logo'
        width={60}
        height={60}
      />
      <p className=' w-full   '>
        {card.brand || 'Card'} &#8226;&#8226;&#8226;&#8226;  {card.last4}
      </p>
    </div>
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <button className='cross-btn'><Trash2 size={20} color='maroon'/></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do You Want to Delete this card?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>{console.log("hello")}}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      {/* Edit button */}
      {/* <button
        className='absolute bottom-2 right-2 text-blue-500 underline'
        onClick={onEdit}
        title='Edit'
        type='button'
      >
        <SquarePen size={15} />
      </button> */}
    </label>

  )
}

export default CreditCard
