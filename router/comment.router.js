const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/Comment.controller');
const { isAuthenticated, authMiddleware } = require('../middlewares/auth');

router.post('/:bookId/comments', CONTROLLER.addComment);
// Route pour mettre à jour un commentaire
// router.put('/:comment_id', isAuthenticated, CONTROLLER.modifyComment);
// // Route pour supprimer un commentaire
// router.delete('/:comment_id', isAuthenticated, CONTROLLER.deleteComment);

module.exports = router;
