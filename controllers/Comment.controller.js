const { Book, Comment, User } = require('../models');
const createError = require('../middlewares/error');

exports.getCommentsByBook = async (req, res) => {
    try {
        const { book_id } = req.params;

        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.render('pages/bookDetail', { book });
                }

        const comments = await Comment.findAll({
            where: { book_id },
            include: {
                model: User,
                as: 'user',
                attributes: ['name']
            },
            order: [['comment_date', 'DESC']]
        });

        return res.render('pages/bookDetail', {
            book,
            comments,
            isAuthenticated: req.isAuthenticated
        }); // 🟢 "return" ajouté ici

    } catch (error) {
        return res.render('pages/bookDetail', { book, comments, isAuthenticated: req.isAuthenticated });

    }
};


// Exemple de fonction d'ajout de commentaire
exports.addComment = async (req, res) => {
    try {
        const { book_id } = req.params;  // Récupérer l'ID du livre
        const { text } = req.body;       // Récupérer le texte du commentaire


        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Le commentaire ne peut pas être vide.' });
        }
        
        const newComment = await Comment.create({
            book_id,
            user_id: req.userId,  // Assurer que 'req.userId' est disponible via le middleware 'isAuthenticated'
            text
        });

        res.status(201).json(newComment);  // Retourner le commentaire créé
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire' });
    }
};


// // Supprimer un commentaire
// exports.deleteComment = async (req, res, next) => {
//     try {
//         const comment = await Comment.findByPk(req.params.comment_id);

//         if (!comment) {
//             return next(createError(404, "Commentaire non trouvé"));
//         }

//         await comment.destroy();
//         res.status(200).json({ message: "Commentaire supprimé avec succès" });
//     } catch (error) {
//         next(createError(500, "Erreur lors de la suppression du commentaire", error.message));
//     }
// };


// exports.modifyComment = async (req, res, next) => {
//     try {
//         const comment = await Comment.findbyPk(req.params.comment_id);

//         if(! comment) {
//             return next(createError(404, "Commentaire non trouvé"));
//         }

//         await comment.modify();
//         res.status(200).json({message: "Commentaire modifié avec succès"});
//     } catch (error) {
//         next(createError(500, "Erreur lors de la modification du commentaire", error.message));
//     }
// };