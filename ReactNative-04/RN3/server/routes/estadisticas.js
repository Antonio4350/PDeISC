import express from "express"
import { db } from "../db.js"
import bcrypt from "bcrypt"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM estadisticas;")
        if(!rows.length) return res.send("No hay estadisticas")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    if(!id) return res.send("Faltan datos")
    try {
        const query = "SELECT * FROM estadisticas WHERE partido_id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.length) return res.send("No se encontro la estadistica")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.post("/", async (req, res) => {
    const { partido_id, jugador_id, goles, tarjetas } = req.body
    if(!partido_id || !jugador_id || goles === undefined || tarjetas === undefined) {
        return  res.send("Faltan datos")
    }
    try {
        const query = "INSERT INTO estadisticas(partido_id, jugador_id, goles, tarjetas) VALUES (?, ?, ?, ?);"
        const [rows] = await db.query(query, [partido_id, jugador_id, goles, tarjetas])
        res.send(rows)
    } catch (error){
        res.send(error)
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        jugador_id,
        partido_id,
        tarjetas,
        goles
    } = req.body;

    let campos = [];
    let valores = [];

    if (jugador_id !== undefined) {
        campos.push("jugador_id = ?");
        valores.push(jugador_id);
    }
    if (partido_id !== undefined) {
        campos.push("partido_id = ?");
        valores.push(partido_id);
    }
    if (tarjetas !== undefined) {
        campos.push("tarjetas = ?");
        valores.push(tarjetas);
    }
    if (goles !== undefined) {
        campos.push("goles = ?");
        valores.push(goles);
    }

    // Si no se manda ningún campo
    if (campos.length === 0) {
        return res.status(400).json({ msg: "No se enviaron campos para actualizar" });
    }

    const query = `UPDATE tabla SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(id);

    try {
        const [rows] = await db.query(query, valores);

        if (!rows.affectedRows) {
            return res.send("No se cambió nada");
        }

        res.send(rows);
    } catch (error) {
        res.send(error);
    }
});


router.delete("/:id", async (req, res) => {
    const { id } = req.params
    if(!id) return res.send("Faltan datos")
    try {
        const query = "DELETE FROM estadisticas WHERE id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.affectedRows) return res.send("No se borro nada")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})


export default router