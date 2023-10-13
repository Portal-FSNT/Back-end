const mysql = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {

    getAllUsers: async (req, res) => {
        try {
            const { id, nome, email, telefone, nivel_acesso, status_usuario, nome_instituicao } = req.query;
            const params = [];
    
            const query =
                `SELECT 
                    Usuarios.id, 
                    Usuarios.nome, 
                    Usuarios.email,  
                    Usuarios.telefone,
                    Usuarios.nivel_acesso, 
                    Usuarios.status_usuario, 
                    Usuarios.id_instituicao, 
                    Instituicoes.nome as nome_instituicao 
                FROM Usuarios
                INNER JOIN Instituicoes ON Instituicoes.id = Usuarios.id_instituicao
                WHERE 1 = 1`;
    
            if (id) {
                query += ' AND Usuarios.id = ?';
                params.push(id);
            }
    
            if (nome) {
                query += ' AND Usuarios.nome LIKE ?';
                params.push(`%${nome}%`);
            }
    
            if (email) {
                query += ' AND Usuarios.email LIKE ?';
                params.push(`%${email}%`);
            }
    
            if (telefone) {
                query += ' AND Usuarios.telefone LIKE ?';
                params.push(`%${telefone}%`);
            }
    
            if (nivel_acesso) {
                query += ' AND Usuarios.nivel_acesso = ?';
                params.push(nivel_acesso);
            }
    
            if (status_usuario) {
                query += ' AND Usuarios.status_usuario = ?';
                params.push(status_usuario);
            }
    
            if (nome_instituicao) {
                query += ' AND Instituicoes.nome LIKE ?';
                params.push(`%${nome_instituicao}%`);
            }
    
            const [users] = await mysql.execute(query, params);
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send({ error: error });
        }
    },

    createUser: async (req, res) => {
        try {
            const { nome, email, senha, telefone, nivel_acesso, id_instituicao } = req.body;

            const [user] = await mysql.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);

            if (user.length > 0) {
                return res.status(401).json({ message: 'Usuário já cadastrado!' });
            }

            const hash = await bcrypt.hash(senha, 10);

            const query = `INSERT INTO Usuarios (nome, email, senha, telefone, nivel_acesso, status_usuario, id_instituicao) VALUES (?, ?, ?, ?, ?, 'Ativo', ?)`;

            const [result] = await mysql.execute(query, [nome, email, hash, telefone, nivel_acesso, id_instituicao]);
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            const [user] = await mysql.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);

            if (user.length === 0) {
                return res.status(401).json({ message: 'Usuário não encontrado' });
            }

            const match = await bcrypt.compare(senha, user[0].senha);

            if (!match) {
                return res.status(401).json({ message: 'E-mail ou senha inválidos' });
            }

            const token = jwt.sign({
                id: user[0].id,
                nome: user[0].nome,
                email: user[0].email,
                nivel_acesso: user[0].nivel_acesso
            }, process.env.JWT_KEY, { expiresIn: '5 days' });

            return res.status(200).json({ message: 'Autenticado com sucesso!', token: token });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    identifyUser: async (request, response) => {
        try {
            const authHeader = request.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token == null) {
                return response.status(401).send("Token não fornecido.");
            }

            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) {
                    console.error("Ocorreu um erro ao verificar o token:", error);
                    return response.status(403).send("Token inválido.");
                }
                
                request.user = decoded;
                response.json(decoded);
            });
        } catch (error) {
            console.error("Ocorreu um erro:", error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { email, senha_atual, senha_nova } = req.body;

            const [user] = await mysql.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);

            if (user.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const match = await bcrypt.compare(senha_atual, user[0].senha);

            if (!match) {
                return res.status(401).json({ message: 'Senha atual inválida' });
            }

            const hash = await bcrypt.hash(senha_nova, 10);

            const query = `UPDATE Usuarios SET senha = ? WHERE email = ?`;

            await mysql.execute(query, [hash, email]);
            return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, email, telefone, nivel_acesso, id_instituicao } = req.body;

            const [user] = await mysql.execute('SELECT * FROM Usuarios WHERE id = ?', [id]);

            if (user.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const query = `UPDATE Usuarios SET nome = ?, email = ?, telefone = ?, nivel_acesso = ?, id_instituicao = ? WHERE id = ?`;

            await mysql.execute(query, [nome, email, telefone, nivel_acesso, id_instituicao, id]);
            return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    disableUser: async (request, response) => {
        try {
            const query = 
                `UPDATE Usuarios
                SET status_usuario = 'Inativo'
                WHERE id = ?`;
    
            const [result] = await mysql.execute(query, [request.params.id]);
    
            if (!result || result.length === 0) {
                return response.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            return response.status(200).json({ message: 'Usuário desativado com sucesso' });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    },
    
    enableUser: async (request, response) => {
        try {
            const query = 
                `UPDATE Usuarios
                SET status_usuario = 'Ativo'
                WHERE id = ?`;
    
            const [result] = await mysql.execute(query, [request.params.id]);
    
            if (!result || result.length === 0) {
                return response.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            return response.status(200).json({ message: 'Usuário ativado com sucesso' });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const [user] = await mysql.execute('SELECT * FROM Usuarios WHERE id = ?', [id]);

            if (user.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            await mysql.execute('DELETE FROM Usuarios WHERE id = ?', [id]);
            return res.status(200).json({ message: 'Usuário deletado com sucesso!' });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

}