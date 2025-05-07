const express = require("express");
const app = express();
const path = require("path");//utilizamos el express y el path para el serv
const PORT =3000;

app.use(express.static(path.join(__dirname, "public")));//carpeta estatica publica donde vamos a estar trabajando

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','index.html'));//direccion del index
});
app.get("/ej1", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej1.html'));//direccion de las pags
});
app.get("/ej2", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej2.html'));
});
app.get("/ej3", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej3.html'));
});
app.get("/ej4", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej4.html'));
});
app.get("/ej5", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej5.html'));
});
app.get("/ej6", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej6.html'));
});
app.get("/ej7", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej7.html'));
});
app.get("/ej8", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej8.html'));
});
app.get("/ej9", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej9.html'));
});
app.get("/ej10", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej10.html'));
});
app.get("/ej11", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej11.html'));
});
app.get("/ej12", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej12.html'));
});
app.get("/ej13", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej13.html'));
});
app.get("/ej14", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ej14.html'));
});
app.get("/ejsecreto", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','ejsecreto.html'));
});


app.listen(3000, () => {//puerto
  console.log("http://localhost:"+PORT);
});
