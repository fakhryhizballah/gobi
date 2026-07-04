const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const verifyToken = require('../middlewares/authMiddleware');
const { upload, upload_file_excel } = require('../middlewares/storage');
const media = require('../controllers/mediaController');
const logger = require('../controllers/loggerController');



// Routes
router.get('/v1/dokumen/:user', verifyToken, controller.getAllDocuments);
router.post('/v1/dokumen', verifyToken, controller.postDocument);
router.delete('/v1/dokumen/:id', verifyToken, controller.deleteDocument);
router.put('/v1/dokumen/:id', verifyToken, controller.updateDocument);

router.post('/v1/upload/file/gaji', verifyToken, upload_file_excel.single('filename'), media.fileGaji);
router.delete('/v1/upload/file/gaji', verifyToken, media.deleteFile);
router.get('/v1/find/gaji/asn', media.findGajiAsn);
router.post('/v1/upload/file/tpp', verifyToken, upload_file_excel.single('filename'), media.fileTPP);
router.delete('/v1/upload/file/tpp', verifyToken, media.deleteFileTPP);
router.get('/v1/find/gaji/tpp', media.findTPPAsn);

router.get('/v1/logs', logger.getAllLogs);
router.post('/v1/logs', logger.createLog);
router.delete('/v1/logs', verifyToken, logger.delLog);

module.exports = router;
