const mysql = require('../../connection');

module.exports = {

    getInstituicao: async (req, res) => {
        try {
            const { id, nome } = req.query;

            let query = 'SELECT * FROM Instituicoes';

            const params = [];

            if (id) {
                query = `${query} WHERE id = ?`;
                params.push(id);
            }

            if (nome) {
                query = `${query} WHERE nome LIKE ?`;
                params.push(`%${nome}%`);
            }

            const [result] = await mysql.execute(query);
            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    createInstituicao: async (req, res) => {
        try {
            const query = 'INSERT INTO Instituicoes (nome) VALUES (?)';
            const { nome } = req.body;

            const [instituicao] = await mysql.execute('SELECT * FROM Instituicoes WHERE nome = ?', [nome]);

            if (instituicao.length > 0) {
                return res.status(409).json({ message: 'Instituição já cadastrada' });
            }

            const [result] = await mysql.execute(query, [nome]);
            return res.status(201).json({ message: 'Instituição cadastrada com sucesso!', id: result.insertId });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    updateInstituicao: async (req, res) => {
        try {
            const query = 'UPDATE Instituicoes SET nome = ? WHERE id = ?';
            const { id } = req.params;
            const { nome } = req.body;

            const [instituicao] = await mysql.execute('SELECT * FROM Instituicoes WHERE id = ?', [id]);

            if (instituicao.length === 0) {
                return res.status(404).json({ message: 'Instituição não encontrada' });
            }

            await mysql.execute(query, [nome, id]);
            return res.status(200).json({ message: 'Instituição atualizada com sucesso' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        } 
    },

    deleteInstituicao: async (req, res) => {
        try {
            const query = 'DELETE FROM Instituicoes WHERE id = ?';
            const { id } = req.params;

            const [instituicao] = await mysql.execute('SELECT * FROM Instituicoes WHERE id = ?', [id]);

            if (instituicao.length === 0) {
                return res.status(404).json({ message: 'Instituição não encontrada' });
            }

            await mysql.execute(query, [id]);
            return res.status(200).json({ message: 'Instituição deletada com sucesso' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

}