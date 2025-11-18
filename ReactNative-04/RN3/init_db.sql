CREATE DATABASE IF NOT EXISTS torneo_futbol;
USE torneo_futbol;

CREATE TABLE equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  escudo VARCHAR(255)
);

CREATE TABLE jugadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  edad INT,
  posicion VARCHAR(50),
  numero_casaca INT,
  equipo_id INT,
  foto VARCHAR(255),
  FOREIGN KEY (equipo_id) REFERENCES equipos(id)
);

CREATE TABLE partidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipo_local INT,
  equipo_visitante INT,
  fecha DATETIME,
  lugar VARCHAR(100),
  resultado VARCHAR(20),
  latitud DECIMAL(10,8),
  longitud DECIMAL(11,8),
  FOREIGN KEY (equipo_local) REFERENCES equipos(id),
  FOREIGN KEY (equipo_visitante) REFERENCES equipos(id)
);

CREATE TABLE estadisticas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partido_id INT,
  jugador_id INT,
  goles INT DEFAULT 0,
  tarjetas VARCHAR(20),
  FOREIGN KEY (partido_id) REFERENCES partidos(id),
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id)
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  rol ENUM('admin','jugador','seguidor')
);
