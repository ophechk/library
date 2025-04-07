const {DataTypes} = require('sequelize');
const db = require('../config/db');

const Category = db.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'category',
    timestamps: false, // Désactive createdAt et updatedAt
    underscored: true // mets des undescores pour les mots composés (snakeCase)
});

// // Définir la relation avec Book (si nécessaire)
// Category.associate = (models) => {
//     if (models.Book) {
//         Category.hasMany(models.Book, {
//             foreignKey: 'category_id',
//             as: 'books'
//         });
//     }
// };

module.exports = Category;