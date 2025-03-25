const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/User.controller');
const {authMiddleware} = require('../middlewares/auth');

router.get('/all', CONTROLLER.getAllUsers);
router.post('/register', CONTROLLER.signup);
router.post('/sign', CONTROLLER.signin);

module.exports = router;