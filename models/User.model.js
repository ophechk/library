const { DataTypes } = require('sequelize');
const db = require('../config/db');

// définir le modèle (table users) avec Sequelize

const User = db.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'admin']]
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // le champ est requis
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // le champ est requis
      },
    registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timesTemps: true, // ajoute date création et modification
    underscored: true // mets des undescores pour les mots composés (snakeCase)
});

module.exports = User;
