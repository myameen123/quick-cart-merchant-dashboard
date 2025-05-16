const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER; 
const client = require('twilio')(accountSid, authToken);

const otpSent =  (req, res) => {
  switch (req.method) {
    case 'POST': {
      const { phoneNumber, otp } = req.body // destructuring phoneNumber and otp from req.body
     
        client.messages
        .create({
        body: `Your otp is ${otp}`,
        to: `+92${phoneNumber}`, 
        from: `${twilioNumber}`, 
        })
        .then((message) => console.log(message.sid));

        res.status(200).json({ message: 'OTP sent successfully' })
    }
  }

}

export default otpSent
