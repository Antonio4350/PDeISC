import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch"; // necesario si Node <18

const app = express();
app.use(cors());
app.use(express.json());

const client = new OAuth2Client([
  "204903815937-mphcir1er2shc5125248ffvanr66r8dr.apps.googleusercontent.com",
  "04903815937-3lf0nukl1hg9t1pj3f819bjl9c5r5coi.apps.googleusercontent.com"
]);

// Configuración MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "react_native_auth",
};

// Regex de contraseña
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{4,20}$/;

// Crear usuario tradicional
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

// Login tradicional
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

// Google Login
app.post("/googleLogin", async (req, res) => {
  const { idToken, accessToken } = req.body;

  try {
    let email, name;

    if (idToken) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: [
          "204903815937-mphcir1er2shc5125248ffvanr66r8dr.apps.googleusercontent.com",
          "04903815937-3lf0nukl1hg9t1pj3f819bjl9c5r5coi.apps.googleusercontent.com"
        ]
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
    } else if (accessToken) {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userInfo = await userInfoRes.json();
      email = userInfo.email;
      name = userInfo.name;
    } else {
      return res.json({ success: false, message: "Token faltante" });
    }

    const conn = await mysql.createConnection(dbConfig);
    const [existing] = await conn.execute("SELECT * FROM usuarios WHERE username = ?", [email]);

    if (existing.length === 0) {
      await conn.execute("INSERT INTO usuarios (username, password) VALUES (?, ?)", [email, ""]);
      console.log(`Usuario Google creado: ${email}`);
    }

    await conn.end();
    res.json({ success: true, mail: email });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});

app.listen(4000, () => console.log("Servidor activo en puerto 4000"));
