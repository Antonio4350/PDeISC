const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','index.html'));
});

app.get("/pag1", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','pag1.html'));
});

app.get("/pag2", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','pag2.html'));
});

app.get("/pag3", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','pag3.html'));
});

app.get("/pag4", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','pag4.html'));
});

app.get("/pag5", (req, res) => {
  res.sendFile(path.join(__dirname, 'public','pag','pag5.html'));
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
