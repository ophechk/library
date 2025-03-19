console.log('🚀 Démarrage du serveur...');

const express = require('express')
const ENV = require('./config');
const { db, Book } = require('./models');
const cors = require('cors');
const cookieParser = require('cookie-parser');


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


// mettre le view engine en ejs
app.set('view engine', 'ejs');

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



