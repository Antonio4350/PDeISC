import express from "express";
import cors from "cors";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// Google OAuth Client
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

// ==========================================================
// RUTA 1: Crear usuario tradicional (POST /usuarios)
// ==========================================================
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

// ==========================================================
// RUTA 2: Login tradicional (POST /login)
// ==========================================================
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

// ==========================================================
// RUTA 3: Google Login (POST /googleLogin)
// ==========================================================
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


// ==========================================================
// RUTA 4: Guardar/Actualizar Perfil (POST /perfil) 👈 RUTA NUEVA
// ==========================================================
app.post("/perfil", async (req, res) => {
  const { username, nombre, direccion, telefono, documento, foto_perfil } = req.body;

  if (!username) {
    return res.json({ success: false, error: "Falta el nombre de usuario (username)." });
  }

  try {
    const result = await pool.query(
      `
      UPDATE usuarios 
      SET 
        nombre = $2, 
        direccion = $3, 
        telefono = $4, 
        documento = $5, 
        foto_perfil = $6
      WHERE username = $1
      `,
      [username, nombre, direccion, telefono, documento, foto_perfil]
    );

    if (result.rowCount === 0) {
      return res.json({ success: false, error: "Usuario no encontrado o no se pudo actualizar." });
    }

    res.json({ success: true, message: "Perfil actualizado correctamente." });

  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    res.json({ success: false, error: "Error del servidor al actualizar el perfil." });
  }
});


app.listen(4000, () => console.log("Servidor andando en puerto 4000"));