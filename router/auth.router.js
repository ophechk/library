const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.controller'); // Pour gérer l'inscription/connexion

// Afficher les pages
router.get('/login', (req, res) => res.render('pages/login'));
router.get('/register', (req, res) => res.render('pages/register'));
router.get('/contact', (req, res) => res.render('pages/contact'));

// Gérer les soumissions de formulaires
router.post('/login', userController.signin);
router.post('/register', userController.signup);

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Simule l'enregistrement dans une base de données ou l'envoi d'un email
    try {
        console.log(`Message reçu de ${name} (${email}) : ${message}`);
        res.render('pages/contact', { successMessage: "Votre message a bien été envoyé !" });
    } catch (error) {
        res.render('pages/contact', { errorMessage: "Erreur lors de l'envoi du message." });
    }
});

module.exports = router;
