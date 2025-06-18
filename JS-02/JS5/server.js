const express = require('express');
const app = express();
const path = require('path');
const port = 8081;

// Middleware para archivos estáticos y JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
