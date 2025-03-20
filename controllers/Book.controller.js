const { Book, Comment, User } = require('../models');
const createError = require('../middlewares/error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ENV = require('../config');


exports.addComment = async (req, res, next) => {
    console.log("Données reçues :", req.body);
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            console.log("Livre non trouvé");
            return next(createError(404, "Livre non trouvé"));
        }

        const user = await User.findByPk(req.body.user_id);
        if (!user) {
            console.log("Utilisateur non trouvé");
            return next(createError(404, "Utilisateur non trouvé"));
        }

        console.log("Création du commentaire...");
        const newComment = await Comment.create({
            text: req.body.text,
            user_id: req.body.user_id,
            book_id: req.params.id,
            comment_date: new Date()
        });

        console.log("Commentaire ajouté :", newComment);
        res.status(201).json({ message: "Commentaire ajouté avec succès", comment: newComment });
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
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
