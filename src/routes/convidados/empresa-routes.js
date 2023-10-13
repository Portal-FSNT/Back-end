const express = require('express');
const empresaController = require('../../controllers/convidados/empresa-controller');
const login = require('../../middlewares/login-middleware');
const roles = require('../../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');

router = express.Router();

router.get('/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id: Joi.number(),
        nome: Joi.string()
    })
}), empresaController.getAllEmpresas);

router.post('/create', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required()
    })
}), empresaController.createEmpresa);

router.patch('/update/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required()
    })
}), empresaController.updateEmpresa);

router.delete('/delete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    })
}), empresaController.deleteEmpresa);

router.use(errors());

module.exports = router;
