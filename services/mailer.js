const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilise le service de ton choix (ici Gmail)
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD, 
    },
    tls: {
        rejectUnauthorized: false  // Désactive la vérification du certificat SSL
    }
});

// Fonction pour envoyer l'email
const sendContactEmail = (name, email, message) => {
  const mailOptions = {
    from: email,
    to: process.env.MAIL_USER,  
    subject: 'Nouveau message - Library',
    text: `Vous avez reçu un message via le formulaire de contact.

      Nom: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendContactEmail;
