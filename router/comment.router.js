const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/Comment.controller');

// Créer un commentaire (POST)
router.post('/books/:book_id/comments', CONTROLLER.addComment);

// Supprimer un commentaire (DELETE)
router.delete('/comments/:id', CONTROLLER.deleteComment);
module.exports = router;
