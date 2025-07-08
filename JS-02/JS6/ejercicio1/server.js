import express from "express";
import axios from "axios";
const app = express();
const PORT = 8081;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {});

app.get("/api/fetch", async (req, res) => {
  try {
    //llamo a la api externa
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    //espero la respuesta y convierto la respuesta a json
    const data = await response.json();
    //devuelvo el json
    res.json(data);
    //muestro el error si no funciona
  } catch (err) {
    res.json({ error: "error al obtener usuarios con fetch" });
  }
});

app.get("/api/axios", async (req, res) => {
  try {//uso el axios para consultar en la api como en el fetch y espero la respuesta
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );//devuelvo los datos
    res.json(response.data);
  } catch (err) {//muestro error si lo hay
    res.json({ error: "error al obtener usuarios con axios" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
