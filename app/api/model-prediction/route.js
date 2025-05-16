/* eslint-disable import/order */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import CustomerModel from "@/lib/models/CustomerModel";

export async function POST(req) {
    const url = "https://fyp303-jzppl.eastus.inference.ml.azure.com/score";
    const apiKey = "FD0Kb3SlSniTzQdvZNsPB0cukE2kcjCEeBHK468uijr6VsoPiilDJQQJ99BCAAAAAAAAAAAAINFRAZML4J7U";

    try {
        await dbConnect();
        const { phoneNumber, items, itemsPrice } = await req.json();

        // Fetch customer details
        const customer = await CustomerModel.findOne({ phoneNumber });

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        // Fetch customer's past orders
        const customerOrders = await OrderModel.find({ customer: phoneNumber });

        // Check if the customer has order history
        const hasOrderHistory = customerOrders.length > 0;

        // Compute order-based historical metrics
        const totalPrices = hasOrderHistory ? customerOrders.map(order => order.totalPrice) : [];
        const avgOrderValue = hasOrderHistory ? totalPrices.reduce((a, b) => a + b, 0) / totalPrices.length : 0;
        const minOrderValue = hasOrderHistory ? Math.min(...totalPrices) : 0;
        const maxOrderValue = hasOrderHistory ? Math.max(...totalPrices) : 0;
        const successfulOrders = hasOrderHistory ? customerOrders.filter(order => order.isPaid).length : 0;
        const failedOrders = hasOrderHistory ? customerOrders.length - successfulOrders : 0;
        const totalOrderPriceSum = hasOrderHistory ? totalPrices.reduce((a, b) => a + b, 0) : 0;

        // Extract order month
        const orderMonth = new Date().getMonth() + 1;

        // Compute customer tenure (in months)
        const customerTenure = customer.createdAt
            ? Math.floor((new Date() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24 * 30))
            : 0; // Default 0 if no creation date

        let totalWeightedScore = 0;
        let totalPriceSum = 0;

        // Loop through each product in items and call model API
        for (const item of items) {
            const requestBody = {
                ProductPrice: item.price,
                QuantityOrdered: item.qty,
                OrderTotalPrice: itemsPrice,
                // OrderTotalPrice: totalOrderPriceSum, // Sum of all order prices (0 if no orders)
                ProductCategory: 0,
                DiscountAmount: 0,
                PaymentMethod: 0,
                OrderMonth: orderMonth,
                CustomerTenureMonths: customerTenure,
                AvgOrderValue_CustomerHistory: avgOrderValue,
                PreviousRefundedOrders_CustomerHistory: 10,
                PreviousSuccessfulOrders_ProductHistory: 10,
                PreviousFailedOrders_ProductHistory: 6,
                PreviousRefundedOrders_ProductHistory: 0,
                PreviousTotalOrders_ProductHistory: 57,
                MinOrderValue_CustomerHistory: minOrderValue,
                MaxOrderValue_CustomerHistory: maxOrderValue,
                PreviousSuccessfulOrders_CustomerHistory: successfulOrders,
                PreviousFailedOrders_CustomerHistory: failedOrders,
            };

            console.log("requestBody...",requestBody)
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                    "azureml-model-deployment": "fyp-risk-model--4"
                }
            });

            if (!response.ok) {
                return NextResponse.json({ error: `Model API request failed with status ${response.status}` }, { status: response.status });
            }

            const data = await response.json();
            const predictionScore = data['probabilities'][0][1]; // Get model score
            console.log("predictionScore", predictionScore)
            // Compute weighted sum for final prediction
            totalWeightedScore += item.price * predictionScore;
            totalPriceSum += item.price;
        }

        // Compute final weighted average prediction
        const finalPrediction = totalPriceSum > 0 ? totalWeightedScore / totalPriceSum : 0;
        console.log("finalPrediction", finalPrediction)
        return NextResponse.json({ message: "Final Prediction", finalPrediction }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
