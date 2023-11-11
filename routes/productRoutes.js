import express from 'express'
import {requireSignIn,isAdmin} from '../middleware/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteproductController, getphotoController, getproductController, getsingleProductController, productCategoryController, productCountController, productFiltersController, productListController, relatedProductController, searchProductController, updateproductController } from '../controller/productcontroller.js';
import formidable from 'express-formidable'

const router = express.Router();

//creating a product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//get products
router.get('/get-products',getproductController)

//get a single product
router.get('/single-product/:slug',getsingleProductController)

//for photo
router.get('/product-photo/:pid',getphotoController)

//delete product
router.delete('/delete-product/:pid',deleteproductController)

//update product 
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateproductController)

//filter routes
router.post('/product-filters',productFiltersController)

//product count : for faster loading 
router.get('/product-count',productCountController)

//product-per-page
router.get('/product-list/:page',productListController)

//search product
router.get('/search/:keyword',searchProductController)

//similar product
router.get('/related-product/:pid/:cid',relatedProductController)

//category-wise products
router.get('/product-category/:slug',productCategoryController)

//payments route: token for verifying the user's account
router.get('/braintree/token',braintreeTokenController)

//payments rute
router.post('/braintree/payment',requireSignIn,braintreePaymentController)

//payment using striper
// router.post('/create-checkout-session',requireSignIn,stripePaymentController)
export default router