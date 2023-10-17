CREATE DATABASE IF NOT EXISTS portal_fsnt;

USE portal_fsnt;

-- Tabela de Instituições
CREATE TABLE IF NOT EXISTS Instituicoes (
    id INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabela de Espaços
CREATE TABLE IF NOT EXISTS Espacos (
    id INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    ponto_referencia VARCHAR(50) NOT NULL,
    localizacao VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    id_instituicao INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_instituicao) REFERENCES Instituicoes(id)
);

-- Tabela de Empresas
CREATE TABLE IF NOT EXISTS Empresas (
    id INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    nivel_acesso ENUM('Administrador', 'Solicitante', 'Visualizador') NOT NULL,
    status_usuario ENUM('Ativo', 'Inativo') NOT NULL,
    id_instituicao INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_instituicao) REFERENCES Instituicoes(id)
);

-- Tabela de Solicitações
CREATE TABLE IF NOT EXISTS Solicitacoes (
    id INT AUTO_INCREMENT,
    data_solicitacao DATETIME NOT NULL,
    data_uso DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    descricao TEXT NOT NULL,
    id_espaco INT NOT NULL,
    id_usuario INT NOT NULL,
    status_solicitacao ENUM('Pendente', 'Aprovada', 'Reprovada') NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_espaco) REFERENCES Espacos(id),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

-- Tabela de Convidados
CREATE TABLE IF NOT EXISTS Convidados (
    id INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    id_empresa INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id)
);

-- Tabela de Convidados e Eventos
CREATE TABLE IF NOT EXISTS Convidado_Evento (
    id_convidado INT NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_convidado) REFERENCES Convidados(id),
    FOREIGN KEY (id_evento) REFERENCES Solicitacoes(id)
);

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS Eventos (
    id INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_evento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    endereco VARCHAR(100),
    id_espaco INT,
    tipo_evento ENUM('Público', 'Privado') NOT NULL,
    modalidade ENUM('Presencial', 'Online') NOT NULL,
    status_evento ENUM('Cancelado', 'Confirmado') NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_espaco) REFERENCES Espacos(id)
);

-- Tabela de Imagens
CREATE TABLE IF NOT EXISTS Imagens (
    nome_imagem VARCHAR(50) NOT NULL,
    url_imagem VARCHAR(100) NOT NULL,
    id_espaco INT,
    id_evento INT,
    FOREIGN KEY (id_espaco) REFERENCES Espacos(id),
    FOREIGN KEY (id_evento) REFERENCES Eventos(id)
);
