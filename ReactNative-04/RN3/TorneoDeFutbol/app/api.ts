import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Ejemplo de uso:
// api.get('/teams').then(res => console.log(res.data));