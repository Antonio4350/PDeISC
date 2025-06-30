//agrego arrays y los objetos
let array1 = [];
let array2 = [];
let array3 = [];

document.getElementById("form1").addEventListener("submit", agTexto);
document.getElementById("event").addEventListener("click", busTexto);
document.getElementById("form2").addEventListener("submit", agColor);
document.getElementById("event2").addEventListener("click", busColor);
document.getElementById("form3").addEventListener("submit", agNumero);

let parrafo1 = document.getElementById("warningTexto");
let contenedor1 = document.getElementById("listaTexto");
let parrafo2 = document.getElementById("warningColores");
let contenedor2 = document.getElementById("listaColores");
let parrafo3 = document.getElementById("warningNumeros");
let contenedor3 = document.getElementById("listaNumeros");

function agTexto(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id1").value.trim();
  parrafo1.textContent = "";
  contenedor1.textContent = "";
  //valido
  if (input === "") {
    parrafo1.textContent = "Introduzca un texto en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego muestro y limpio
  array1.push(input.toLowerCase());
  contenedor1.textContent = array1.join(", ");
  parrafo1.textContent = "Texto ingresado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  input.value = "";
}

function busTexto(e) {
  e.preventDefault();
  //busco y muestro res
  if (array1.includes("admin")) {
    parrafo1.textContent = "Palabra encontrada";
    parrafo1.className = "text-sm text-center text-yellow-400";
  } else {
    parrafo1.textContent = "La palabra no se encontro";
    parrafo1.className = "text-sm text-center text-red-400";
  }
}

function agColor(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id2").value.trim();
  parrafo2.textContent = "";
  contenedor2.textContent = "";
  //valido
  if (input === "" || !isNaN(input)) {
    parrafo2.textContent = "Introduzca un color en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo muestro y limpio
  array2.push(input.toLowerCase());
  contenedor2.textContent = array2.join(", ");
  parrafo2.textContent = "Color ingresado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  input.value = "";
}

// Función buscar color "verde"
function busColor(e) {
  e.preventDefault();
  //busco y muestro res
  if (array2.includes("verde")) {
    parrafo2.textContent = "El color si existe en el array";
    parrafo2.className = "text-sm text-center text-yellow-400";
  } else {
    parrafo2.textContent = "El color no existe en el array";
    parrafo2.className = "text-sm text-center text-red-400";
  }
}

function agNumero(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id3").value.trim();
  parrafo3.textContent = "";
  contenedor3.textContent = "";
  //valido
  if (input === "" || isNaN(input)) {
    parrafo3.textContent = "Introduzca un numero valido en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //verifico el num
  if (array3.includes(input)) {
    parrafo3.textContent = "El numero ya esta ingresado en el array";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo muestro y limpio
  array3.push(input);
  contenedor3.textContent = array3.join(", ");
  parrafo3.textContent = "Numero ingresado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  input.value = "";
}
