import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM partidos;");
        if (!rows.length) return res.send("No hay partidos");
        res.send(rows);
    } catch (error) {
        res.send(error);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.send("Faltan datos");

    try {
        const query = "SELECT * FROM partidos WHERE id = ?";
        const [rows] = await db.query(query, [id]);

        if (!rows.length) return res.send("No se encontró el partido");

        res.send(rows);
    } catch (error) {
        res.send(error);
    }
});

router.post("/", async (req, res) => {
    const {
        equipo_local,
        equipo_visitante,
        fecha,
        lugar,
        resultado,
        latitud,
        longitud
    } = req.body;

    if (!equipo_local || !equipo_visitante || !fecha || !lugar) {
        return res.send("Faltan datos obligatorios");
    }

    try {
        const query = `
            INSERT INTO partidos
            (equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [rows] = await db.query(query, [
            equipo_local,
            equipo_visitante,
            fecha,
            lugar,
            resultado || null,
            latitud || null,
            longitud || null
        ]);

        if (!rows.affectedRows) return res.send("No se pudo crear el partido");

        res.send(rows);
    } catch (error) {
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        equipo_local,
        equipo_visitante,
        fecha,
        lugar,
        resultado,
        latitud,
        longitud
    } = req.body;

    let campos = [];
    let valores = [];

    if (equipo_local !== undefined) {
        campos.push("equipo_local = ?");
        valores.push(equipo_local);
    }
    if (equipo_visitante !== undefined) {
        campos.push("equipo_visitante = ?");
        valores.push(equipo_visitante);
    }
    if (fecha !== undefined) {
        campos.push("fecha = ?");
        valores.push(fecha);
    }
    if (lugar !== undefined) {
        campos.push("lugar = ?");
        valores.push(lugar);
    }
    if (resultado !== undefined) {
        campos.push("resultado = ?");
        valores.push(resultado);
    }
    if (latitud !== undefined) {
        campos.push("latitud = ?");
        valores.push(latitud);
    }
    if (longitud !== undefined) {
        campos.push("longitud = ?");
        valores.push(longitud);
    }

    if (campos.length === 0) {
        return res.status(400).json({ msg: "No se enviaron campos para actualizar" });
    }

    const query = `UPDATE partidos SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(id);

    try {
        const [rows] = await db.query(query, valores);

        if (!rows.affectedRows) return res.send("No se cambió nada");

        res.send(rows);
    } catch (error) {
        res.send(error);
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) return res.send("Faltan datos");

    try {
        const query = "DELETE FROM partidos WHERE id = ?";
        const [rows] = await db.query(query, [id]);

        if (!rows.affectedRows) return res.send("No se borró nada");

        res.send(rows);
    } catch (error) {
        res.send(error);
    }
});

export default router;
