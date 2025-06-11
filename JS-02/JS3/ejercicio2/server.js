const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Para guardar los números de la última subida (pueden estar en memoria)
let últimosNúmerosFiltrados = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para recibir texto del archivo y procesar
app.post('/sendFile', (req, res) => {
  const { file } = req.body;
  if (!file) {
    return res.status(400).json({ error: 'No hay contenido del archivo' });
  }

  const números = file
    .split(/\r?\n|\s+/) // dividir por salto de línea o espacios
    .filter(n => n.trim() !== '' && !isNaN(n))
    .map(n => n.trim());

  const válidos = [];
  const inválidos = [];

  números.forEach(num => {
    if (num[0] === num[num.length - 1]) válidos.push(Number(num));
    else inválidos.push(Number(num));
  });

  válidos.sort((a, b) => a - b);

  // Guardar en archivo filtrado.txt
  const contenidoGuardar = [
    'Números validos:',
    válidos.join('\n'),
    '',
    `Cantidad validos: ${válidos.length}`,
    `Cantidad invalidos: ${inválidos.length}`,
    `Porcentaje validos: ${((válidos.length / números.length) * 100).toFixed(2)}%`
  ].join('\n');

  fs.writeFile('filtrado.txt', contenidoGuardar, err => {
    if (err) {
      console.error('Error guardando filtrado.txt:', err);
      return res.status(500).json({ error: 'Error al guardar el archivo filtrado' });
    }

    // Guardamos para poder mostrar (opcional)
    últimosNúmerosFiltrados = válidos;

    res.json({
      message: 'Modificacion guardada',
      válidos,
      inválidosCount: inválidos.length,
      válidosCount: válidos.length,
      porcentajeVálidos: ((válidos.length / números.length) * 100).toFixed(2),
    });
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
