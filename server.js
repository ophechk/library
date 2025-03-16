console.log('Démarage du serveur...');

const express = require('express');
const ENV = require('./config');
const {db}= require('./models');

const app = express();

// importation des routes
const userRouter = require('./router/user.router');
const bookRouter = require('./router/book.router');

// Configuration du moteur de templates EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// port
const PORT = ENV.PORT || 8000

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


