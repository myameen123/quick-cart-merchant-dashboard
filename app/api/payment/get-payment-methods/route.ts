/* eslint-disable import/order */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import CustomerModel from "@/lib/models/CustomerModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(req: Request) {
  try {
    // Extract phone number from query params
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get("phoneNumber");

    if (!phoneNumber) {
      return NextResponse.json({ error: "Missing phoneNumber" }, { status: 400 });
    }

    await dbConnect();

    // Find customer in the database
    const customer = await CustomerModel.findOne({ phoneNumber });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Retrieve payment methods
    const paymentMethods = await Promise.all(
      customer.paymentMethods.map(async (method) => {
        try {
          // Fetch the payment method details from Stripe
          if (!method.stripePaymentMethodId) {
            throw new Error("stripePaymentMethodId is undefined");
          }
          const paymentMethod = await stripe.paymentMethods.retrieve(method.stripePaymentMethodId);
          return {
            id: method.stripePaymentMethodId,
            last4: paymentMethod.card?.last4, // Masked card number
            brand: paymentMethod.card?.brand, // Visa, MasterCard, etc.
            isSelected: method.isSelected,
          };
        } catch (error) {
          console.error("Error retrieving payment method:", error);
          return null; // Skip invalid or deleted payment methods
        }
      })
    );

    // Filter out any null values (in case of errors)
    const validPaymentMethods = paymentMethods.filter((pm) => pm !== null);

    return NextResponse.json({ paymentMethods: validPaymentMethods }, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
