const { Book, Comment, User } = require('../models');
const createError = require('../middlewares/error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ENV = require('../config');


// Ajouter un commentaire à un livre
exports.addComment = async (req, res, next) => {
    try {
        const book_id = req.params.id; // ID du livre depuis les paramètres de l'URL
        const { user_id, text } = req.body;

        // Validation des données requises
        if (!text || !user_id) {
           return next(createError(400, "Le texte du commentaire et l'ID de l'utilisateur sont requis"));
        }

        // Vérifier si le livre existe
        const book = await Book.findByPk(book_id);
        if (!book) {
            return next(createError(404, "Livre non trouvé"));
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(user_id);
        if (!user) {
            return next(createError(404, "Utilisateur non trouvé"));
        }

        // Créer le commentaire
        // Remarque : Pas besoin de vérifier l'existence d'un commentaire précédent
        // car la clé primaire inclut comment_date qui sera différente à chaque fois
        const comment_date = new Date(); // Date actuelle

        const newComment = await Comment.create({
            text,
            user_id,
            book_id,
            comment_date
        });

        res.status(201).json({
            message: "Commentaire ajouté avec succès",
            comment: newComment
        });
    } catch (error) {
        next(createError(500, "Erreur lors de l'ajout du commentaire", error.message));
    }
};


// Détail d'un livre
exports.getBookDetails = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [{
                model: Comment,
                as: 'comments' // Utilise l'alias 'comments' que tu as défini dans la relation
            }]
        });

        if (!book) {
            return next(createError(404, "Livre non trouvé"));
        }

        // Retourner le livre et ses commentaires
        res.status(200).json({ book, comments: book.comments });
    } catch (error) {
        next(createError(500, "Erreur lors de la récupération du livre", error.message));
    }
};


// Afficher la liste des livres
exports.getBooks = async (req, res, next) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        next(createError(500, "Erreur lors de la récupération des livres", error.message));
    }
};
