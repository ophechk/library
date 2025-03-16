const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.controller');

router.post('/register', userController.signup);
router.post('/login', userController.signin);

module.exports = router;
