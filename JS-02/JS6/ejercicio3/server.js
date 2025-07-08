import express from "express";
import axios from "axios";
const app = express();
const PORT = 8081;

app.use(express.static("public"));

app.get("/", (req, res) => {});

app.get("/api/usuarios", async (req, res) => {//uso axios para los usuarios y muestro el error si no funciona
  try {
    const respuesta = await axios.get("https://jsonplaceholder.typicode.com/users");
    res.json(respuesta.data); // se envía todo al cliente
  } catch (error) {
    res.json({ error: "Error al obtener usuarios" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
