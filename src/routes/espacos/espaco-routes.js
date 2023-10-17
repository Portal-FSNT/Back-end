const express = require('express');
const espacoController = require('../../controllers/espacos/espaco-controller');
const login = require('../../middlewares/login-middleware');
const roles = require('../../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const upload = require('../../multer');

router = express.Router();

router.get('/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id: Joi.number(),
        nome: Joi.string()
    })
}), espacoController.getEspacos);

router.post('/create', upload.single('espaco_imagem'), celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        ponto_referencia: Joi.string().required(),
        localizacao: Joi.string().required(),
        descricao: Joi.string().required(),
        id_instituicao: Joi.number().integer().min(1).required()
    })
}), espacoController.createEspaco);

router.patch('/update/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        ponto_referencia: Joi.string().required(),
        localizacao: Joi.string().required(),
        descricao: Joi.string().required(),
        id_instituicao: Joi.number().integer().min(1).required()
    })
}), espacoController.updateEspaco);

router.delete('/delete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    })
}), espacoController.deleteEspaco);

router.use(errors());

module.exports = router;