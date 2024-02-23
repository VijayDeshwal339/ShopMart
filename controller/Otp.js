// const OtpModel = require('../model/otp');

// // const otpGenterator = require('otp-generator');
// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const twilioClient = new twilio.Twilio(accountSid, authToken);


//  const sendotp = async (req,res) => {
//     try{

//     //  const otp = otpGenerator.generate(6, { upperCaseAlphabets:false});
//         return res.status(200).json({
//             success:true,
//             msg: 'Hello bro'
//         })
//     }
//     catch(error){
//         return res.status(400).json({
//             success:false,
//             msg: error.message
//         })
//     }
//  }

// module.exports = sendotp;

const twilio = require('twilio');

const accountSid = "ACc3e81d583f7b38ce9e0e1fd45295d9b4";
const authToken = "e2f157531bdfe4bef076af6e1fb81b21";
const twilioPhoneNumber = "+17626759873";

if (!accountSid) {
  throw new Error("Twilio Account SID is required");
}

if (!authToken) {
  throw new Error("Twilio Auth Token is required");
}

const twilioClient = new twilio.Twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log(`Message sent with SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    throw error;
  }
};

// Example usage:
const recipientPhoneNumber = '+1234567890'; // Replace with the recipient's phone number
const messageToSend = 'Hello, this is a test message!';

sendSMS(recipientPhoneNumber, messageToSend);
