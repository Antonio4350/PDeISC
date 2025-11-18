require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:8081', credentials: true }));
app.use(express.json());

// Rutas base para ABML
app.use('/api/teams', require('./routes/teams'));
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/users', require('./routes/users'));
app.use('/api/statistics', require('./routes/statistics'));

app.get('/', (req, res) => {
  res.send('API Torneo de Futbol funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});