const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ENV = require('../config');
const createError = require('../middlewares/error'); 


exports.signup = async (req, res, next) => {
  try{
    // Hachage de mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Création de l'utilisateur
    const user = await User.create({
        ...req.body,
        password: hashedPassword,
    })

    res.status(201).json({ message: "Utilisateur ajouté !"})
  }catch(error){
    next(createError(500, "Erreur lors de l'inscription", error.message))
  }
}


exports.signin = async (req, res, next) => {
  try{
    const user = await User.findOne({ where: { email: req.body.email }});
    if(!user) return next(createError(404, "Utilisateur non trouvé !"));
    
    // Vérification du mot de passe
    const comparePassword = await bcrypt.compare(req.body.password, user.password)
    if(!comparePassword) return next(createError(400, "Identifiants incorrects ! ")); 

    // Génération du Token d'authentification
    const token = jwt.sign({ id: user.id  }, ENV.TOKEN, { expiresIn: '24h'})

    // On exclut le mot de passe du résultat user
    const { password, ...userData } = user.dataValues;

    // Création du cookie
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: false, // a mettre à true pour HTTPS
        sameSite: 'strict', // Protège contre les attaques CSRF
        maxAge: 24 * 60 * 60 * 1000 // 24 heures en millisecondes
    })
    .status(200)
    .json(userData)
  }catch(error){
    next(createError(500, "Erreur lors de la connexion", error.message))
  }
}


exports.getAllUsers = async (req, res, next) => {
  try{
    const users = await User.findAll();
    res.status(200).json(users)
  }catch(error){
    next(createError(500, "Erreur lors de la récupération", error.message))
  }
};


// Vérifier si l'utilisateur est connecté
exports.checkAuth = async (req, res, next) => {
  try {
    // Si l'utilisateur arrive ici, c'est que le middleware auth a validé son token
    // On exclut le mot de passe du résultat user
    const { password, ...userData } = req.user.dataValues;
    
    res.status(200).json({
      isAuthenticated: true,
      user: userData
    });
  } catch (error) {
    next(createError(500, "Erreur lors de la vérification d'authentification", error.message));
  }
};


exports.signout = async (req, res, next) => {
  try {
    // Supprimer le cookie d'authentification
    res.clearCookie('access_token')
      .status(200)
      .json({ message: "Déconnexion réussie" });
  } catch (error) {
    next(createError(500, "Erreur lors de la déconnexion", error.message));
  }
};

