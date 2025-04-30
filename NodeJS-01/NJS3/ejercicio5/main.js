const express = require("express");
const app = express();
const path = require("path");//utilizamos el express y el path para el serv

app.use(express.static(path.join(__dirname, "public")));//carpeta estatica publica donde vamos a estar trabajando

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','index.html'));//direccion del index
});

app.listen(3000, () => {//puerto
  console.log("http://localhost:3000");
});
