import express from "express";
const app = express();
const PORT = 8081;

app.use(express.static("public"));

app.get("/api/alumnos", (req, res) => {//creo la api y le ingreso los datos, id, nombre, edad y envio
  const alumnos = [
    { id: 1, nombre: "Pepe", edad: 32 },
    { id: 2, nombre: "Peroncho", edad: 18 },
    { id: 3, nombre: "Martinnnnnn", edad: 45 },
  ];
  res.json(alumnos);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});