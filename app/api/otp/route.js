/* eslint-disable import/order */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER; 
const client = require('twilio')(accountSid, authToken);
import { NextResponse } from 'next/server';

// export const POST =  async(req) => {
//     const { phoneNumber, otp } = await req.json()
//     console.log(phoneNumber, otp)
//     client.messages
//         .create({
//         body: `Your otp is ${otp}`,
//         to: `+92${phoneNumber}`, 
//         from: `${twilioNumber}`, 
//         })
//         .then((message) => console.log(message.sid));
//     return NextResponse.json(
//         { message: 'Card details added successfully'},
//         { status: 200 },
//       );
// }

export const POST = async (req) => {
    try {
        const { phoneNumber, otp } = await req.json();
        console.log(phoneNumber, otp);

        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            to: `+92${phoneNumber}`,
            from: `${twilioNumber}`,
        });

        return NextResponse.json(
            { message: 'OTP sent successfully', sid: message.sid },
            { status: 200 }
        );
    } catch (error) {
        console.error('Twilio Error:', error);

        // Handle specific Twilio errors
        if (error.code === 63038) {
            return NextResponse.json(
                { message: 'Daily message limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { message: 'Failed to send OTP. Please try again later.', error: error.message },
            { status: 500 }
        );
    }
};