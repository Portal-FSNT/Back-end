const mysql = require('../../connection');
const jwt = require('jsonwebtoken');

module.exports = {
    
    getSolicitacoes: async (req, res) => {
        try {
            const { id_solicitacao, data_solicitacao, nome_espaco, status_solicitacao } = req.query;
    
            let query = `
                SELECT 
                    Solicitacoes.id,
                    Solicitacoes.data_solicitacao,
                    Solicitacoes.data_uso,
                    Solicitacoes.hora_inicio,
                    Solicitacoes.hora_termino,
                    Solicitacoes.descricao,
                    Espacos.nome AS nome_espaco,
                    Usuarios.id AS id_usuario,
                    Usuarios.nome AS nome_usuario,
                    Solicitacoes.status_solicitacao
                FROM Solicitacoes
                INNER JOIN Espacos ON Espacos.id = Solicitacoes.id_espaco
                INNER JOIN Usuarios ON Usuarios.id = Solicitacoes.id_usuario
                WHERE 1=1
            `;
    
            if (id_solicitacao) {
                query += ` AND Solicitacoes.id = ${id_solicitacao}`;
            }
    
            if (data_solicitacao) {
                query += ` AND Solicitacoes.data_solicitacao = '${data_solicitacao}'`;
            }
    
            if (nome_espaco) {
                query += ` AND Espacos.nome LIKE '%${nome_espaco}%'`;
            }
    
            if (status_solicitacao) {
                query += ` AND Solicitacoes.status_solicitacao = '${status_solicitacao}'`;
            }
    
            const [result] = await mysql.execute(query);
            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },
    
    solicitar: async (req, res) => {
        try {
            const token = req.header('Authorization');
            const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY);

            const { data_uso, hora_inicio, hora_termino, descricao, id_espaco } = req.body;

            const query = `
                INSERT INTO Solicitacoes (
                    data_solicitacao,
                    data_uso,
                    hora_inicio,
                    hora_termino,
                    descricao,
                    id_usuario,
                    id_espaco,
                    status_solicitacao
                ) VALUES ( NOW(), ?, ?, ?, ?, ?, ?, 'PENDENTE')
            `;

            const [espaco] = await mysql.execute('SELECT * FROM Espacos WHERE id = ?', [id_espaco]);

            if (espaco.length === 0) {
                return res.status(404).json({ message: 'Espaço não encontrado' });
            }

            const result = await mysql.execute(query, [data_uso, hora_inicio, hora_termino, descricao, decodedToken.id, id_espaco]);
            return res.status(201).json({ message: 'Solicitação enviada com sucesso', id: result.insertId });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    aprovarSolicitacao: async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                UPDATE Solicitacoes
                SET status_solicitacao = 'Aprovada'
                WHERE id = ?
            `;

            await mysql.execute(query, [id]);
            return res.status(200).json({ message: 'Solicitação aprovada com sucesso' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    reprovarSolicitacao: async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                UPDATE Solicitacoes
                SET status_solicitacao = 'Reprovada'
                WHERE id = ?
            `;

            await mysql.execute(query, [id]);
            return res.status(200).json({ message: 'Solicitação reprovada com sucesso' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    deleteSolicitacao: async (req, res) => {
        try {
            const { id } = req.params;

            await mysql.execute('DELETE FROM Solicitacoes WHERE id = ?', [id]);
            return res.status(200).send({ message: 'Solicitação deletado com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }
    
}