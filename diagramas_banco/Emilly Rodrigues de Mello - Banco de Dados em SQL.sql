CREATE DATABASE kanban;
use kanban;

CREATE TABLE usuario (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE tarefas (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('A fazer', 'Fazendo', 'Pronto') DEFAULT 'A fazer',
    setor VARCHAR(255) NOT NULL,
    prioridade ENUM('Baixa', 'Média', 'Alta') DEFAULT 'Média',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_em DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

