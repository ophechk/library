console.log('🚀 Démarrage du serveur...');

const express = require('express')
const ENV = require('./config');
const { db, Book } = require('./models');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express()

// Au début de votre fichier, après avoir initialisé l'app
app.use(express.urlencoded({ extended: true }));

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
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Ici, vous devrez implémenter la logique d'authentification
  // Vérification de l'email et du mot de passe dans la base de données
  // Utilisation de bcrypt pour comparer les mots de passe, etc.
  
  // Exemple simplifié :
  if (email === 'user@example.com' && password === 'password') {
      // Créez une session ou un JWT
      // req.session.userId = user.id; // Si vous utilisez express-session
      
      res.redirect('/dashboard'); // Redirection après connexion réussie
  } else {
      res.render('pages/login', {
          title: 'Connexion',
          error: 'Email ou mot de passe incorrect',
          email: email
      });
  }
});

app.post('/register', (req, res) => {
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
  
  // Vérifiez si l'email existe déjà dans la base de données
  
  // Hashage du mot de passe avec bcrypt
  // Création de l'utilisateur dans la base de données
  
  // Exemple simplifié :
  // const hashedPassword = await bcrypt.hash(password, 10);
  // await User.create({ name, email, password: hashedPassword });
  
  res.redirect('/login?registered=true');
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



