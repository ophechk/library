const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assurez-vous d'importer le modèle User

// Routes GET : Affichage des pages
router.get('/login', (req, res) => {
    res.render('pages/login', { 
        query: req.query,
        title: 'Connexion',
        page: 'login'
    });
});

router.get('/register', (req, res) => {
    res.render('pages/register', { 
        title: 'Inscription',
        page: 'register'
    });
});

// Route de déconnexion
router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/login?logout=true');
});

// Route POST : Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('pages/login', {
                title: 'Connexion',
                error: 'Email ou mot de passe incorrect',
                email
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.TOKEN, { expiresIn: '1h' });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1h
        });

        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.render('pages/login', {
            title: 'Connexion',
            error: 'Une erreur est survenue lors de la connexion',
            email
        });
    }
});

// 🟢 Route POST : Inscription
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.render('pages/register', {
                title: 'Inscription',
                error: 'Cet email est déjà utilisé.',
                name,
                email
            });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.redirect('/login?registerSuccess=true');
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.render('pages/register', {
            title: 'Inscription',
            error: 'Une erreur est survenue lors de l\'inscription.',
            name,
            email
        });
    }
});

module.exports = router;
