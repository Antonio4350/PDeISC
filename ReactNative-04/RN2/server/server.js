import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

// Configuración MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "react_native_auth",
};

// Validación de contraseña
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{4,20}$/;

// Crear usuario
app.post("/usuarios", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ error: "Todos los campos son obligatorios" });

  if (!passwordRegex.test(password))
    return res.json({
      error:
        "La contraseña debe tener entre 4 y 20 caracteres, incluir mayúscula, minúscula y número",
    });

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute("SELECT * FROM usuarios WHERE username = ?", [username]);

    if (rows.length > 0) {
      await conn.end();
      return res.json({ error: "El usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);
    await conn.execute("INSERT INTO usuarios (username, password) VALUES (?, ?)", [username, hash]);
    await conn.end();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: "Error del servidor" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ error: "Todos los campos son obligatorios" });

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute("SELECT * FROM usuarios WHERE username = ?", [username]);
    await conn.end();

    if (rows.length === 0) return res.json({ error: "Usuario no encontrado" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.json({ error: "Contraseña incorrecta" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: "Error del servidor" });
  }
});

app.listen(4000, () => console.log("Servidor activo en puerto 4000"));
