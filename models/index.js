const db = require('..config/db');

// importer les modèles

const User = require('./user.model');
const Book = require('./book.model');
const Comment = require('./comment.model');
const Category = require('./category.model');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');
const { Sequelize } = require('sequelize');

// relation entre les modèles 

Category.hasMany(Book, {
  foreignKey: 'category_id',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Book.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Relation User 1:N Comment
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

// Relation Book 1:N Comment
Book.hasMany(Comment, {
  foreignKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Comment.belongsTo(Book, {
  foreignKey: 'book_id'
});

module.exports = {
  db,
  User,
  Book,
  Comment,
  Category,
  Sequelize
}