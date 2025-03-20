console.log('🚀 Démarrage du serveur...');

const express = require('express')
const ENV = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, Book, User } = require('./models');

const app = express()

// IMPORTATIONS DES ROUTES
const userRouter = require('./router/user.router');
const bookRouter = require('./router/book.router');

// PORT
const PORT = ENV.PORT || 8080

// MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use(cookieParser())
// Middleware pour analyser les corps codés en URL
app.use(express.urlencoded({ extended: true }));

// Configuration de EJS comme moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// PREFIX
app.use('/api/user', userRouter);
app.use('/api/book', bookRouter);

// MIDDLEWARE DE GESTION D'ERREURS
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Une erreur est survenue.";
    const details = err.details || null;
  
    res.status(status).json({ error : {
      status,
      message,
      details
    }})
})

// ROUTES PAGES
// index page
app.get('/', async (req, res) => {
    try {
        // Récupérer tous les livres depuis la base de données
        const books = await Book.findAll();

        // Rendre la vue 'index' et passer les livres à la vue
        res.render('pages/index', { books });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des livres');
    }
});

app.get('/books', async (req, res) => {
  try {
      // Récupérer tous les livres depuis la base de données
      const books = await Book.findAll();

      // Rendre la vue 'index' et passer les livres à la vue
      res.render('pages/books', { books });
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des livres');
  }
});

// Route pour afficher les détails d'un livre
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id); // Récupérer le livre par son ID
        if (!book) {
            return res.status(404).send('Livre non trouvé');
        }

        // Rendre la vue 'bookDetail' et passer les détails du livre
        res.render('pages/bookDetail', { book });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des détails du livre');
    }
});

// Route pour afficher le formulaire de contact
app.get('/contact', (req, res) => {
  res.render('pages/contact', { 
      title: 'Contact',
      // Autres variables à passer au template
  });
});

// Si vous voulez gérer la soumission du formulaire (optionnel)
app.post('/contact/submit', (req, res) => {
  // N'oubliez pas d'ajouter express.urlencoded() middleware pour parser les données du formulaire
  const { name, email, message } = req.body;
  
  // Traitement des données du formulaire
  // Envoyer un email, sauvegarder en base de données, etc.
  
  // Rediriger ou afficher un message de confirmation
  res.redirect('/contact?success=true');
});

// Routes pour l'authentification
// Affichage des formulaires
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

// Traitement des formulaires
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.render('pages/login', {
        title: 'Connexion',
        error: 'Email ou mot de passe incorrect',
        email
      });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.render('pages/login', {
        title: 'Connexion',
        error: 'Email ou mot de passe incorrect',
        email
      });
    }
    
    // Génération du Token d'authentification
    const token = jwt.sign({ id: user.id }, ENV.TOKEN, { expiresIn: '24h' });
    
    // Création du cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // à mettre à true pour HTTPS
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 heures
    });
    
    // Redirection après connexion réussie
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
    
    // Validation
    if (password !== confirmPassword) {
      return res.render('pages/register', {
        title: 'Inscription',
        error: 'Les mots de passe ne correspondent pas',
        name: name,
        email: email
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

// SERVEUR
const startServer = async () => {
    try{
      await db.sync({ force: false })
      console.log('✅ Database synced successfully !')
  
      app.listen(PORT, () => {
        console.log(`🚀 server running on http://localhost:${PORT}`);
      })
    }catch(error){
     console.error(`❌ Error syncing database : `, error.message);
      
    }
}
  
startServer();