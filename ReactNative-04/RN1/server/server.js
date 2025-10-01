import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a XAMPP/MySQL
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",       // usuario XAMPP
  password: "",       // contraseña XAMPP
  database: "react_native_auth", // crear esta base si no existe
});

// Crear tabla usuarios si no existe
await db.execute(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
  );
`);

// Ruta para crear usuario
app.post("/usuarios", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    await db.execute(
      "INSERT INTO usuarios (username, password) VALUES (?, ?)",
      [username, password]
    );
    res.json({ message: "Usuario creado" });
  } catch (err) {
    res.status(400).json({ error: "Usuario ya existe" });
  }
});

// Ruta para login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.execute(
    "SELECT * FROM usuarios WHERE username=? AND password=?",
    [username, password]
  );

  if (rows.length > 0) res.json({ success: true, user: username });
  else res.status(401).json({ success: false, error: "Credenciales inválidas" });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
