const mysql = require('../../connection');

module.exports = {

    getAllEmpresas: async (req, res) => {
        try {
            let query = 'SELECT * FROM Empresas WHERE 1=1'; 
    
            const { id, nome } = req.query;
    
            if (id) {
                query += ` AND id = ${id}`;
            }
    
            if (nome) {
                query += ` AND nome LIKE '%${nome}%'`;
            }
    
            const [empresas] = await mysql.execute(query);
            return res.status(200).json(empresas);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    createEmpresa: async (req, res) => {
        try {
            const { nome } = req.body;

            const query = 'INSERT INTO Empresas (nome) VALUES (?)';

            const [result] = await mysql.execute(query, [nome]);
            return res.status(201).json({ message: 'Empresa cadastrada com sucesso!', id: result.insertId });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    updateEmpresa: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome } = req.body;

            const [empresa] = await mysql.execute('SELECT * FROM Empresas WHERE id = ?', [id]);

            if (empresa.length === 0) {
                return res.status(404).json({ message: 'Empresa não encontrada' });
            }

            const query = 'UPDATE Empresas SET nome = ? WHERE id = ?';

            await mysql.execute(query, [nome, id]);
            return res.status(200).json({ message: 'Empresa atualizada com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    deleteEmpresa: async (req, res) => {
        try {
            const { id } = req.params;

            const [empresa] = await mysql.execute('SELECT * FROM Empresas WHERE id = ?', [id]);

            if (empresa.length === 0) {
                return res.status(404).json({ message: 'Empresa não encontrada' });
            }

            const query = 'DELETE FROM Empresas WHERE id = ?';

            await mysql.execute(query, [id]);
            return res.status(200).json({ message: 'Empresa deletada com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

}