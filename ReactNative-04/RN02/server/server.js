import express from "express";
import cors from "cors";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// Google OAuth
const client = new OAuth2Client(
  "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com"
);

// Configuración PostgreSQL Neon
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_CbKaJT7yWmX5@ep-delicate-resonance-agvk4f1o-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

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
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE username = $1",
      [username]
    );
    if (rows.length > 0) return res.json({ error: "El usuario ya existe" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO usuarios (username, password) VALUES ($1, $2)", [
      username,
      hash,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: "Error del servidor" });
  }
});

// Login tradicional
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ error: "Todos los campos son obligatorios" });

  try {
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE username = $1", [
      username,
    ]);
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
        audience: "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
    } else if (accessToken) {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await userInfoRes.json();
      email = userInfo.email;
      name = userInfo.name;
    } else {
      return res.json({ success: false, message: "Token faltante" });
    }

    // Verificar si el usuario ya existe
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE username = $1", [
      email,
    ]);

    if (rows.length === 0) {
      // Insertar usuario Google con password dummy
      await pool.query(
        "INSERT INTO usuarios (username, password) VALUES ($1, $2)",
        [email, "google_auth"]
      );
      console.log(`Usuario Google creado: ${email}`);
    }

    res.json({ success: true, mail: email });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});

app.listen(4000, () => console.log("Servidor andando en puerto 4000"));
