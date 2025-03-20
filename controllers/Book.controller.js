const { Book, Comment, User } = require('../models');
const createError = require('../middlewares/error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ENV = require('../config');


// exports.addComment = async (req, res, next) => {
//     console.log("Données reçues :", req.body);
//     try {
//         const book = await Book.findByPk(req.params.id);
//         if (!book) {
//             console.log("Livre non trouvé");
//             return next(createError(404, "Livre non trouvé"));
//         }

//         const user = await User.findByPk(req.body.user_id);
//         if (!user) {
//             console.log("Utilisateur non trouvé");
//             return next(createError(404, "Utilisateur non trouvé"));
//         }

//         console.log("Création du commentaire...");
//         const newComment = await Comment.create({
//             text: req.body.text,
//             user_id: req.body.user_id,
//             book_id: req.params.id,
//             comment_date: new Date()
//         });

//         console.log("Commentaire ajouté :", newComment);
//         res.status(201).json({ message: "Commentaire ajouté avec succès", comment: newComment });
//     } catch (error) {
//         console.error("Erreur lors de l'ajout :", error);
//         next(createError(500, "Erreur lors de l'ajout du commentaire", error.message));
//     }
// };


// Détail d'un livre
exports.getBookDetails = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [{
                model: Comment,
                as: 'comments' // Alias défini dans la relation Book-Comment
            }]
        });

        if (!book) {
            return next(createError(404, "Livre non trouvé"));
        }

        // Assurez-vous que img_path est bien défini dans book
        const imagePath = book.img_path;  // L'URL de l'image dans la base de données

        // Passer le livre et l'image à la vue
        res.render('pages/bookDetail', {
            book, 
            comments: book.comments, 
            imagePath  // Passer imagePath dans la vue
        });
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



