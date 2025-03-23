const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assurez-vous d'importer le modèle User

// Route de connexion
router.get('/login', (req, res) => {
    res.render('pages/login');
});

// Route d'inscription
router.get('/register', (req, res) => {
    res.render('pages/register');
});

// Route pour se déconnecter
router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/login?logout=true');
});

// Vous pouvez ajouter des méthodes POST ou PUT pour traiter l'inscription et la connexion
// Exemple pour POST /login (vérification des identifiants)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.render('pages/login', {
                title: 'Connexion',
                error: 'Email ou mot de passe incorrect',
                email
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.render('pages/login', {
                title: 'Connexion',
                error: 'Email ou mot de passe incorrect',
                email
            });
        }
        
        const token = jwt.sign({ id: user.id }, process.env.TOKEN, { expiresIn: '24h' });
        
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('pages/login', {
            title: 'Connexion',
            error: 'Une erreur est survenue lors de la connexion',
            email: req.body.email
        });
    }
});

// Exporter le router
module.exports = router;
