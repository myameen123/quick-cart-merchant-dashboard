/* eslint-disable import/order */
import { NextResponse } from 'next/server';
import CustomerModel from '@/lib/models/CustomerModel';
import dbConnect from '@/lib/dbConnect';
import { getCardType } from '@/lib/cardValidator';

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { phoneNumber, cardDetails } = await req.json();

    if (!phoneNumber || !cardDetails) {
      return NextResponse.json(
        { message: 'Phone number and card details are required.' },
        { status: 400 },
      );
    }

    // Determine card type
    const cardType = getCardType(cardDetails.cardNumber);

    if (cardType === 'Invalid') {
      // console.log("wrong")
      return NextResponse.json(
        { message: 'Invalid card number. Only Visa and MasterCard are accepted.' },
        { status: 400 },
      );
    }
    console.log("card details...",cardDetails)
    console.log("cardType", cardType)
    // Find the customer by phone number
    const customer = await CustomerModel.findOne({ phoneNumber });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found.' },
        { status: 404 },
      );
    }

    // Update all existing payment methods to isSelected: false
    customer.paymentMethods = customer.paymentMethods.map((method) => ({
      ...method.toObject(),
      isSelected: false,
    }));

    // Add the new card details with detected card type and isSelected: true
    customer.paymentMethods.push({
      type: 'debit/credit card',
      cardDetails: {
        fullName: cardDetails.fullName,
        cardNumber: cardDetails.cardNumber,
        expiryDate: cardDetails.expiryDate,
        cvc: cardDetails.cvc,
        cardType: cardType || 'Visa', // Default fallback to Visa (if somehow undefined)
      },
      isSelected: true,
    });
    

    // Save the updated customer
    await customer.save();

    return NextResponse.json(
      { message: 'Card details added successfully.', data: customer },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in adding card details:', error);
    return NextResponse.json(
      { message: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const { phoneNumber, stripePaymentMethodId } = await req.json();

    if (!phoneNumber || !stripePaymentMethodId) {
      return NextResponse.json(
        {
          message: 'Phone number and payment method ID are required.',
        },
        { status: 400 },
      );
    }

    const customer = await CustomerModel.findOne({ phoneNumber });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found.' },
        { status: 404 },
      );
    }

    // Update isSelected for the selected payment method and reset others
    customer.paymentMethods = customer.paymentMethods.map(
      (method) =>
        method.stripePaymentMethodId.toString() === stripePaymentMethodId
          ? { ...method.toObject(), isSelected: true } // Set selected method
          : { ...method.toObject(), isSelected: false }, // Reset others
    );

    await customer.save();

    return NextResponse.json(
      { message: 'Payment method updated successfully.', data: customer },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
