const express = require('express');
const router = express.Router();
const bookController = require('../controllers/Book.controller');

router.get('/', bookController.getBooks); // Récupérer tous les livres
router.get('/:id', bookController.getBookDetails); // Récupérer les détails d'un livre

module.exports = router;
