const mysql = require('../connection');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
require('dotenv').config();

module.exports = {

    getImageData: async (req, res) => {
        try {
            const { id } = req.params;

            const query = 
            `SELECT 
                Imagens.id AS id_imagem,
                Imagens.id_usuario,
                Usuarios.nome AS nome_usuario,
                Usuarios.email AS email_usuario,
                Imagens.id_espaco,
                Espacos.nome AS nome_espaco,
                Imagens.id_evento,
                Eventos.nome AS nome_evento
            FROM Imagens
            LEFT JOIN Usuarios ON Imagens.id_usuario = Usuarios.id
            LEFT JOIN Espacos ON Imagens.id_espaco = Espacos.id
            LEFT JOIN Eventos ON Imagens.id_evento = Eventos.id
            WHERE Imagens.id = ?`;

            const [result] = await mysql.execute(query, [id]);

            if (result.length === 0) {
                return res.status(404).send({ message: 'Nenhuma imagem encontrada' });
            }

            return res.status(200).send(result);

        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    },

    getImageById: async (req, res) => {
        try {
            const { id } = req.params;
            const [imagem] = await mysql.execute('SELECT imagem FROM Imagens WHERE id = ?', [id]);
    
            if (imagem.length === 0) {
                return res.status(404).send({ message: 'Nenhuma imagem encontrada' });
            }
    
            const imageBuffer = imagem[0].imagem;
    
            sharp(imageBuffer)
                .resize({width: 600})
                .jpeg()
                .toBuffer((err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({ message: 'Erro interno do servidor' });
                    }
                    return res.writeHead(200, { 'Content-Type': 'image/jpeg' }).end(data);
                });

        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    },  

    postImage: async (req, res) => {
        try {
            const token = req.header('Authorization');
            const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY);

            const { id_espaco, id_evento } = req.body;
            const imagem = req.file.buffer;

            if (id_espaco) {
                const [espaco] = await mysql.execute('SELECT * FROM Espacos WHERE id = ?', [id_espaco]);

                if (espaco.length === 0) {
                    return res.status(404).send({ message: 'Espaço não encontrado' });
                }

                const query = 'INSERT INTO Imagens (imagem, id_usuario, id_espaco) VALUES (?, ?, ?)';

                console.log(imagem);

                const [result] = await mysql.execute(query, [imagem, decodedToken.id, id_espaco]);

                return res.status(201).send({ message: 'Imagem cadastrada com sucesso!', id: result.insertId });
            } else if (id_evento) {
                const [evento] = await mysql.execute('SELECT * FROM Eventos WHERE id = ?', [id_evento]);

                if (evento.length === 0) {
                    return res.status(404).send({ message: 'Evento não encontrado' });
                }

                const query = 'INSERT INTO Imagens (imagem, id_usuario, id_evento) VALUES (?, ?, ?)';

                const [result] = await mysql.execute(query, [imagem, decodedToken.id, id_evento]);

                return res.status(201).send({ message: 'Imagem cadastrada com sucesso!', id: result.insertId });
            }

        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }

}