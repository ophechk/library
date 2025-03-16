const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.controller');

router.post('/register', userController.signup);
router.post('/login', userController.signin);
router.get('/all', userController.getAllUsers);

module.exports = router;
