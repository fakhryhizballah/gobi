const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const verifyToken = require('../middlewares/authMiddleware');

// Routes
router.get('/', verifyToken, controller.getAllDocuments);
router.post('/', verifyToken,controller.postDocument);
router.delete('/:id', verifyToken, controller.deleteDocument);
router.put('/:id', verifyToken, controller.updateDocument);

module.exports = router;
