const { Book, Comment, User } = require('../models');
const createError = require('../middlewares/error');

// Détail d'un livre
exports.getBookDetails = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [{
                model: Comment,
                as: 'comments'
            }]
        });

        if (!book) {
            return next(createError(404, "Livre non trouvé"));
        }

        // Récupérer le chemin de l'image depuis la base de données
        const imagePath = book.img_path;  // On suppose que book.img_path contient le chemin relatif

        // Transmettre book et imagePath à la vue
        res.render('pages/bookDetail', {
            book,
            comments: book.comments,
            imagePath // On passe imagePath à la vue
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



