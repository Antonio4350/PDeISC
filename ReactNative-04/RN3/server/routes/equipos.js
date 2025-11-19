import express from "express"
import { db } from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM equipos;")
        if(!rows.length) return res.send("No hay equipos")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    if(!id) return res.send("Faltan datos")
    try{
        const query = "SELECT * FROM equipos WHERE id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.length) return res.send("No se encontro el equipo")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.post("/", async (req, res) => {
    const { nombre, escudo, jugadores } = req.body
    if(!nombre || !escudo || !jugadores) {
        return  res.send("Faltan datos")
    }
    try {
        const query = "INSERT INTO equipos(nombre, escudo, jugadores) VALUES (?, ?, ?);"
        const [rows] = await db.query(query, [nombre, escudo, jugadores])
        if(!rows.affectedRows) return res.send("No se pudo crear el equipo")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, escudo, jugador } = req.body;

    // Array para ir guardando las partes del SET
    let campos = [];
    let valores = [];

    if (nombre) {
        campos.push("nombre = ?");
        valores.push(nombre);
    }
    if (escudo) {
        campos.push("escudo = ?");
        valores.push(escudo);
    }
    if (jugador) {
        campos.push("jugador = ?");
        valores.push(jugador);
    }
    if (campos.length === 0) {
        return res.status(400).json({ msg: "No se enviaron campos para actualizar" });
    }

    const query = `UPDATE equipos SET ${campos.join(", ")} WHERE id = ?`;
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
        const query = "DELETE FROM equipos WHERE id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.affectedRows) return res.send("No se borro nada")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

export default router