console.log('Démarage du serveur...');

const express = require('express');
const ENV = require('./config');
const {db, Book}= require('./models');


const app = express();


// port
const PORT = ENV.PORT || 8000


// importation des routes
const userRouter = require('./router/user.router');
const bookRouter = require('./router/book.router');


// mettre le view engine en ejs
app.set('view engine', 'ejs');

// utiliser res.render pour générer un fichier page en ejs

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

// contact page
app.get('/contact', function(req, res) {
    res.render('pages/contact');
});


// Middleware pour analyser les corps codés en URL
app.use(express.urlencoded({ extended: true }));

// middlewares
app.use(express.json());


// prefix
app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);


//middlewares de gestion d'erreurs
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Une erreur est survenue";
    const details = err.details || null;

    res.status(status).json({error: {
        status,
        message,
        details
    }});
});


// serveur
const startServeur = async () => {
    try {
        await db.sync({ force: false }); //sert à synchroniser les modèles Sequelize à la bd en créant des tables si non existantes
        console.log('La base de données est synchronisée avec succès !');
        
        app.listen(PORT, () => {
            console.log(`Serveur en écoute sur le port ${PORT}`);
        });
    } catch (error) {
        console.log('Erreur de synchronisation à la base de données : ', error.message);
    }
}

startServeur(); // appeler la fonction


