const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        // Récupérer tous les livres depuis la base de données
        const books = await Book.findAll();

        // Passer les livres et l'utilisateur à la vue
        res.render('pages/index', { 
            books,
            user: req.user // Passe l'utilisateur authentifié à la vue
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des livres');
    }
});


module.exports = router;
