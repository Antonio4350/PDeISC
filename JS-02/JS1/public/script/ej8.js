// Eventos
document.getElementById("form1").addEventListener("submit", agTexto);
document.getElementById("event").addEventListener("click", busTexto);
document.getElementById("form2").addEventListener("submit", agColor);
document.getElementById("event2").addEventListener("click", busColor);
document.getElementById("form3").addEventListener("submit", agNumero);

// Arrays para guardar datos
let array1 = [];
let array2 = [];
let array3 = [];

// Elementos DOM para mostrar mensajes y resultados (mensajes a la derecha)
let parrafo1 = document.getElementById("warningTexto");
let contenedor1 = document.getElementById("listaTexto");

let parrafo2 = document.getElementById("warningColores");
let contenedor2 = document.getElementById("listaColores");

let parrafo3 = document.getElementById("warningNumeros");
let contenedor3 = document.getElementById("listaNumeros");

// Función agregar texto
function agTexto(e) {
  e.preventDefault();
  const input = document.getElementById("id1");
  const valor = input.value.trim();

  parrafo1.textContent = "";
  contenedor1.textContent = "";

  if (valor === "") {
    parrafo1.textContent = "Introduzca un texto en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }

  array1.push(valor.toLowerCase());
  contenedor1.textContent = array1.join(", ");
  parrafo1.textContent = "Texto ingresado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";

  input.value = "";
}

// Función buscar texto "admin"
function busTexto(e) {
  e.preventDefault();

  if (array1.includes("admin")) {
    parrafo1.textContent = "Palabra encontrada";
    parrafo1.className = "text-sm text-center text-yellow-400";
  } else {
    parrafo1.textContent = "La palabra no se encontró";
    parrafo1.className = "text-sm text-center text-red-400";
  }
}

// Función agregar color
function agColor(e) {
  e.preventDefault();
  const input = document.getElementById("id2");
  const valor = input.value.trim();

  parrafo2.textContent = "";
  contenedor2.textContent = "";

  if (valor === "" || !isNaN(valor)) {
    parrafo2.textContent = "Introduzca un color en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }

  array2.push(valor.toLowerCase());
  contenedor2.textContent = array2.join(", ");
  parrafo2.textContent = "Color ingresado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";

  input.value = "";
}

// Función buscar color "verde"
function busColor(e) {
  e.preventDefault();

  if (array2.includes("verde")) {
    parrafo2.textContent = "El color sí existe en el array";
    parrafo2.className = "text-sm text-center text-yellow-400";
  } else {
    parrafo2.textContent = "El color no existe en el array";
    parrafo2.className = "text-sm text-center text-red-400";
  }
}

// Función agregar número
function agNumero(e) {
  e.preventDefault();
  const input = document.getElementById("id3");
  const valor = input.value.trim();

  parrafo3.textContent = "";
  contenedor3.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo3.textContent = "Introduzca un número válido en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  if (array3.includes(valor)) {
    parrafo3.textContent = "El número ya está ingresado en el array";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  array3.push(valor);
  contenedor3.textContent = array3.join(", ");
  parrafo3.textContent = "Número ingresado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";

  input.value = "";
}
