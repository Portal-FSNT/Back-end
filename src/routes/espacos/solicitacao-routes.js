const express = require('express');
const solicitacaoController = require('../../controllers/espacos/solicitacao-controller');
const login = require('../../middlewares/login-middleware');
const roles = require('../../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const router = express.Router();

router.get('/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id_solicitacao: Joi.number().integer(),
        data_solicitacao: Joi.date(),
        nome_espaco: Joi.string(),
        status_solicitacao: Joi.string()
    })
}), solicitacaoController.getSolicitacoes);

router.post('/solicitar', celebrate({
    [Segments.BODY]: Joi.object().keys({
        data_uso: Joi.date().required(),
        hora_inicio: Joi.string().required(),
        hora_termino: Joi.string().required(),
        descricao: Joi.string().required(),
        id_espaco: Joi.number().integer().required()
    })
}), solicitacaoController.solicitar);

router.patch('/aprovar/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), solicitacaoController.aprovarSolicitacao);

router.patch('/rejeitar/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), solicitacaoController.reprovarSolicitacao);

router.delete('/delete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), solicitacaoController.deleteSolicitacao);

router.use(errors());

module.exports = router;
