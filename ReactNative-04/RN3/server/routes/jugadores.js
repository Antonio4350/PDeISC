import express from "express"
import { db } from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM jugadores;")
        if(!rows.length) return res.send("No hay jugadores")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    if(!id) return res.send("Faltan datos")
    try{
        const query = "SELECT * FROM jugadores WHERE id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.length) return res.send("No se encontro el jugador")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.post("/", async (req, res) => {
    const { nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto } = req.body
    if(!nombre || !apellido || !edad || !posicion || !numero_casaca || !equipo_id || !foto) {
        return  res.send("Faltan datos")
    }
    try {
        const query = "INSERT INTO jugadores(nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto) VALUES (?, ?, ?, ?, ?, ?, ?);"
        const [rows] = await db.query(query, [nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto])
        if(!rows.affectedRows) return res.send("No se pudo crear el jugadores")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        apellido,
        edad,
        posicion,
        numero_casaca,
        equipo_id,
        foto
    } = req.body;

    let campos = [];
    let valores = [];

    if (nombre !== undefined) {
        campos.push("nombre = ?");
        valores.push(nombre);
    }
    if (apellido !== undefined) {
        campos.push("apellido = ?");
        valores.push(apellido);
    }
    if (edad !== undefined) {
        campos.push("edad = ?");
        valores.push(edad);
    }
    if (posicion !== undefined) {
        campos.push("posicion = ?");
        valores.push(posicion);
    }
    if (numero_casaca !== undefined) {
        campos.push("numero_casaca = ?");
        valores.push(numero_casaca);
    }
    if (equipo_id !== undefined) {
        campos.push("equipo_id = ?");
        valores.push(equipo_id);
    }
    if (foto !== undefined) {
        campos.push("foto = ?");
        valores.push(foto);
    }

    // Si no mandaron ningún campo
    if (campos.length === 0) {
        return res.status(400).json({ msg: "No se enviaron campos para actualizar" });
    }

    const query = `UPDATE jugadores SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(id);

    try {
        const [rows] = await db.query(query, valores);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ msg: "Jugador no encontrado o sin cambios" });
        }

        res.json({ msg: "Jugador actualizado correctamente", cambios: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    if(!id) return res.send("Faltan datos")
    try {
        const query = "DELETE FROM jugadores WHERE id = ?"
        const [rows] = await db.query(query, [id])
        if(!rows.affectedRows) return res.send("No se borro nada")
        res.send(rows)
    } catch (error) {
        res.send(error)
    }
})

export default router