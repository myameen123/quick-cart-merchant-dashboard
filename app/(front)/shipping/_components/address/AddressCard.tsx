import { SquarePen } from 'lucide-react';
import React from 'react';

type AddressCardProps = {
  fullName: string;
  email: string;
  address: string;
  postalCode: string;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void; // Add an onEdit function prop
};

function AddressCard({
  fullName,
  email,
  address,
  postalCode,
  isSelected,
  onSelect,
  onEdit,
}: AddressCardProps) {
  return (
    <label className='card relative flex w-full cursor-pointer flex-row items-start border bg-white p-4 text-sm shadow-inner'>
      <input
        className='mr-3 mt-1'
        type='radio'
        name='address'
        checked={isSelected}
        onChange={onSelect}
      />
      <div>
        <p>
          <strong>{fullName}</strong>
        </p>
        <p className='w-fit rounded-full bg-slate-100 px-4 py-[2px] text-[10px] font-bold'>
          {email}
        </p>
        <p className='text-xs'>
          {address} {postalCode}
        </p>
      </div>
      {/* Edit button */}
      <button
        className='absolute bottom-2 right-2 text-blue-500 underline'
        onClick={onEdit}
        title='Edit'
        type='button'
      >
        <SquarePen size={15} />
      </button>
    </label>
  );
}

export default AddressCard;
