const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt');

// définir le modèle (table users) avec Sequelize

const User = db.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['admin', 'user']]
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        set(value) {
            // Hashage du mot de passe avant de le stocker
            const hashedPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashedPassword);
        }
    },
    registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timeStamps: false, // ajoute date création et modification
    underscored: true // mets des undescores pour les mots composés (snakeCase)
});

module.exports = User;
