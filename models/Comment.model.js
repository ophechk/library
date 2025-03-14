const { DataTypes } = require('sequelize');
const db = require('..config/db');


const Comment = db.define('Comment', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'books',
            key: 'id'
        }
    },
    comment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'comment',
    timestamps: false
});

module.exports = Comment;