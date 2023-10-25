const express = require('express');
const imagemController = require('../controllers/imagem-controller');
const login = require('../middlewares/login-middleware');
const roles = require('../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = require('../multer');

const router = express.Router();

router.get('/image-data/:id', imagemController.getImageData);

router.get('/image/:id', imagemController.getImageById);

router.post('/post', upload.single('imagem'), imagemController.postImage);

router.use(errors());

module.exports = router;