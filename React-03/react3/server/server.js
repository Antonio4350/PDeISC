import { main } from "./index.js";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors() );

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"));
});

app.get("/users", async (req, res) => {
  const aux = await main();
  res.json(aux);
});

main();

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
