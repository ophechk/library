console.log('🚀 Démarrage du serveur...');

const express = require('express');
const ENV = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, User } = require('./models');

const app = express();

// IMPORTATIONS DES ROUTES
const userRouter = require('./router/user.router');
const bookRouter = require('./router/book.router');
const commentRouter = require('./router/comment.router');
const galleryRouter = require('./router/gallery.router');
const contactRouter = require('./router/contact.router');
const indexRouter = require('./router/index.router');
const profileRouter = require('./router/profile.router');



// PORT
const PORT = ENV.PORT || 8000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// Middleware pour analyser les corps codés en URL
app.use(express.urlencoded({ extended: true }));


// Configuration du moteur de vues EJS
app.set('view engine', 'ejs');
// Indique à Express de chercher les vues dans le dossier 'views/pages'
app.set('views', path.join(__dirname, 'views/pages'));
// Configuration des partials (dossier contenant les fichiers "head", "footer", etc.)
app.locals.partials = path.join(__dirname, 'views', 'partials');
// Configuration des fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// Middleware pour vérifier si l'utilisateur est authentifié via JWT
const isAuthenticated = (req, res, next) => {
    try {
        // Récupérer le token depuis les cookies
        const token = req.cookies.access_token;

        if (!token) {
            return res.redirect('/login?error=not_authenticated');
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, ENV.TOKEN);

        // Ajouter les informations de l'utilisateur à l'objet request
        req.userId = decoded.id;

        // Continuer vers la route protégée
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.clearCookie('access_token');
        return res.redirect('/login?error=invalid_token');
    }
};

// Middleware pour vérifier l'état de la connexion (optionnel, mais pratique)
const checkAuthStatus = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (token) {
            const decoded = jwt.verify(token, ENV.TOKEN);
            // Récupérer l'utilisateur
            User.findByPk(decoded.id)
                .then(user => {
                    if (user) {
                        req.user = user;
                        req.isAuthenticated = true;
                    } else {
                        req.isAuthenticated = false;
                    }
                    next();
                })
                .catch(error => {
                    console.error('Erreur de récupération utilisateur :', error);
                    req.isAuthenticated = false;
                    next();
                });
        } else {
            req.isAuthenticated = false;
            next();
        }
    } catch (error) {
        console.error('Erreur checkAuthStatus :', error);
        req.isAuthenticated = false;
        res.clearCookie('access_token');
        next();
    }
};

// Appliquer le middleware de vérification à toutes les routes
app.use(checkAuthStatus);

// Routes
// Route protégée
app.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            res.clearCookie('access_token');
            return res.redirect('/login?error=user_not_found');
        }

        res.render('pages/dashboard', { 
            title: 'Tableau de bord',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors du chargement du tableau de bord');
    }
});

// PREFIX
app.use('/api', userRouter);
app.use('/', bookRouter);
app.use('/api', commentRouter);
app.use('/', indexRouter);
app.use('/gallery', galleryRouter);
app.use(contactRouter); 
app.use('/', require('./router/auth.router'));
// Ajoutez cette ligne avec vos autres routes
app.use('/profile', require('./router/profile.router'));



// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Une erreur est survenue.";
    const details = err.details || null;

    res.status(status).json({
        error: {
            status,
            message,
            details
        }
    });
});

// SERVEUR
const startServer = async () => {
    try {
        await db.sync({ force: false });
        console.log('✅ Base de données synchronisée avec succès !');

        app.listen(PORT, () => {
            console.log(`🚀 Le serveur tourne : http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`❌ Erreur lors de la synchronisation à la base de données : `, error.message);
    }
};

startServer();
