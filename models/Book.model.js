const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Book = db.define('Books', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category', // nom de la table référencée
            key: 'id'
        }
    }
}, {
    tableName: 'books',
    timestamps: false, // Désactive createdAt et updatedAt
    underscored: true // mets des undescores pour les mots composés (snakeCase)
});

module.exports = Book;