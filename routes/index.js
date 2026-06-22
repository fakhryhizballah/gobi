const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const verifyToken = require('../middlewares/authMiddleware');
const { upload, upload_file_excel } = require('../middlewares/storage');
const media = require('../controllers/mediaController');


// Routes
router.get('/v1/dokumen/:user', verifyToken, controller.getAllDocuments);
router.post('/v1/dokumen', verifyToken, controller.postDocument);
router.delete('/v1/dokumen/:id', verifyToken, controller.deleteDocument);
router.put('/v1/dokumen/:id', verifyToken, controller.updateDocument);
router.post('/v1/upload/file/gaji', upload_file_excel.single('filename'), media.file);

module.exports = router;
