const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Category = db.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'category',
    timestamps: false
});

module.exports = Category;