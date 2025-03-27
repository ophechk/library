const express = require('express');
const router = express.Router();
const sendContactEmail = require('../services/mailer'); 

// Route GET pour afficher le formulaire de contact
router.get('/contact', (req, res) => {
  // Vérifier s'il y a un paramètre de succès ou d'erreur dans l'URL
  const success = req.query.success === 'true';
  const error = req.query.error === 'true';

  // Passer l'utilisateur à la vue, même pour la page de contact
  res.render('pages/contact', { 
    success, 
    error, 
    user: req.user // Passe l'utilisateur à la vue
  });  
});

// Route POST pour traiter l'envoi du formulaire de contact
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Vérifier que tous les champs sont remplis
    if (!name || !email || !message) {
      return res.redirect('/contact?error=true');  // Rediriger si des champs sont manquants
    }

    // Appel de la fonction pour envoyer l'email
    await sendContactEmail(name, email, message);

    // Redirection vers la page de contact avec succès
    res.redirect('/contact?success=true');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.redirect('/contact?error=true');  // Redirection en cas d'erreur
  }
});

module.exports = router;
