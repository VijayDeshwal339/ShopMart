const express = require("express");
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controller/auth');
const BrandController = require('../controller/Brand');
const CartController = require('../controller/Cart');
const CategoriesController = require('../controller/Categories');
const OrderController = require('../controller/Order');
const UserController = require('../controller/User');
const ProductController = require('../controller/Product');

// auth
// router.post("/send-otp",AuthController.sendotp);
// router.post('/verify-otp',AuthController.verifyotp);
// router.post("/login",AuthController.login);
// router.post('/forgot-password',AuthController.forgetPassword);
// router.post('/reset-password',AuthController.resetPassword);
router.post('/signup', AuthController.createUser);
router.post('/login', passport.authenticate('local'), AuthController.loginUser);
router.get('/check',passport.authenticate('jwt'), AuthController.checkAuth);
router.get('/logout', AuthController.logout);
router.post('/reset-password-request', AuthController.resetPasswordRequest);
router.post('/reset-password', AuthController.resetPassword);


// Brand
router.get('/', BrandController.fetchBrands);
router.post('/', BrandController.createBrand);

// product
// router.post('/create-product',ProductController.createProduct);
router.post('/', ProductController.createProduct);
router.get('/', ProductController.fetchAllProducts);
router.get('/:id', ProductController.fetchProductById);
router.patch('/:id', ProductController.updateProduct);

// Cart
router.post('/', CartController.addToCart);
router.get('/', CartController.fetchCartUser);
router.delete('/:id', CartController.deleteFromCart);
router.patch('/:id', CartController.updateCart);


// Categories
router.get('/', CategoriesController.fetchCategories);
router.post('/', CategoriesController.createCategory);


// Order
router.post('/', OrderController.createOrder);
router.get('/own/', OrderController.fetchOrdersByUser);
router.delete('/:id', OrderController.deleteOrder);
router.patch('/:id', OrderController.updateOrder);
router.get('/', OrderController.fetchAllOrders);

// User
router.get('/own', UserController.fetchUserById);
router.patch('/:id', UserController.updateUser);



module.exports= router;
