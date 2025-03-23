console.log('🚀 Démarrage du serveur...');

const express = require('express');
const ENV = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, Book, User, Comment } = require('./models');

const app = express();

// IMPORTATIONS DES ROUTES
const userRouter = require('./router/user.router');
const bookRouter = require('./router/book.router');
const authRouter = require('./router/auth.router');
const commentRouter = require('./router/comment.router');

// PORT
const PORT = ENV.PORT || 8000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// Middleware pour analyser les corps codés en URL
app.use(express.urlencoded({ extended: true }));

// Configuration de EJS comme moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour les fichiers statiques (CSS, JS, images)
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
            req.userId = decoded.id;
            req.isAuthenticated = true;
        } else {
            req.isAuthenticated = false;
        }
    } catch (error) {
        req.isAuthenticated = false;
        res.clearCookie('access_token');
    }
    next();
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
app.use('/api/user', userRouter);
app.use('/api/book', bookRouter);
app.use('/api/auth', authRouter);
app.use('/api/comment', commentRouter);

// ROUTES PAGES
// index page
app.get('/', async (req, res) => {
    try {
        // Récupérer tous les livres depuis la base de données
        const books = await Book.findAll();

        res.render('pages/index', { 
            books,
            isAuthenticated: req.isAuthenticated
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des livres');
    }
});

// Route pour afficher tous les livres
app.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [{
                model: Comment,
                as: 'comments' // Utiliser l'alias approprié
            }]
        });
        
        res.render('pages/books', { 
            books,
            isAuthenticated: req.isAuthenticated,
            user: req.user // Optionnel, si vous avez besoin des infos utilisateur
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des livres');
    }
});



app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    as: 'comments', // Utiliser 'comments' si vous avez défini cet alias pour les commentaires
                    include: [
                        {
                            model: User,
                            as: 'user', // Assurez-vous que l'alias pour User est bien 'user'
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });

        if (!book) {
            return res.status(404).send('Livre non trouvé');
        }

        res.render('pages/bookDetail', { 
            book,
            comments: book.comments,  // Les commentaires sont associés avec 'comments'
            isAuthenticated: req.isAuthenticated,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des détails du livre');
    }
});


app.post('/books/:bookId/comments', async (req, res) => {
    const bookId = req.params.bookId;
    const userId = req.userId; // Récupérer l'ID utilisateur depuis le middleware
    const { text } = req.body; // Récupérer le texte du commentaire

    // Vérifier si le texte du commentaire est vide
    if (!text || text.trim() === '') {
        return res.status(400).send('Le commentaire ne peut pas être vide.');
    }

    try {
        // Vérifier si un commentaire existe déjà pour cet utilisateur et ce livre
        const existingComment = await Comment.findOne({
            where: {
                user_id: userId,
                book_id: bookId
            }
        });

        if (existingComment) {
            return res.status(400).send('Vous avez déjà commenté ce livre.');
        }

        // Si aucun commentaire existant, créer un nouveau commentaire
        await Comment.create({
            user_id: userId,
            book_id: bookId,
            text,  // Le texte est maintenant validé et non null
            comment_date: new Date()  // Utiliser la date actuelle pour le commentaire
        });

        res.redirect(`/books/${bookId}`);  // Rediriger vers la page du livre après l'ajout du commentaire
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'ajout du commentaire.');
    }
});

app.get('/gallery', (req, res) => {
    // Exemple de données d'images
    const images = [
        { src: '/images/AscenseurVerre.jpg', caption: 'Charlie et le grand ascenseur de verre' },
        { src: '/images/Chocolaterie.jpg', caption: 'Charlie et la chocolaterie' },
        { src: '/images/JamesGrossePeche.jpg', caption: 'James et la grosse pêche' },
        { src: '/images/LeBGG.jpg', caption: 'Le bon gros géant' },
        { src: '/images/LeDoigtMagique.jpg', caption: 'Le doigt magique' },
        { src: '/images/LesDeuxGredins.jpg', caption: 'Les deux gredins' },
        { src: '/images/MaitreRenard.jpg', caption: 'L\'incroyable maître renard' },
        { src: '/images/Matilda.jpg', caption: 'Matilda' },
        { src: '/images/MoiBoy.jpg', caption: 'Moi, Boy' },
        { src: '/images/PotionMagique.jpg', caption: 'George et la potion magique' },
        { src: '/images/SacreesSorcieres.jpg', caption: 'Sacrées Sorcières' }
    ];
    res.render('gallery', { 
        images: images,
        isAuthenticated: req.isAuthenticated,
        user: req.user
    });
});

app.get('/contact', (req, res) => {
    res.render('pages/contact', { 
        title: 'Contact',
        isAuthenticated: req.isAuthenticated,
        user: req.user
    });
});

// Si vous voulez gérer la soumission du formulaire (optionnel)
app.post('/contact/submit', (req, res) => {
    // Traitement des données du formulaire
    const { name, email, message } = req.body;
    
    // Traitement des données du formulaire
    // Envoyer un email, sauvegarder en base de données, etc.
    
    // Rediriger ou afficher un message de confirmation
    res.redirect('/contact?success=true');
});


// Gestion des pages et des formulaires
app.get('/login', (req, res) => {
    res.render('pages/login', { 
        query: req.query,
        title: 'Connexion',
        page: 'login'
    });
});

app.get('/register', (req, res) => {
    res.render('pages/register', { 
        title: 'Inscription',
        page: 'register'
    });
});

// Déconnexion
app.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/login?logout=true');
});

// Traitement des formulaires
app.post('/login', async (req, res) => {
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

        const token = jwt.sign({ id: user.id }, ENV.TOKEN, { expiresIn: '24h' });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false, // Mettre à true en mode production avec HTTPS
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 heures
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('pages/login', {
            title: 'Connexion',
            error: 'Une erreur est survenue lors de la connexion',
            email: req.body.email
        });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('pages/register', {
                title: 'Inscription',
                error: 'Les mots de passe ne correspondent pas',
                name,
                email
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.redirect('/login?registered=true');
    } catch (error) {
        console.error(error);
        res.render('pages/register', {
            title: 'Inscription',
            error: 'Erreur lors de l\'inscription: ' + error.message,
            name: req.body.name,
            email: req.body.email
        });
    }
});

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
