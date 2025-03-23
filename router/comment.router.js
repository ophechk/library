const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/Comment.controller');

router.get('/books/:book_id/comments', CONTROLLER.getCommentsByBook);
router.post('/books/:book_id/comments', CONTROLLER.addComment);
router.delete('/comments/:id', CONTROLLER.deleteComment);
router.update('/comments/:id', CONTROLLER.modifyComment);

module.exports = router;
