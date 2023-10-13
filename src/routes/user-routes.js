const express = require('express');
const userController = require('../controllers/user-controller');
const login = require('../middlewares/login-middleware');
const roles = require('../middlewares/roles-middleware');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const router = express.Router();

router.get('/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        id: Joi.number().integer(),
        nome: Joi.string(),
        email: Joi.string().email(),
        telefone: Joi.string().min(10).max(25),
        nivel_acesso: Joi.string(),
        status_usuario: Joi.string(),
        nome_instituicao: Joi.string()
    })
}), userController.getAllUsers);

router.post('/create', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        email: Joi.string().email().required(),
        senha: Joi.string().required(),
        telefone: Joi.string().min(10).max(25).required(),
        nivel_acesso: Joi.string().required(),
        id_instituicao: Joi.number().integer().required()
    })
}), userController.createUser);

router.post('/login', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        senha: Joi.string().required()
    })
}), userController.login);

router.post('/identify', userController.identifyUser);

router.patch('/update-password', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        senha_atual: Joi.string().required(),
        senha_nova: Joi.string().required()
    })
}), userController.updatePassword);

router.patch('/update/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string(),
        email: Joi.string().email(),
        telefone: Joi.string().min(10).max(25),
        nivel_acesso: Joi.string(),
        id_instituicao: Joi.number().integer()
    })
}), userController.updateUser);

router.patch('/disable/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), userController.disableUser);

router.patch('/enable/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), userController.enableUser);

router.delete('/delete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}), userController.deleteUser);

router.use(errors());

module.exports = router;