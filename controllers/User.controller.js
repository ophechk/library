const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ENV = require('../config');
const createError = require('../middlewares/error');

exports.signup = async (req, res, next) => {
    try {
        console.log('Données reçues :', req.body);

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log('Mot de passe hashé avec succès.');

        const user = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        console.log('Utilisateur créé :', user);
        res.status(201).json({ message: "Utilisateur crée" });

    } catch (error) {
        next(createError(500, "Erreur lors de l'inscription", error.message));
    }
};

exports.signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return next(createError(404, "Utilisateur non trouvé"));

        //Vérification du mdp
        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        if (!comparePassword) return next(createError(400, "Identifiants incorrects"));

        // Génération du token
        const token = jwt.sign({ id: user.id }, ENV.TOKEN, { expiresIn: '24h' });

        // On exclut le mdp du résultat user
        const { password, ...userData } = user.dataValues;

        // Création du cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false, // mettre à true pour https
            sameSite: 'strict', // protège contre les attaques CSRF
            maxAge: 24 * 60 * 60 * 1000 // 24h en millisecondes
        })
            .status(200)
            .json(userData)
    } catch (error) {
        next(createError(500, "Erreur lors de la connexion", error.message));
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(createError(500, "Erreur lors de la récupération", error.message));
    }
}