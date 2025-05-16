/* eslint-disable import/order */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from "@/lib/dbConnect";
import CustomerModel from "@/lib/models/CustomerModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req) {
  try {
    await dbConnect();
    const { phoneNumber, amount } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get saved customer and payment method
    const customer = await CustomerModel.findOne({ phoneNumber });

    if (!customer || !customer.stripeCustomerId) {
      return NextResponse.json({ error: 'No saved payment method found' }, { status: 400 });
    }

    const selectedPaymentMethod = customer.paymentMethods.find((pm) => pm.isSelected);
    if (!selectedPaymentMethod || !selectedPaymentMethod.stripePaymentMethodId) {
      return NextResponse.json({ error: 'No valid payment method found' }, { status: 400 });
    }

    // Charge the saved card
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "pkr",
      customer: customer.stripeCustomerId,
      payment_method: selectedPaymentMethod.stripePaymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    console.log("..........",paymentIntent)
    return NextResponse.json({ success: true, paymentIntent }, { status: 200 });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
