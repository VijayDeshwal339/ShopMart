const UserModel = require("../model/user");
const OTPModel = require("../model/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const nodemailer = require("nodemailer");

class AuthController {

  // --------------------------------------sendotp ------------------------------------------//
static sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is already registered in UserModel
    const user = await UserModel.findOne({ email: email });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already registered!...",
      });
    }

    // Check if there is an existing OTP record for the email
    let existingUser = await OTPModel.findOne({ email: email });

    let otp;

    if (existingUser) {
      // If there is an existing OTP record, update the OTP
      otp = Math.floor(100000 + Math.random() * 900000);
      existingUser.otp = otp.toString(); // Convert OTP to string before saving
      await existingUser.save(); // Save the updated existingUser
    } else {
      // If there is no existing OTP record, create a new one
      otp = Math.floor(100000 + Math.random() * 900000);
      const otpRecord = new OTPModel({
        email: email,
        otp: otp.toString(), // Convert OTP to string before saving
      });

      // Save OTP in MongoDB
      await otpRecord.save();
    }

    // Nodemailer setup
    await sendOTPEmail(email, otp);

    res.status(200).json({ success: true, message: "Success", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --------------------------------------verifyotp ------------------------------------------//
static verifyotp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      otp,
    } = req.body;
    
    const user1 = await UserModel.findOne({ email: email });
    if (user1) {
      res.status(400).json({
        success: false,
        message: "User already registered!....",
      });
      return;
    }

    // Find the user with the given email and OTP
    // const user = await OTPModel.findOne({ email: email, otp: otp });
    const user = await OTPModel.findOne({ email: email, otp: otp }).maxTimeMS(10000);
    console.log("user", user);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check your email.",
      });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);

    // Check if OTP is expired (2 minutes duration)

    // If OTP is valid, create a new user in your main user collection with additional details
    const newUser = new UserModel({
      name:name,
      email: email,
      password: hashPassword,
    });
    // const newUser = await UserModel.create(d);

    await newUser.save();

    // Optionally, you can remove the OTP record from the OTPModel collection
    await OTPModel.deleteOne({ email: email, otp: otp });

    res.status(200).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" ,error});
  }
};



  
// --------------------------------------login ------------------------------------------//
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by their email address
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare the provided password with the hashed password stored in the database
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Return a JSON web token that contains the user's id as payload
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: '7d',
      });

      // Omit sensitive information (like password and __v) from the user object in the response
      const sanitizedUser = _.omit(user.toObject(), ['password', '__v']);

      res.status(200).json({ token, user: sanitizedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // --------------------------------------forget password ------------------------------------------//
static forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send("No account found with this email");
    }

    // Check if there is an existing OTP record for the email
    let existingUser = await OTPModel.findOne({ email: email });

    let otp;

    if (existingUser) {
      // If there is an existing OTP record, update the OTP
      otp = Math.floor(100000 + Math.random() * 900000);
      existingUser.otp = otp.toString(); // Convert OTP to string before saving
      await existingUser.save(); // Save the updated existingUser
    } else {
      // If there is no existing OTP record, create a new one
      otp = Math.floor(100000 + Math.random() * 900000);
      const otpRecord = new OTPModel({
        email: email,
        otp: otp.toString(), // Convert OTP to string before saving
      });

      // Save OTP in MongoDB
      await otpRecord.save();
    }

    // Send OTP via nodemailer
    await sendOTPEmail(email, otp);

    res.status(200).send(`Reset code sent successfully ${otp}`);
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).send("Internal Server Error");
  }
};

  
// --------------------------------------reset password ------------------------------------------//
static resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // Retrieve the user from the database based on the provided email
    let existingUser = await OTPModel.findOne({ email:email,otp:otp });

    if (!existingUser || existingUser.otp !== otp) {
      return res.status(400).send('Invalid OTP or Email');
    }
    await OTPModel.deleteOne({ email: email, otp: otp });
    // Hash the new password before saving it to the database
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Save the new password and clear the OTP in the database
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword} }
    );

    // Generate and sign a JWT
    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: '7d',
    });

    // Omit sensitive information from the user object in the response
    const sanitizedUser = _.omit(existingUser.toObject(), ['password', '__v']);

    res.status(200).json({ message: 'Password Reset Successfully', token, user: sanitizedUser });

  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).send("Internal Server Error");
  }
};

  
}






//---------------------------------- Function to send OTP via nodemailer--------------------------------//
async function sendOTPEmail(toEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:'Deshwalamit339@gmail.com',
      pass:"nuzu karl vsaz qeio"
    },
  });

  // Send OTP email
  const info = await transporter.sendMail({
    from: 'Deshwalamit339@gmail.com', // Update with your name and email
    to: toEmail,
    subject: "Email Verification OTP",
    text: `Your OTP for email verification is: ${otp}`,
    html: `<b>Your OTP for email verification is: ${otp}</b>`,
  });

  


}

module.exports = AuthController;

