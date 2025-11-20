const URL_BASE = 'http://localhost:3000/api';

export const api = {
  async login(email, password) {
    const respuesta = await fetch(`${URL_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!respuesta.ok) throw new Error('Error en login');
    return await respuesta.json();
  },

  async obtenerEquipos() {
    const respuesta = await fetch(`${URL_BASE}/equipos`);
    return await respuesta.json();
  },

  async crearEquipo(datos) {
    const respuesta = await fetch(`${URL_BASE}/equipos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  },

  async actualizarEquipo(id, datos) {
    const respuesta = await fetch(`${URL_BASE}/equipos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  },

  async eliminarEquipo(id) {
    const respuesta = await fetch(`${URL_BASE}/equipos/${id}`, {
      method: 'DELETE',
    });
    return await respuesta.json();
  },

  async obtenerJugadores() {
    const respuesta = await fetch(`${URL_BASE}/jugadores`);
    return await respuesta.json();
  },

  async crearJugador(datos) {
    const respuesta = await fetch(`${URL_BASE}/jugadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  },

  async actualizarJugador(id, datos) {
    const respuesta = await fetch(`${URL_BASE}/jugadores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  },

  async eliminarJugador(id) {
    const respuesta = await fetch(`${URL_BASE}/jugadores/${id}`, {
      method: 'DELETE',
    });
    return await respuesta.json();
  },

  async obtenerPartidos() {
    const respuesta = await fetch(`${URL_BASE}/partidos`);
    return await respuesta.json();
  },

  async crearPartido(datos) {
    const respuesta = await fetch(`${URL_BASE}/partidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  },

  async actualizarPartido(id, datos) {
    const respuesta = await fetch(`${URL_BASE}/partidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  },

  async eliminarPartido(id) {
    const respuesta = await fetch(`${URL_BASE}/partidos/${id}`, {
      method: 'DELETE',
    });
    return await respuesta.json();
  },
  async obtenerUsuarios() {
    const respuesta = await fetch(`${URL_BASE}/usuarios`);
    return await respuesta.json();
  },

  async cambiarRolUsuario(id, rol) {
    const respuesta = await fetch(`${URL_BASE}/usuarios/${id}/rol`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol }),
    });
    return await respuesta.json();
  },

};