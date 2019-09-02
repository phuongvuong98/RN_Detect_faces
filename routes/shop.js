//const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.get("/api/cart", isAuth, shopController.getJsonCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/updatecart", isAuth, shopController.postUpdateCart);

router.get("/blog", shopController.getBlog);

router.get("/about", shopController.getAbout);

router.get("/contact", shopController.getContact);

router.get("/register", shopController.getRegister);

// router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// router.get("/orders", shopController.getOrders);

// router.post("/create-order", shopController.postCreateOrder);

router.post("/search", shopController.searchProduct);

router.post("/products/:productId", shopController.getComment);

// router.get("/product-detail", shopController.printComment);

module.exports = router;
