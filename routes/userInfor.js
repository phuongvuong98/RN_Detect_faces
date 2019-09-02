const express = require('express');

const accountController = require('../controllers/userInfor');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/account', accountController.getChangePassword);

router.post('/account', accountController.postChangePassword);


module.exports = router;