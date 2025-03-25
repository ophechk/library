// middlewares/auth.js

const jwt = require('jsonwebtoken');
const ENV = require('../config');  // Assure-toi que ton fichier config.js contient la clé TOKEN
const { User } = require('../models');
const createError = require('./error');

// Middleware pour vérifier le token JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token depuis les cookies
    const token = req.cookies.access_token;

    // Vérifier si le token existe
    if (!token) {
      return next(createError(401, "Authentification requise"));
    }

    // Vérifier et décoder le token
    const decodedToken = jwt.verify(token, ENV.TOKEN);

    // Vérifier que l'utilisateur existe toujours en base de données
    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      return next(createError(401, "Utilisateur non trouvé"));
    }

    // Ajouter l'utilisateur décodé à l'objet requête
    req.user = user;

    // Passer au middleware suivant
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, "Token invalide"));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, "Session expirée, veuillez vous reconnecter"));
    }
    next(createError(500, "Erreur d'authentification", error.message));
  }
};

// Exports
module.exports = { 
  authMiddleware
};
