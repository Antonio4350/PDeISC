import { Animal } from "./CZooAnimal.js";
import express from "express";
const app = express();
const PORT = 8081;
//importo la clase y creo un array de la clase para ingresar los animales en ella
const ANIMALES = [];

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get("/", (req, res) => {});
//recupero los datos de la pag y los ingreso al array
app.post("/guardar", (req, res) => {
  const { name, jaula, tipo, peso } = req.body;
  const animal = new Animal(name, jaula, tipo, peso);
  ANIMALES.push(animal);
});
//aca solo los muestro
app.get("/mostrar", (req, res) => {
  res.send(ANIMALES);
});

// escucho el puerto del servidor
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
