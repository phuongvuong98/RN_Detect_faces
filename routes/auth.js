const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/forgot', authController.getForgot);

router.get('/verify', authController.getVerify);

router.post('/verify', authController.postVerify);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/update', authController.getUpdatePass);

router.post('/update', authController.postUpdatePass);

module.exports = router;