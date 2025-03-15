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
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        next(createError(500, "Erreur lors de l'inscription", error.message));
    }
};
