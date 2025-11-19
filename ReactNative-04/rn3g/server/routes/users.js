import express from "express"
import { db } from "../db.js"
import bcrypt from "bcrypt"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM usuarios;")
        if(!rows.length) return res.send("No hay usuarios")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    if(!id) return res.send("Faltan datos")
    try {
        const query = "SELECT * FROM usuarios WHERE id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.length) return res.send("No se encontro al usuario")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.post("/", async (req, res) => {
    const { nombre, email, password } = req.body
    if(!nombre || !email || !password) {
        return  res.send("Faltan datos")
    }
    try {
        const hashedPass = await bcrypt.hash(password, 10)
        const query = "INSERT INTO usuarios(nombre, email, password, rol) VALUES (?, ?, ?, 'seguidor');"
        const [rows] = await db.query(query, [nombre, email, hashedPass])
        res.send(rows)
    } catch (error){
        res.send(error)
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    // Array para ir guardando las partes del SET
    let campos = [];
    let valores = [];

    if (nombre) {
        campos.push("nombre = ?");
        valores.push(nombre);
    }
    if (email) {
        campos.push("email = ?");
        valores.push(email);
    }
    if (rol) {
        campos.push("rol = ?");
        valores.push(rol);
    }
    if (campos.length === 0) {
        return res.status(400).json({ msg: "No se enviaron campos para actualizar" });
    }

    const query = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(id);

    try {
        const [rows] = await db.query(query, valores);
        if(!rows.affectedRows) {
            return res.send("No se cambio nada")
        }
        res.send(rows)
    } catch (error) {
        res.send(error);
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    if(!id) return res.send("Faltan datos")
    try {
        const query = "DELETE FROM usuarios WHERE id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.affectedRows) return res.send("No se borro nada")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})


export default router