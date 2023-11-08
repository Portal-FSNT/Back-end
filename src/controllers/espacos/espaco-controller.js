const mysql = require('../../connection');

module.exports = {

    getEspacos: async (req, res) => {
        try {
            const { id, nome } = req.query;
    
            let query = 
            `
                SELECT 
                    Espacos.id,
                    Espacos.nome,
                    Espacos.ponto_referencia,
                    Espacos.localizacao,
                    Espacos.descricao,
                    Instituicoes.nome AS instituicao 
                FROM Espacos 
                INNER JOIN Instituicoes ON Espacos.id_instituicao = Instituicoes.id
                WHERE 1=1
            `;
    
            if (id) {
                query += ` AND id = ${id}`;
            }
    
            if (nome) {
                query += ` AND nome LIKE '%${nome}%'`;
            }
    
            const [espacos] = await mysql.execute(query);
            return res.status(200).send(espacos);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    },

    createEspaco: async (req, res) => {
        try {
            const { nome, ponto_referencia, localizacao, descricao, id_instituicao } = req.body;
            
            const [espaco] = await mysql.execute('SELECT * FROM Espacos WHERE nome = ?', [nome]);
            
            if (espaco.length > 0) {
                return res.status(409).send({ message: 'Espaço já cadastrado' });
            }
            
            const [instituicao] = await mysql.execute('SELECT * FROM Instituicoes WHERE id = ?', [id_instituicao]);
            
            if (instituicao.length === 0) {
                return res.status(404).send({ message: 'Instituição não encontrada' });
            }
            
            const query = 'INSERT INTO Espacos (nome, ponto_referencia, localizacao, descricao, id_instituicao) VALUES (?, ?, ?, ?, ?)';
            
            const [result] = await mysql.execute(query, [nome, ponto_referencia, localizacao, descricao, id_instituicao]);
    
            return res.status(201).send({ message: 'Espaço cadastrado com sucesso!', id: result.insertId });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    },  

    updateEspaco: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, ponto_referencia, localizacao, descricao, id_instituicao } = req.body;

            const [espaco] = await mysql.execute('SELECT * FROM Espacos WHERE id = ?', [id]);

            if (espaco.length === 0) {
                return res.status(404).send({ message: 'Espaço não encontrado' });
            }

            const [instituicao] = await mysql.execute('SELECT * FROM Instituicoes WHERE id = ?', [id_instituicao]);

            if (instituicao.length === 0) {
                return res.status(404).send({ message: 'Instituição não encontrada' });
            }

            const query = 'UPDATE Espacos SET nome = ?, ponto_referencia = ?, localizacao = ?, descricao = ?, id_instituicao = ? WHERE id = ?';

            await mysql.execute(query, [nome, ponto_referencia, localizacao, descricao, id_instituicao, id]);
            return res.status(200).send({ message: 'Espaço atualizado com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    },

    deleteEspaco: async (req, res) => {
        try {
            const { id } = req.params;

            const [espaco] = await mysql.execute('SELECT * FROM Espacos WHERE id = ?', [id]);

            const [solicitacoes] = await mysql.execute('SELECT * FROM Solicitacoes WHERE id_espaco = ?', [id]);

            if (espaco.length === 0) {
                return res.status(404).send({ message: 'Espaço não encontrado' });
            }

            if (solicitacoes.length > 0) {
                return res.status(409).send({ message: 'Existem solicitações para este espaço' });
            }

            await mysql.execute('DELETE FROM Espacos WHERE id = ?', [id]);
            return res.status(200).send({ message: 'Espaço deletado com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }
    
}