-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mi_portfolio;
USE mi_portfolio;

-- Hero
CREATE TABLE IF NOT EXISTS hero (
  id INT PRIMARY KEY AUTO_INCREMENT,
  texto TEXT
);
INSERT INTO hero (texto) VALUES 
('Hola, soy Antonio\nTécnico informático | Desarrollador web | Apasionado por aprender');

-- About
CREATE TABLE IF NOT EXISTS about (
  id INT PRIMARY KEY AUTO_INCREMENT,
  texto TEXT
);
INSERT INTO about (texto) VALUES 
('Soy estudiante de informática con experiencia en proyectos web y redes. Me interesa el desarrollo frontend y backend, y siempre busco aprender nuevas tecnologías.');

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),
  nivel INT
);
INSERT INTO skills (nombre, nivel) VALUES
('React', 80),
('Tailwind', 70),
('Node.js', 60),
('MySQL', 50);

-- Projects (agregamos finalizado)
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(255),
  descripcion TEXT,
  imagen VARCHAR(255) DEFAULT NULL,
  link VARCHAR(255) DEFAULT NULL,
  finalizado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO projects (titulo, descripcion, finalizado) VALUES
('Portfolio en React', 'Mi sitio personal con Tailwind.', TRUE),
('API con Node', 'Backend con Express.', FALSE);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255)
);
INSERT INTO users (username, password_hash) VALUES 
('Antonio4350', '$2b$10$4smS62IEZK4QDLyhFfO8BuOxS/T0BenH5TnSpoCMce6LiZvP5Swnu');
