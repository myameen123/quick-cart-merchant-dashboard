/* eslint-disable import/order */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import CustomerModel from "@/lib/models/CustomerModel";

export async function POST(req) {
  try {
    await dbConnect(); // Ensure DB connection
    const { customerPhone, items, paymentMethod, paymentIntent } = await req.json();

    // Fetch the customer using the provided phone number
    const customer = await CustomerModel.findOne({ phoneNumber: customerPhone });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Extract the selected address
    const selectedAddress = customer.addresses.find((addr) => addr.isSelected);

    if (!selectedAddress) {
      return NextResponse.json({ error: "No selected address found" }, { status: 400 });
    }

    // Map items to match order schema
    const orderItems = items.map((item) => ({
      product: item._id,
      name: item.name,
      slug: item.slug,
      qty: item.qty,
      image: item.image,
      price: item.price,
    }));

    // Calculate total price
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Prepare order object
    const orderData = {
      customer: customer.phoneNumber, // Linking order with customer via phone number
      items: orderItems,
      shippingAddress: {
        fullName: selectedAddress.fullName,
        address: selectedAddress.fullAddress,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode,
        state: selectedAddress.state,
      },
      paymentMethod, // Accepts "COD" or "debit/credit card"
      itemsPrice: totalPrice,
      shippingPrice: 0, // Modify if you have dynamic shipping cost
      taxPrice: 0, // Modify if applicable
      totalPrice,
      isPaid: false, // Default false for COD, will be updated later
      paidAt: null,
    };

    // If payment is done via card, add payment details
    if (paymentMethod === "debit/credit card" && paymentIntent) {
      orderData.paymentResult = {
        transactionId: paymentIntent.id,
        chargeId: paymentIntent.latest_charge,
        status: paymentIntent.status,
        amountReceived: paymentIntent.amount_received / 100, // Convert cents to PKR
        currency: paymentIntent.currency.toUpperCase(),
        stripeCustomerId: paymentIntent.customer,
        emailAddress: paymentIntent.receipt_email,
      };
      orderData.isPaid = paymentIntent.status === "succeeded";
      orderData.paidAt = paymentIntent.status === "succeeded" ? new Date() : null;
    }

    // Save order in database
    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    return NextResponse.json({ message: "Order placed successfully", order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
