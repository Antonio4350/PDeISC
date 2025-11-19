import express from "express"
import cors from "cors"
import { db } from "./db.js"
import usersRoutes from "./routes/users.js"
import equiposRoutes from "./routes/equipos.js"
import jugadoresRoutes from "./routes/jugadores.js"
import estadisticasRoutes from "./routes/estadisticas.js"
import partidosRoutes from "./routes/partidos.js"


const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/users", usersRoutes)
app.use("/api/equipos", equiposRoutes)
app.use("/api/jugadores", jugadoresRoutes)
app.use("/api/estadisticas", estadisticasRoutes)
app.use("/api/partidos", partidosRoutes)

app.get("/", async (req, res) => {
    const [rows] = await db.query("SHOW TABLEs")
    console.log(rows)
    res.send("Server is running")
})

app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on port 3000")
})
