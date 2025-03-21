// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/User.controller'); // Ajustez le chemin selon votre structure
const authMiddleware = require('../middlewares/auth');

// Routes publiques
router.post('/signup', CONTROLLER.signup);
router.post('/signin', CONTROLLER.signin);
router.post('/signout', CONTROLLER.signout);

// Route protégée qui permet de vérifier si l'utilisateur est connecté
router.get('/check', authMiddleware, CONTROLLER.checkAuth);

module.exports = router;