const dotenv = require('dotenv');

dotenv.config();

const ENV = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    USER: process.env.DB_USER, 
    PASSWORD: process.env.PASSWORD, 
    DATABASE: process.env.DATABASE, 
    DIALECT: process.env.DIALECT, 
    PORT_DATABASE: process.env.PORT_DATABASE,
    TOKEN: process.env.TOKEN, 
}

module.exports = ENV;