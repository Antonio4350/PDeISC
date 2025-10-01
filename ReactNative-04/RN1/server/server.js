import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

// conexion a la bdd
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "react_native_auth",
};

// crear usuario con contraseña
app.post("/usuarios", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ error: "Todos los campos son obligatorios" });

  try {
    const conn = await mysql.createConnection(dbConfig);

    // verificar si el usuario ya existe
    const [rows] = await conn.execute("SELECT * FROM usuarios WHERE username = ?", [username]);
    if (rows.length > 0) {
      await conn.end();
      return res.json({ error: "El usuario ya existe" });
    }

    // hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // insertar usuario
    await conn.execute("INSERT INTO usuarios (username, password) VALUES (?, ?)", [username, hashedPassword]);
    await conn.end();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: "Error del servidor" });
  }
});

// login: comparar contraseña encriptada
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, error: "Todos los campos son obligatorios" });

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute("SELECT * FROM usuarios WHERE username = ?", [username]);
    await conn.end();

    if (rows.length === 0) return res.json({ success: false, error: "Usuario o contraseña inválidos / usuario inexistente" });

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) res.json({ success: true });
    else res.json({ success: false, error: "Usuario o contraseña inválidos / usuario inexistente" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Error del servidor" });
  }
});

app.listen(4000, () => console.log("Servidor corriendo en http://10.0.7.210:{PORT}"));