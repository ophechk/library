const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.controller');

router.get('/all', userController.getAllUsers);

router.post('/register', userController.signup);
router.post('/login', userController.signin);


module.exports = router;
