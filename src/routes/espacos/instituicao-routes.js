const express = require('express');
const instituicaoController = require('../../controllers/espacos/instituicao-controller');
const login = require('../../middlewares/login-middleware');
const roles = require('../../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const router = express.Router();

router.get('/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id: Joi.number().integer(),
        nome: Joi.string()
    })
}), instituicaoController.getInstituicao);

router.post('/create', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required()
    })
}), instituicaoController.createInstituicao);

router.patch('/update/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required()
    })
}), instituicaoController.updateInstituicao);

router.delete('/delete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), instituicaoController.deleteInstituicao);

router.use(errors());

module.exports = router;
