const express = require('express');
const eventoController = require('../../controllers/eventos/evento-controller');
const login = require('../../middlewares/login-middleware');
const roles = require('../../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const router = express.Router();

router.get('/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id_evento: Joi.number().integer(),
        nome: Joi.string(),
        data_evento: Joi.string(),
        tipo_evento: Joi.date(),
        modalidade: Joi.string()
    })
}), eventoController.getEventos);

router.post('/create', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        descricao: Joi.string().required(),
        data_evento: Joi.date().required(),
        hora_inicio: Joi.string().required(),
        hora_termino: Joi.string().required(),
        endereco: Joi.string().required(),
        tipo_evento: Joi.string().required(),
        modalidade: Joi.string().required(),
        id_espaco: Joi.number().integer().required()
    })
}), eventoController.createEvento);

router.patch('/update/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string(),
        descricao: Joi.string(),
        data_evento: Joi.date(),
        hora_inicio: Joi.string(),
        hora_termino: Joi.string(),
        endereco: Joi.string(),
        tipo_evento: Joi.string(),
        modalidade: Joi.string(),
        id_espaco: Joi.number().integer()
    })
}), eventoController.updateEvento);

router.patch('/cancelar/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), eventoController.cancelarEvento);

router.delete('/delete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), eventoController.deleteEvento);

router.use(errors());

module.exports = router;
