const db = require('..config/db');

// importer les modèles

const User = require('./user.model');
const Book = require('./book.model');
const Comment = require('./comment.model');
const Category = require('./category.model');