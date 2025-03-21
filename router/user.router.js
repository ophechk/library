const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/User.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/register', CONTROLLER.signup );
router.post('/sign', CONTROLLER.signin );
router.get('/all', CONTROLLER.getAllUsers );

// Routes protégées - nécessitent une authentification
// router.get('/users', authMiddleware, CONTROLLER.getAllUsers);
// router.get('/profile', authMiddleware, CONTROLLER.getUserProfile);
// ... autres routes protégées

module.exports = router;