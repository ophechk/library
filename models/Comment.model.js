const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Comment = db.define('Comment', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,  // Définir comme clé primaire
        references: {
            model: 'users',
            key: 'id'
        }
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,  // Définir comme clé primaire
        references: {
            model: 'books',
            key: 'id'
        }
    },
    comment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'comment',
    timestamps: false,
    underscored: true, // utilise snake_case
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'book_id', 'comment_date']  // Définir l'unicité de cette combinaison
        }
    ]
});

// // Définir les relations avec User et Book
// Comment.associate = (models) => {
//     Comment.belongsTo(models.User, {
//         foreignKey: 'user_id',
//         as: 'user'
//     });

//     Comment.belongsTo(models.Book, {
//         foreignKey: 'book_id',
//         as: 'book'
//     });
// };

module.exports = Comment;
