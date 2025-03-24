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

// // Fonction de modification de commentaire
// exports.modifyComment = async (req, res) => {
//     try {
//         const { comment_id } = req.params;  // Récupérer l'ID du commentaire
//         const { text } = req.body;         // Récupérer le texte du commentaire

//         // Vérification si le commentaire existe
//         const comment = await Comment.findByPk(comment_id);
//         if (!comment) {
//             return res.status(404).json({ error: 'Commentaire non trouvé.' });
//         }

//         // Vérifier que l'utilisateur est bien l'auteur du commentaire
//         if (comment.user_id !== req.userId) {
//             return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier ce commentaire.' });
//         }

//         // Mise à jour du commentaire
//         comment.text = text; // Modifier le texte du commentaire
//         await comment.save(); // Sauvegarder les modifications

//         res.status(200).json(comment);  // Retourner le commentaire modifié
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erreur lors de la modification du commentaire' });
//     }
// };

// // Fonction de suppression de commentaire
// exports.deleteComment = async (req, res) => {
//     try {
//         const { comment_id } = req.params;  // Récupérer l'ID du commentaire

//         // Vérification si le commentaire existe
//         const comment = await Comment.findByPk(comment_id);
//         if (!comment) {
//             return res.status(404).json({ error: 'Commentaire non trouvé.' });
//         }

//         // Vérifier que l'utilisateur est bien l'auteur du commentaire
//         if (comment.user_id !== req.userId) {
//             return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer ce commentaire.' });
//         }

//         // Supprimer le commentaire
//         await comment.destroy();  // Supprimer le commentaire de la base de données

//         res.status(200).json({ message: 'Commentaire supprimé avec succès.' });  // Retourner un message de succès
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
//     }
// };

