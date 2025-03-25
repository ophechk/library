const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/contact', { 
        title: 'Contact',
        isAuthenticated: req.isAuthenticated,
        user: req.user
    });
});

// Si vous voulez gérer la soumission du formulaire (optionnel)
router.post('/submit', (req, res) => {
    // Traitement des données du formulaire
    const { name, email, message } = req.body;
    
    // Traitement des données du formulaire
    // Envoyer un email, sauvegarder en base de données, etc.
    
    // Rediriger ou afficher un message de confirmation
    res.redirect('/contact?success=true');
});

module.exports = router;