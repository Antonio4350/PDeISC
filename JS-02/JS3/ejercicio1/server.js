const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');
const port = 8081;

// Middleware para archivos estáticos y JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para guardar archivo
app.post('/guardarArchivo', async (req, res) => {
  const { fileName, data } = req.body;

  if (!fileName || !data) {
    return res.status(400).json({ error: 'Faltan datos: fileName o data' });
  }

  try {
    const filePath = path.join(__dirname, fileName);

    // Crea el archivo si no existe y lo sobrescribe si ya existe
    await fs.writeFile(filePath, data, 'utf-8');
    res.json({ message: 'Archivo guardado correctamente' });

  } catch (error) {
    console.error("Error al guardar:", error.message);
    res.status(500).json({ error: 'Error al guardar archivo: ' + error.message });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
