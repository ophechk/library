const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/Comment.controller');
const { isAuthenticated, authMiddleware } = require('../middlewares/auth');

// Route protégée par l'authentification avec JWT
// router.post('/books/:book_id/comments', authMiddleware, CONTROLLER.addComment);
router.post('/:bookId/comments', CONTROLLER.addComment);

module.exports = router;
