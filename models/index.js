const db = require('../config/db');

// Initialisation des modèles avec l'instance de connexion
const User = require('./User.model');
const Book = require('./Book.model');
const Category = require('./Category.model');
const Comment = require('./Comment.model');

// Associations...

// User <-> Comment (Un utilisateur peut avoir plusieurs commentaires)
User.hasMany(Comment, { 
  foreignKey: 'user_id',
  as: 'comments'  // Alias pour accéder aux commentaires d'un utilisateur
});
Comment.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'  // Alias pour accéder à l'utilisateur d'un commentaire
});

// Book <-> Comment (Un livre peut avoir plusieurs commentaires)
Book.hasMany(Comment, { 
  foreignKey: 'book_id',
  as: 'comments'  // Alias pour accéder aux commentaires d'un livre
});
Comment.belongsTo(Book, { 
  foreignKey: 'book_id',
  as: 'book'  // Alias pour accéder au livre d'un commentaire
});

// Category <-> Book (Une catégorie peut avoir plusieurs livres)
Category.hasMany(Book, { 
  foreignKey: 'category_id',
  as: 'books'  // Alias pour accéder aux livres d'une catégorie
});
Book.belongsTo(Category, { 
  foreignKey: 'category_id',
  as: 'category'  // Alias pour accéder à la catégorie d'un livre
});

module.exports = {
  db,
  User,
  Book,
  Category,
  Comment
};