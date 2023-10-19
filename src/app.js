const express = require('express');
const cors = require('cors');

// Usuários
const users = require('./routes/user-routes');

// Projeto de Eventos
const eventos = require('./routes/eventos/evento-routes');

// Projeto de Espaços
const espacos = require('./routes/espacos/espaco-routes');
const instituicoes = require('./routes/espacos/instituicao-routes');
const solicitacoes = require('./routes/espacos/solicitacao-routes');

// Imagens
const imagens = require('./routes/imagem-routes');

// Projeto de Convidados
const empresas = require('./routes/convidados/empresa-routes');
const convidados = require('./routes/convidados/convidado-routes');

const app = express();
app.use(express.json());

app.use(cors());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Usuários
app.use('/users', users);

// Projeto de Eventos
app.use('/eventos', eventos);

// Projeto de Espaços
app.use('/espacos', espacos);
app.use('/instituicoes', instituicoes);
app.use('/solicitacoes', solicitacoes);

// Imagens
app.use('/imagens', imagens);

// Projeto de Convidados
app.use('/empresas', empresas);
app.use('/convidados', convidados);

module.exports = app;