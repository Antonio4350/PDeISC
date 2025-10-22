import express from "express";
import cors from "cors";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================================
// CONFIGURAR SUBIDAS
// ==========================================================
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// 🔹 quitar tipos, compatible Node.js
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Solo se permiten archivos jpg, jpeg o png"));
};

const upload = multer({ storage, fileFilter });
app.use("/uploads", express.static(uploadDir));

// ==========================================================
// GOOGLE OAUTH
// ==========================================================
const client = new OAuth2Client(
  "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com"
);

// ==========================================================
// BASE DE DATOS
// ==========================================================
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_CbKaJT7yWmX5@ep-delicate-resonance-agvk4f1o-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

// ==========================================================
// REGEX PASSWORD
// ==========================================================
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{4,20}$/;

// ==========================================================
// RUTA 1: Crear usuario
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
    await pool.query("INSERT INTO usuarios (username, password) VALUES ($1,$2)", [
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
// RUTA 2: Login tradicional
// ==========================================================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ error: "Todos los campos son obligatorios" });

  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE username = $1",
      [username]
    );
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
// RUTA 3: Google Login
// ==========================================================
app.post("/googleLogin", async (req, res) => {
  const { idToken, accessToken } = req.body;
  try {
    let email, name;
    if (idToken) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience:
          "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com",
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

    const { rows } = await pool.query("SELECT * FROM usuarios WHERE username = $1", [
      email,
    ]);
    if (rows.length === 0) {
      await pool.query("INSERT INTO usuarios (username, password) VALUES ($1,$2)", [
        email,
        "google_auth",
      ]);
      console.log(`Usuario Google creado: ${email}`);
    }

    res.json({ success: true, mail: email });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// ==========================================================
// RUTA 4: Guardar/Actualizar Perfil con imágenes
// ==========================================================
app.post(
  "/perfil",
  upload.fields([
    { name: "foto_perfil", maxCount: 1 },
    { name: "documento", maxCount: 10 },
  ]),
  async (req, res) => {
    const { username, nombre, direccion, telefono } = req.body;
    if (!username) return res.json({ success: false, error: "Falta username" });

    try {
      console.log("BODY:", req.body);
      console.log("FILES:", req.files); // Ahora debería aparecer el contenido

      const fotoFile = req.files?.["foto_perfil"]?.[0];
      const docFiles = req.files?.["documento"] || [];

      const fotoUrl = fotoFile
        ? `http://10.0.7.210:4000/uploads/${fotoFile.filename}`
        : null;

      const { rows } = await pool.query(
        "SELECT documento FROM usuarios WHERE username=$1",
        [username]
      );
      let documentosActuales = rows[0]?.documento ? rows[0].documento.split("|") : [];

      const nuevosDocs = docFiles.map(
        (f) => `http://10.0.7.210:4000/uploads/${f.filename}`
      );
      const todosDocs = [...documentosActuales, ...nuevosDocs];

      const result = await pool.query(
        `UPDATE usuarios 
          SET nombre=$2, direccion=$3, telefono=$4,
              foto_perfil=COALESCE($5,foto_perfil),
              documento=$6
          WHERE username=$1`,
        [username, nombre, direccion, telefono, fotoUrl, todosDocs.join("|")]
      );

      if (result.rowCount === 0)
        return res.json({ success: false, error: "Usuario no encontrado" });

      res.json({
        success: true,
        message: "Perfil actualizado",
        fotoUrl,
        documentos: todosDocs,
      });
    } catch (err) {
      console.error(err);
      // Asegúrate de eliminar los archivos si el guardado en DB falla
      if (req.files) {
        req.files.foto_perfil?.forEach(f => fs.unlinkSync(f.path));
        req.files.documento?.forEach(f => fs.unlinkSync(f.path));
      }
      res.json({ success: false, error: "Error al actualizar perfil" });
    }
  }
);

// ==========================================================
// RUTA 5: Obtener Perfil
// ==========================================================
app.get("/perfil/:username", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE username=$1", [
      req.params.username,
    ]);
    if (rows.length === 0)
      return res.json({ success: false, error: "Usuario no encontrado" });

    const docs = rows[0].documento ? rows[0].documento.split("|") : [];
    res.json({ success: true, data: { ...rows[0], documento: docs } });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Error al obtener perfil" });
  }
});

// ==========================================================
// RUTA 6: Eliminar documento
// ==========================================================
app.delete("/deleteImage/:username", async (req, res) => {
  const { imageUrl } = req.body;
  const username = req.params.username;

  try {
    const { rows } = await pool.query(
      "SELECT documento FROM usuarios WHERE username=$1",
      [username]
    );
    if (rows.length === 0)
      return res.json({ success: false, error: "Usuario no encontrado" });

    const docs = rows[0].documento ? rows[0].documento.split("|") : [];
    const nuevosDocs = docs.filter((d) => d !== imageUrl);

    const filename = imageUrl.split("/uploads/")[1];
    const filepath = path.join(uploadDir, filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    await pool.query("UPDATE usuarios SET documento=$1 WHERE username=$2", [
      nuevosDocs.join("|"),
      username,
    ]);

    res.json({ success: true, images: nuevosDocs });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "No se pudo eliminar la imagen" });
  }
});

// ==========================================================
app.listen(4000, () => console.log("Servidor corriendo en puerto 4000"));