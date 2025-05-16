/* eslint-disable import/order */
import dbConnect from '@/lib/dbConnect';
import CustomerModel from '@/lib/models/CustomerModel';
import { NextResponse } from 'next/server';

dbConnect();

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 },
      );
    }

    // Check if customer exists
    let customer = await CustomerModel.findOne({ phoneNumber });

    if (customer) {
      // Customer already exists, return their information
      return NextResponse.json(
        { message: 'Customer found', data: customer },
        { status: 200 },
      );
    }

    // Create a new customer if not found
    customer = await CustomerModel.create({ phoneNumber });

    return NextResponse.json(
      { message: 'Customer created successfully', data: customer },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error handling customer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
