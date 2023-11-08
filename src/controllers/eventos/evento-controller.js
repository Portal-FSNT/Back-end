const mysql = require('../../connection');

module.exports = {

    getEventos: async (req, res) => {
        try {
            const query = `
                SELECT
                    Eventos.id,
                    Eventos.nome,
                    Eventos.descricao,
                    Eventos.data_evento,
                    Eventos.hora_inicio,
                    Eventos.hora_termino,
                    Eventos.endereco,
                    Instituicoes.nome AS nome_instituicao,
                    Espacos.nome AS nome_espaco,
                    Eventos.tipo_evento,
                    Eventos.modalidade,
                    Eventos.status_evento
                FROM Eventos
                LEFT JOIN Espacos ON Eventos.id_espaco = Espacos.id
                LEFT JOIN Instituicoes ON Espacos.id_instituicao = Instituicoes.id
            `;
    
            const [result] = await mysql.execute(query);
    
            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },    

    createEvento: async (req, res) => {
        try {
            const { nome, descricao, data_evento, hora_inicio, hora_termino, endereco, id_espaco, tipo_evento, modalidade } = req.body;
            
            const [eventos] = await mysql.execute('SELECT * FROM Eventos WHERE nome = ? AND status_evento = "Confirmado"', [nome]);

            if (eventos.length > 0) {
                return res.status(400).json({ message: 'Evento já cadastrado' });
            }

            if (modalidade === "Online") {
                const query = `
                    INSERT INTO Eventos (nome, descricao, data_evento, hora_inicio, hora_termino, tipo_evento, modalidade, status_evento)
                    VALUES (?, ?, ?, ?, ?, ?, ?, "Confirmado")
                `;
    
                const [result] = await mysql.execute(query, [nome, descricao, data_evento, hora_inicio, hora_termino, tipo_evento, modalidade]);
                
                return res.status(200).json({ message: 'Evento online criado com sucesso', id: result.insertId });
            } else if (modalidade === "Presencial") {
                const query = `
                    INSERT INTO Eventos (nome, descricao, data_evento, hora_inicio, hora_termino, endereco, id_espaco, tipo_evento, modalidade, status_evento)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "Confirmado")
                `;

                const [espaco] = await mysql.execute('SELECT * FROM Espacos WHERE id = ?', [id_espaco]);

                if (espaco.length === 0) {
                    return res.status(400).json({ message: 'Espaço não encontrado' });
                }
    
                const [result] = await mysql.execute(query, [nome, descricao, data_evento, hora_inicio, hora_termino, endereco, id_espaco, tipo_evento, modalidade]);
    
                return res.status(200).json({ message: 'Evento presencial criado com sucesso', id: result.insertId });
            } else {
                return res.status(400).json({ message: 'Tipo de modalidade de evento inválido' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },    
    
    updateEvento: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                nome, 
                descricao, 
                data_evento, 
                hora_inicio, 
                hora_termino, 
                tipo_evento, 
                modalidade } = req.body;
    
            let endereco = null;
            let id_espaco = null;
    
            if (modalidade !== "Online") {
                endereco = req.body.endereco;
                id_espaco = req.body.id_espaco;
            }
    
            const query = `
                UPDATE Eventos
                SET nome = ?,
                    descricao = ?,
                    data_evento = ?,
                    hora_inicio = ?,
                    hora_termino = ?,
                    endereco = ?,
                    id_espaco = ?,
                    tipo_evento = ?,
                    modalidade = ?
                WHERE id = ?
            `;
    
            await mysql.execute(query, [nome, descricao, data_evento, hora_inicio, hora_termino, endereco, id_espaco, tipo_evento, modalidade, id]);
            return res.status(200).json({ message: 'Evento atualizado com sucesso' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    cancelarEvento: async (req, res) => {
        try {
            const { id } = req.params;

            const [evento] = await mysql.execute('SELECT * FROM Eventos WHERE id = ?', [id]);

            if (evento.length === 0) {
                return res.status(400).json({ message: 'Evento não encontrado' });
            }

            const query = `
                UPDATE Eventos
                SET status_evento = "Cancelado"
                WHERE id = ?
            `;

            await mysql.execute(query, [id]);
            return res.status(200).json({ message: 'Evento cancelado com sucesso' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        } 
    },

    deleteEvento: async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                DELETE FROM Eventos
                WHERE id = ?
            `;

            await mysql.execute(query, [id]);
            return res.status(200).json({ message: 'Evento deletado com sucesso' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        } 
    }

}