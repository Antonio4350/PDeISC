import express from "express";
import axios from "axios";
const app = express();
const PORT = 8081;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});