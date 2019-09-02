//const path = require("path");

const express = require("express");

const utilController = require("../controllers/util");

const router = express.Router();

router.get("/women", utilController.getWomen);

router.get("/men", utilController.getMen);

router.get("/bag", utilController.getBag);

router.get("/shoes", utilController.getShoes);

router.get("/watches", utilController.getWatches);

router.post("/women", utilController.postWomen);

router.post("/men", utilController.postMen);

router.post("/bag", utilController.postBag);

router.post("/shoes", utilController.postShoes);

router.post("/watches", utilController.postWatches);

module.exports = router;
