const express = require('express');
const router = express.Router();
const bookController = require('../controllers/Book.controller');

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookDetails);
router.post('/:id/comments', bookController.addComment);

module.exports = router;
