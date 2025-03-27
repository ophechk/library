const express = require('express');
const router = express.Router();
const sendContactEmail = require('../services/mailer');  // Assure-toi d'importer le bon chemin

router.get('/contact', (req, res) => {
    res.render('contact');
  });

// Route pour traiter l'envoi du formulaire
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Appel de la fonction pour envoyer l'email
    await sendContactEmail(name, email, message);
    res.redirect('/contact?success=true');  // Redirection après succès
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.redirect('/contact?error=true');  // Redirection en cas d'erreur
  }
});

module.exports = router;
