/* eslint-disable import/order */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import CustomerModel from "@/lib/models/CustomerModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});


export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { phoneNumber, paymentMethodId } = await req.json();
    if (!phoneNumber || !paymentMethodId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find user by phoneNumber
    let customer = await CustomerModel.findOne({ phoneNumber });

    // Create Stripe Customer if not exists
    let stripeCustomerId = customer?.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        description: `Customer for ${phoneNumber}`,
      });
      stripeCustomerId = stripeCustomer.id;

      // Save Stripe Customer ID in database
      if (!customer) {
        customer = await CustomerModel.create({
          phoneNumber,
          stripeCustomerId,
          paymentMethods: [],
        });
      } else {
        customer.stripeCustomerId = stripeCustomerId;
      }
    }

    // Attach Payment Method to the Customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });

    // Ensure only the new payment method is selected, set others to false
    if (customer) {
      customer.paymentMethods.forEach((method) => {
        method.isSelected = false; // Deselect all existing payment methods
      });

      customer.paymentMethods.push({
        type: "debit/credit card",
        stripeCustomerId,
        stripePaymentMethodId: paymentMethodId,
        isSelected: true, // Only the new card is selected
      });

      await customer.save();
    } else {
      return NextResponse.json({ error: "Customer not found" }, { status: 500 });
    }

    return NextResponse.json({ message: "Payment method saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving payment method:", error);

    if (error instanceof Stripe.errors.StripeCardError) {
      return NextResponse.json(
        { error: error.message || "Your card was declined.", decline_code: error.decline_code },
        { status: 402 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// export async function POST(req: Request) {
//   try {
//     await dbConnect();
    
//     const { phoneNumber, paymentMethodId } = await req.json();
//     if (!phoneNumber || !paymentMethodId) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Find user by phoneNumber
//     let customer = await CustomerModel.findOne({ phoneNumber });

//     // Create Stripe Customer if not exists
//     let stripeCustomerId = customer?.stripeCustomerId;
//     if (!stripeCustomerId) {
//       const stripeCustomer = await stripe.customers.create({
//         description: `Customer for ${phoneNumber}`,
//       });
//       stripeCustomerId = stripeCustomer.id;

//       // Save Stripe Customer ID in database
//       if (!customer) {
//         customer = await CustomerModel.create({
//           phoneNumber,
//           stripeCustomerId,
//           paymentMethods: [],
//         });
//       } else {
//         customer.stripeCustomerId = stripeCustomerId;
//       }
//     }

//     // Attach Payment Method to the Customer
//     await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });

//     // Ensure only the new payment method is selected, set others to false
//     if (customer) {
//       customer.paymentMethods.forEach((method) => {
//         method.isSelected = false; // Deselect all existing payment methods
//       });

//       customer.paymentMethods.push({
//         type: "debit/credit card",
//         stripeCustomerId,
//         stripePaymentMethodId: paymentMethodId,
//         isSelected: true, // Only the new card is selected
//       });

//       await customer.save();
//     } else {
//       return NextResponse.json({ error: "Customer not found" }, { status: 500 });
//     }

//     return NextResponse.json({ message: "Payment method saved successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Error saving payment method:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
