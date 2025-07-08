import express from "express";
import axios from "axios";
const app = express();
const PORT = 8081;

app.use(express.static("public"));
app.use(express.json());//usando el express.json puedo leer los json

app.get("/", (req, res) => {});

//declaro aca afuera el usuario y la id por si mando con fetch o axios se valla aumentando la id
let usuarios = [];
let ultimoId = 1;

app.post("/api/fetch", async (req, res) => {
  const { name, email } = req.body;//uso el fetch, espero, ingreso los valores al nuevoUsuario y lo envio(muestro una res si no funciona)

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    await response.json(); 

    const nuevoUsuario = { id: ultimoId++, name, email };
    usuarios.push(nuevoUsuario);

    res.json({ ...nuevoUsuario, fuente: "fetch" });
  } catch (err) {
    res.json({ error: "error usando fetch" });
  }
});

app.post("/api/axios", async (req, res) => {
  const { name, email } = req.body;//uso el axios, ingreso los valores al nuevoUsuario y lo envio(muestro una res si no funciona)

  try {
    await axios.post("https://jsonplaceholder.typicode.com/users", {
      name,
      email,
    });

    const nuevoUsuario = { id: ultimoId++, name, email };
    usuarios.push(nuevoUsuario);

    res.json({ ...nuevoUsuario, fuente: "axios" });
  } catch (err) {
    res.json({ error: "error usando axios" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
