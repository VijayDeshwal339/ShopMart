const express = require("express");
const router = express.Router();
const AuthController = require('../controller/auth');
const ProductController = require('../controller/Product');

// auth
router.post("/send-otp",AuthController.sendotp);
router.post('/verify-otp',AuthController.verifyotp);
router.post("/login",AuthController.login);
router.post('/forgot-password',AuthController.forgetPassword);
router.post('/reset-password',AuthController.resetPassword);


// product
router.post('/create-product',ProductController.createProduct);




module.exports= router;
