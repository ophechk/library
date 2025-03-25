const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers/Comment.controller');
const { isAuthenticated, authMiddleware } = require('../middlewares/auth');

router.post('/:bookId/comments', CONTROLLER.addComment);


module.exports = router;
