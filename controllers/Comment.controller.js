const { Comment, Book, User } = require('../models');
const createError = require('../middlewares/error');

// Ajouter un commentaire
exports.addComment = async (req, res, next) => {
    try {
        const { book_id } = req.params;
        const { user_id, text } = req.body;

        if (!text || !user_id) {
            return next(createError(400, "Le texte du commentaire et l'ID de l'utilisateur sont requis"));
        }

        const book = await Book.findByPk(book_id);
        if (!book) return next(createError(404, "Livre non trouvé"));

        const user = await User.findByPk(user_id);
        if (!user) return next(createError(404, "Utilisateur non trouvé"));

        const newComment = await Comment.create({
            text,
            user_id,
            book_id,
            comment_date: new Date()
        });

        res.status(201).json({
            message: "Commentaire ajouté avec succès",
            comment: newComment
        });
    } catch (error) {
        next(createError(500, "Erreur lors de l'ajout du commentaire", error.message));
    }
};

// Récupérer les commentaires d'un livre
exports.getCommentsByBook = async (req, res, next) => {
    try {
        const book_id = req.params.book_id;
        const comments = await Comment.findAll({ where: { book_id } });

        if (!comments || comments.length === 0) {
            return next(createError(404, "Aucun commentaire trouvé pour ce livre"));
        }

        res.status(200).json(comments);
    } catch (error) {
        next(createError(500, "Erreur lors de la récupération des commentaires", error.message));
    }
};

// Supprimer un commentaire
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByPk(req.params.comment_id);

        if (!comment) {
            return next(createError(404, "Commentaire non trouvé"));
        }

        await comment.destroy();
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        next(createError(500, "Erreur lors de la suppression du commentaire", error.message));
    }
};
