const express = require('express');
const router = express.Router();
const { Book, Comment, User } = require('../models'); // Adapter selon tes imports
const {authMiddleware} = require('../middlewares/auth');

router.get('/books', authMiddleware, async (req, res) => {
    try {
        // Récupérer tous les livres depuis la base de données
        const books = await Book.findAll();

        // Passer les livres et l'utilisateur à la vue
        res.render('pages/books', {
            books,
            user: req.user // Passe l'utilisateur authentifié à la vue
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des livres');
    }
});


// Route pour afficher les détails d'un livre
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    as: 'comments',
                    include: [{ 
                        model: User, 
                        as: 'user', 
                        attributes: ['name'] 
                    }]
                }
            ]
        });

        if (!book) {
            return res.status(404).send('Livre non trouvé');
        }

        res.render('pages/bookDetail', { 
            book,
            comments: book.comments,
            isAuthenticated: req.isAuthenticated,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des détails du livre');
    }
});

// Route pour ajouter un commentaire
// Route pour ajouter un commentaire
router.post('/:bookId/comments', async (req, res) => {
    const bookId = req.params.bookId;
    const userId = req.user.id; // Utilise req.user.id, pas req.userId
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).send('Le commentaire ne peut pas être vide.');
    }

    try {
        const existingComment = await Comment.findOne({
            where: {
                user_id: userId,
                book_id: bookId
            }
        });

        if (existingComment) {
            return res.status(400).send('Vous avez déjà commenté ce livre.');
        }

        await Comment.create({
            user_id: userId,
            book_id: bookId,
            text,
            comment_date: new Date()
        });

        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'ajout du commentaire.');
    }
});

// Route pour ajouter un commentaire (vérification du double post)
router.post('/books/:bookId/comments', async (req, res) => {
    const bookId = req.params.bookId;
    const userId = req.user.id; // Utilise req.user.id ici aussi
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).send('Le commentaire ne peut pas être vide.');
    }

    try {
        const existingComment = await Comment.findOne({
            where: {
                user_id: userId,
                book_id: bookId
            }
        });

        if (existingComment) {
            return res.status(400).send('Vous avez déjà commenté ce livre.');
        }

        await Comment.create({
            user_id: userId,
            book_id: bookId,
            text,
            comment_date: new Date()
        });

        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'ajout du commentaire.');
    }
});



// Route pour ajouter un commentaire
router.post('/books/:bookId/comments', async (req, res) => {
    const bookId = req.params.bookId;
    const userId = req.userId; // Récupérer l'ID utilisateur depuis le middleware
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).send('Le commentaire ne peut pas être vide.');
    }

    try {
        const existingComment = await Comment.findOne({
            where: {
                user_id: userId,
                book_id: bookId
            }
        });

        if (existingComment) {
            return res.status(400).send('Vous avez déjà commenté ce livre.');
        }

        await Comment.create({
            user_id: userId,
            book_id: bookId,
            text,
            comment_date: new Date()
        });

        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'ajout du commentaire.');
    }
});

module.exports = router;
