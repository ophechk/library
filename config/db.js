const Sequelize = require('sequelize');
const ENV = require('./index');

console.log('Initialisation de la connexion à MySQL...');

const db = new Sequelize(ENV.DATABASE, ENV.USER, ENV.PASSWORD, {
    host: ENV.HOST,
    dialect : ENV.DIALECT,
    port : ENV.PORT_DATABASE,
    logging : false
})

const connection = async () => {
    try {
        console.log('Tentative de connexion...');
        await db.authenticate();
        console.log('Connexion réussie !');
        
    } catch (error) {
        console.log('Erreur de connexion : ', error.message);
    }
}

connection();

module.exports = db;