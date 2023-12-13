const express = require('express');
const convidadoController = require('../../controllers/convidados/convidado-controller');
const login = require('../../middlewares/login-middleware');
const roles = require('../../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const router = express.Router();

router.get('/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id: Joi.number(),
        nome: Joi.string(),
        email: Joi.string().email(),
        telefone: Joi.string(),
        cargo: Joi.string(),
        nome_empresa: Joi.string(),
        id_evento: Joi.number(),
    })
}), convidadoController.getAllConvidados);

router.get('/listapessoas', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id: Joi.number(),
        nome: Joi.string(),
        email: Joi.string().email(),
        telefone: Joi.string(),
        cargo: Joi.string(),
        nome_empresa: Joi.string(),
    })
}), convidadoController.getConvidados);


router.post('/create', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        email: Joi.string().email().required(),
        telefone: Joi.string().required(),
        cargo: Joi.string().required(),
        id_empresa: Joi.number().required()
    })
}), convidadoController.createConvidado);

router.post('/convidar', celebrate({
    [Segments.BODY]: Joi.object().keys({
        id_convidado: Joi.number().required(),
        id_evento: Joi.number().required()
    })
}), convidadoController.convidar);
router.post('/desconvidar', celebrate({
    [Segments.BODY]: Joi.object().keys({
        id_convidado: Joi.number().required(),
        id_evento: Joi.number().required()
    })
}), convidadoController.desconvidar);

router.patch('/update/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        email: Joi.string().email().required(),
        telefone: Joi.string().required(),
        cargo: Joi.string().required(),
        id_empresa: Joi.number().required()
    })
}), convidadoController.updateConvidado);

router.delete('/delete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    })
}), convidadoController.deleteConvidado);

router.use(errors());

module.exports = router;