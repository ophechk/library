const { DataTypes } = require('sequelize');
const db = require('..config/db');

const Comment = db.define('Comment', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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