/* eslint-disable import/order */
import dbConnect from '@/lib/dbConnect';
import CustomerModel from '@/lib/models/CustomerModel';
import { NextResponse } from 'next/server';

dbConnect();

export async function POST(req) {
  try {
    const { phoneNumber, addresses } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 },
      );
    }

    // Find the customer by phone number
    const customer = await CustomerModel.findOne({ phoneNumber });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 },
      );
    }

    // Ensure only one address has isSelected = true
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isSelected: false, // Reset all to false
    }));

    // Find the address marked as selected and update it
    const selectedAddress = addresses.find((address) => address.isSelected);
    if (selectedAddress) {
      const index = updatedAddresses.findIndex(
        (address) =>
          address.postalCode === selectedAddress.postalCode &&
          address.fullAddress === selectedAddress.fullAddress,
      );
      if (index !== -1) updatedAddresses[index].isSelected = true;
    }

    // Update the customer's addresses
    customer.addresses = updatedAddresses;

    // Save the updated customer document
    await customer.save();

    return NextResponse.json(
      { message: 'Address added successfully', data: customer },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// export async function POST(req) {
//   try {
//     const { phoneNumber, addresses } = await req.json();

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { message: 'Phone number is required' },
//         { status: 400 },
//       );
//     }

//     // Find the customer by phone number
//     const customer = await CustomerModel.findOne({ phoneNumber });

//     if (!customer) {
//       return NextResponse.json(
//         { message: 'Customer not found' },
//         { status: 404 },
//       );
//     }

//     // Add the new address to the customer's address array
//     customer.addresses = addresses;

//     // Save the updated customer document
//     await customer.save();

//     return NextResponse.json(
//       { message: 'Address added successfully', data: customer },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error('Error updating address:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 },
//     );
//   }
// }

export async function PUT(req) {
  try {
    const { phoneNumber, addressId, updatedAddress } = await req.json();

    if (!phoneNumber || !addressId || !updatedAddress) {
      return NextResponse.json(
        {
          message: 'Phone number, address ID, and updated address are required',
        },
        { status: 400 },
      );
    }

    const customer = await CustomerModel.findOne({ phoneNumber });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 },
      );
    }

    // Update isSelected for the selected address and reset others
    customer.addresses = customer.addresses.map(
      (address) =>
        address._id.toString() === addressId
          ? { ...address, ...updatedAddress } // Set isSelected: true for selected address
          : { ...address, isSelected: false }, // Reset others to false
    );

    await customer.save();

    return NextResponse.json(
      { message: 'Address updated successfully', data: customer },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling address request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// export async function PUT(req) {
//   try {
//     const { phoneNumber, addressId, updatedAddress } = await req.json();

//     if (!phoneNumber || !addressId || !updatedAddress) {
//       return NextResponse.json(
//         {
//           message: 'Phone number, address ID, and updated address are required',
//         },
//         { status: 400 },
//       );
//     }

//     const customer = await CustomerModel.findOne({ phoneNumber });

//     if (!customer) {
//       return NextResponse.json(
//         { message: 'Customer not found' },
//         { status: 404 },
//       );
//     }

//     const addressIndex = customer.addresses.findIndex(
//       (address) => address._id.toString() === addressId,
//     );

//     if (addressIndex === -1) {
//       return NextResponse.json(
//         { message: 'Address not found' },
//         { status: 404 },
//       );
//     }

//     customer.addresses[addressIndex] = {
//       ...customer.addresses[addressIndex],
//       ...updatedAddress, // Merge the updated address fields
//     };

//     await customer.save();

//     return NextResponse.json(
//       { message: 'Address updated successfully', data: customer },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error('Error handling address request:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 },
//     );
//   }
// }

export async function DELETE(req) {
  try {
    const { phoneNumber, addressId } = await req.json();

    if (!phoneNumber || !addressId) {
      return NextResponse.json(
        { message: 'Phone number and address ID are required' },
        { status: 400 },
      );
    }

    const customer = await CustomerModel.findOne({ phoneNumber });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 },
      );
    }

    // Remove the address with the given ID
    const updatedAddresses = customer.addresses.filter(
      (address) => address._id.toString() !== addressId,
    );

    if (updatedAddresses.length === customer.addresses.length) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 },
      );
    }

    customer.addresses = updatedAddresses;

    // Save the updated customer document
    await customer.save();

    return NextResponse.json(
      { message: 'Address deleted successfully', data: customer },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
