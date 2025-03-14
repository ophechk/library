console.log('Démarage du serveur...');

const express = require('express');
const ENV = require('./config');
const app = express();
const db = require('./config/db');

// importation des routes


// port
const PORT = ENV.PORT || 3000

// middlewares


// prefix


// serveur

const startServeur = async () => {
    try {
        await db.sync({ force: false }); //sert à synchroniser les modèles Sequelize à la bd en créant des tables si non existantes
        console.log('La base de données est synchronisée avec succès !');
        
        app.listen(PORT, () => {
            console.log('Le serveur fonctionne sur le port 3000');
        })
    } catch (error) {
        console.log('Erreur de synchronisation à la base de données : ', error.message);
    }
}

startServeur(); // appeler la fonction