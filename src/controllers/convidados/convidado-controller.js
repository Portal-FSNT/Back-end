const mysql = require('../../connection');

module.exports = {

    getAllConvidados: async (req, res) => {
        try {
            const { id, nome, email, telefone, cargo, nome_empresa,id_evento } = req.query;
            console.log(req.query)
            const params = [];
    
            let query = 
                `SELECT 
                    Convidados.id, 
                    Convidados.nome, 
                    Convidados.email, 
                    Convidados.telefone, 
                    Convidados.cargo, 
                    Empresas.nome AS nome_empresa 
                FROM Convidados 
                INNER JOIN Empresas ON Convidados.id_empresa = Empresas.id
                LEFT JOIN Convidado_Evento ConvidadoEvento ON Convidados.id = ConvidadoEvento.id_convidado
                WHERE 1=1`;
    
            if (id) {
                query += ' AND Convidados.id = ?';
                params.push(id);
            }
    
            if (nome) {
                query += ' AND Convidados.nome LIKE ?';
                params.push(`%${nome}%`);
            }
    
            if (email) {
                query += ' AND Convidados.email LIKE ?';
                params.push(`%${email}%`);
            }
    
            if (telefone) {
                query += ' AND Convidados.telefone LIKE ?';
                params.push(`%${telefone}%`);
            }
    
            if (cargo) {
                query += ' AND Convidados.cargo LIKE ?';
                params.push(`%${cargo}%`);
            }
    
            if (nome_empresa) {
                query += ' AND Empresas.nome LIKE ?';
                params.push(`%${nome_empresa}%`);
            }

            if (id_evento) {
                query += ' AND ConvidadoEvento.id_evento = ?';
                params.push(id_evento);
            }
    
            const [convidados] = await mysql.execute(query, params);
            return res.status(200).json(convidados);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },    

    createConvidado: async (req, res) => {
        try {
            const { nome, email, telefone, cargo, id_empresa } = req.body;

            const [convidado] = await mysql.execute('SELECT * FROM Convidados WHERE email = ?', [email]);

            if (convidado.length > 0) {
                return res.status(409).json({ message: 'Convidado já cadastrado' });
            }

            const query = 'INSERT INTO Convidados (nome, email, telefone, cargo, id_empresa) VALUES (?, ?, ?, ?, ?);'

            const [result] = await mysql.execute(query, [nome, email, telefone, cargo, id_empresa]);
            return res.status(201).json({ message: 'Convidado cadastrado com sucesso!', id: result.insertId });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    convidar: async (req, res) => {
        try {
            const { id_evento, id_convidado } = req.body;

            const [evento] = await mysql.execute('SELECT * FROM Eventos WHERE id = ?', [id_evento]);

            if (evento.length === 0) {
                return res.status(404).json({ message: 'Evento não encontrado' });
            }

            const [convidado] = await mysql.execute('SELECT * FROM Convidados WHERE id = ?', [id_convidado]);

            if (convidado.length === 0) {
                return res.status(404).json({ message: 'Convidado não encontrado' });
            }

            const [convidadoEvento] = await mysql.execute('SELECT * FROM Convidado_Evento WHERE id_evento = ? AND id_convidado = ?', [id_evento, id_convidado]);

            if (convidadoEvento.length > 0) {
                return res.status(409).json({ message: 'Convidado já convidado para este evento' });
            }

            const query = 'INSERT INTO Convidado_Evento (id_evento, id_convidado) VALUES (?, ?);'

            await mysql.execute(query, [id_evento, id_convidado]);

            return res.status(201).json({ message: 'Convidado convidado com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },
    desconvidar: async (req, res) => {
        try {
            console.log("SAAAAAAI")
            const { id_evento, id_convidado } = req.body;

            const [evento] = await mysql.execute('SELECT * FROM Eventos WHERE id = ?', [id_evento]);

            if (evento.length === 0) {
                return res.status(404).json({ message: 'Evento não encontrado' });
            }

            const [convidado] = await mysql.execute('SELECT * FROM Convidados WHERE id = ?', [id_convidado]);

            if (convidado.length === 0) {
                return res.status(404).json({ message: 'Convidado não encontrado' });
            }

            const query = 'DELETE FROM Convidado_Evento WHERE id_evento = ? AND id_convidado = ?';

            await mysql.execute(query, [id_evento, id_convidado]);

            return res.status(201).json({ message: 'Convidado desconvidado com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    updateConvidado: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, email, telefone, cargo, id_empresa } = req.body;

            const [convidado] = await mysql.execute('SELECT * FROM Convidados WHERE id = ?', [id]);

            if (convidado.length == 0) {
                return res.status(404).json({ message: 'Convidado não encontrado' });
            }

            const query = 'UPDATE Convidados SET nome = ?, email = ?, telefone = ?, cargo = ?, id_empresa = ? WHERE id = ?;'

            await mysql.execute(query, [nome, email, telefone, cargo, id_empresa, id]);
            return res.status(200).json({ message: 'Convidado atualizado com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    deleteConvidado: async (req, res) => {
        try {
            const { id } = req.params;

            const [convidado] = await mysql.execute('SELECT * FROM Convidados WHERE id = ?', [id]);

            if (convidado.length == 0) {
                return res.status(404).json({ message: 'Convidado não encontrado' });
            }

            const query = 'DELETE FROM Convidados WHERE id = ?;'

            await mysql.execute(query, [id]);
            return res.status(200).json({ message: 'Convidado deletado com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

}