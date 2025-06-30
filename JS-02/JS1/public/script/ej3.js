// Asignacion de eventos a los formularios para capturar el envio
document.getElementById("form1").addEventListener("submit", color);
document.getElementById("form2").addEventListener("submit", tarea);
document.getElementById("form3").addEventListener("submit", usuario);

// Inicializacion de arrays para almacenar colores, tareas y usuarios
let colores = [];
let tareas = [];
let usuarios = [];

// Referencias a los mensajes en la derecha
let mensajeColores = document.getElementById("mensajeColores");
let mensajeTareas = document.getElementById("mensajeTareas");
let mensajeUsuario = document.getElementById("mensajeUsuario");

// Función para mostrar mensajes alineados a la derecha en los contenedores de resultados
function mostrarMensaje(elemento, texto, tipo) {
  if (tipo === "error") {
    elemento.className =
      " px-4 py-2 rounded-lg text-sm bg-red-900 border border-red-700 text-red-400 mb-2";
  } else if (tipo === "exito") {
    elemento.className =
      " px-4 py-2 rounded-lg text-sm bg-green-900 border border-green-700 text-green-400 mb-2";
  } else {
    elemento.className = "";
  }
  elemento.innerHTML = texto;
}

// Funcion para manejar el formulario de colores
function color(e) {
  e.preventDefault();

  let color1 = document.getElementById("color1").value.trim();
  let color2 = document.getElementById("color2").value.trim();
  let color3 = document.getElementById("color3").value.trim();

  if (!color1 || !color2 || !color3) {
    mostrarMensaje(mensajeColores, "Introduzca todos los colores.", "error");
    return;
  }

  colores.unshift(color1, color2, color3);
  mostrarMensaje(mensajeColores, "Colores: " + colores.join(", "), "exito");

  // Mostrar los colores en la lista
  document.getElementById("listaColores").textContent = colores.join(", ");
}

// Funcion para manejar el formulario de tareas
function tarea(e) {
  e.preventDefault();

  let tareaComun = document.getElementById("tareaComun").value.trim();
  let tareaUrgente = document.getElementById("tareaUrgente").value.trim();

  if (!tareaComun || !tareaUrgente) {
    mostrarMensaje(mensajeTareas, "Introduzca ambas tareas.", "error");
    return;
  }

  tareas.unshift(tareaUrgente);
  tareas.push(tareaComun);
  mostrarMensaje(mensajeTareas, "Tareas: " + tareas.join(", "), "exito");

  // Mostrar las tareas en la lista
  document.getElementById("listaTareas").textContent = tareas.join(", ");
}

// Funcion para manejar el formulario de usuarios
function usuario(e) {
  e.preventDefault();

  let usuari = document.getElementById("usuario").value.trim();

  if (!usuari) {
    mostrarMensaje(mensajeUsuario, "Introduzca un usuario.", "error");
    return;
  }

  usuarios.unshift(usuari);
  mostrarMensaje(mensajeUsuario, "Usuarios: " + usuarios.join(", "), "exito");

  // Mostrar el usuario en la lista
  document.getElementById("listaUsuario").textContent = usuarios.join(", ");
}
