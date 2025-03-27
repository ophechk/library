const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authMiddleware } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

// Page de profil
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.render('pages/profile', {
            title: 'Mon Profil',
            user: user,
            username: user.name, // Correction pour passer le bon nom d'utilisateur
            updateSuccess: req.query.update === 'success',
            error: req.query.error
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).send('Erreur lors du chargement du profil');
    }
});

// Mise à jour du nom d'utilisateur
router.post('/update/name', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findByPk(req.user.id);

        if (name) {
            user.name = name; // Correction du champ pour correspondre à la base de données
            await user.save();
            return res.redirect('/profile?update=success');
        }

        res.redirect('/profile?error=invalid_name');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error);
        res.status(500).redirect('/profile?error=update_failed');
    }
});

// Mise à jour du mot de passe
router.post('/update/password', authMiddleware, async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findByPk(req.user.id);

        if (password) {
            user.password = await bcrypt.hash(password, 10);
            await user.save();
            return res.redirect('/profile?update=success');
        }

        res.redirect('/profile?error=invalid_password');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
        res.status(500).redirect('/profile?error=update_failed');
    }
});

module.exports = router;
