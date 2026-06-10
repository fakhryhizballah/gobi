const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const verifyToken = require('../middlewares/authMiddleware');

// Routes
router.get('/v1', verifyToken, controller.getAllDocuments);
router.post('/v1', verifyToken, controller.postDocument);
router.delete('/v1/:id', verifyToken, controller.deleteDocument);
router.put('/v1/:id', verifyToken, controller.updateDocument);

module.exports = router;
