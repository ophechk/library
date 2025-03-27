const express = require('express');
const router = express.Router();
const { Book } = require('../models');

router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        
        // Utilisez req.user qui devrait être défini par checkAuthStatus
        res.render('pages/index', {
            books,
            user: req.user, // Passez l'utilisateur à la vue
            loginSuccess: req.query.login === 'success' // Pour afficher un message de bienvenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des livres');
    }
});


module.exports = router;
