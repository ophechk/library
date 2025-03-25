const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth'); // Assurez-vous d'importer le bon middleware

// Route GET pour afficher la galerie
router.get('/', authMiddleware, (req, res) => {
    const images = [
        { src: '/images/AscenseurVerre.jpg', caption: 'Charlie et le grand ascenseur de verre' },
        { src: '/images/Chocolaterie.jpg', caption: 'Charlie et la chocolaterie' },
        { src: '/images/JamesGrossePeche.jpg', caption: 'James et la grosse pêche' },
        { src: '/images/LeBGG.jpg', caption: 'Le bon gros géant' },
        { src: '/images/LeDoigtMagique.jpg', caption: 'Le doigt magique' },
        { src: '/images/LesDeuxGredins.jpg', caption: 'Les deux gredins' },
        { src: '/images/MaitreRenard.jpg', caption: 'L\'incroyable maître renard' },
        { src: '/images/Matilda.jpg', caption: 'Matilda' },
        { src: '/images/MoiBoy.jpg', caption: 'Moi, Boy' },
        { src: '/images/PotionMagique.jpg', caption: 'George et la potion magique' },
        { src: '/images/SacreesSorcieres.jpg', caption: 'Sacrées Sorcières' }
    ];

    res.render('pages/gallery', {  // Assurez-vous d'utiliser le bon chemin pour la vue
        images: images,
        user: req.user // Passe l'utilisateur connecté
    });
});


module.exports = router;
