// Arrays para guardar datos
let array1 = [];
let array2 = [];
let array3 = [];

// Elementos DOM donde se muestran resultados
let resultadoTexto = document.getElementById("listaTextos");
let resultadoNumero = document.getElementById("listaNumeros");
let resultadoCiudad = document.getElementById("listaCiudades");

// Elementos DOM donde se muestran mensajes (warnings)
let warningTexto = document.getElementById("warningResult1");
let warningNumero = document.getElementById("warningResult2");
let warningCiudad = document.getElementById("warningResult3");

// Eventos
document.getElementById("form1").addEventListener("submit", agTexto);
document.getElementById("event").addEventListener("click", busTexto);

document.getElementById("form2").addEventListener("submit", agNumero);
document.getElementById("event2").addEventListener("click", busNumero);

document.getElementById("form3").addEventListener("submit", agCiudad);
document.getElementById("event3").addEventListener("click", busCiudad);

// Función para agregar textos
function agTexto(e) {
  e.preventDefault();

  let input = document.getElementById("id1");
  let valor = input.value.trim();

  warningTexto.textContent = "";
  resultadoTexto.textContent = "";

  if (valor === "") {
    warningTexto.textContent = "Introduzca un texto en el campo:";
    warningTexto.className = "text-sm text-center text-red-400";
    return;
  }

  array1.push(valor.toLowerCase());

  resultadoTexto.textContent = array1.join(", ");
  warningTexto.textContent = "Texto ingresado correctamente.";
  warningTexto.className = "text-sm text-center text-green-400";

  input.value = "";
}

// Función para buscar texto "perro"
function busTexto(e) {
  e.preventDefault();

  warningTexto.textContent = "";

  let index = array1.indexOf("perro");

  if (index === -1) {
    warningTexto.textContent = "La palabra no se encontró";
    warningTexto.className = "text-sm text-center text-red-400";
  } else {
    warningTexto.textContent = `Palabra encontrada en posición: ${index}`;
    warningTexto.className = "text-sm text-center text-green-400";
  }
}

// Función para agregar números
function agNumero(e) {
  e.preventDefault();

  let input = document.getElementById("id2");
  let valor = input.value.trim();

  warningNumero.textContent = "";
  resultadoNumero.textContent = "";

  if (valor === "" || isNaN(valor)) {
    warningNumero.textContent = "Introduzca algunos números en el campo:";
    warningNumero.className = "text-sm text-center text-red-400";
    return;
  }

  array2.push(valor);

  resultadoNumero.textContent = array2.join(", ");
  warningNumero.textContent = "Número ingresado correctamente.";
  warningNumero.className = "text-sm text-center text-green-400";

  input.value = "";
}

// Función para buscar número 50
function busNumero(e) {
  e.preventDefault();

  warningNumero.textContent = "";

  let index = array2.indexOf("50");

  if (index === -1) {
    warningNumero.textContent = "El número no se encontró";
    warningNumero.className = "text-sm text-center text-red-400";
  } else {
    warningNumero.textContent = `Número encontrado en posición: ${index}`;
    warningNumero.className = "text-sm text-center text-green-400";
  }
}

// Función para agregar ciudades
function agCiudad(e) {
  e.preventDefault();

  let input = document.getElementById("id3");
  let valor = input.value.trim();

  warningCiudad.textContent = "";
  resultadoCiudad.textContent = "";

  if (valor === "") {
    warningCiudad.textContent = "Introduzca algunas ciudades en el campo:";
    warningCiudad.className = "text-sm text-center text-red-400";
    return;
  }

  array3.push(valor.toLowerCase());

  resultadoCiudad.textContent = array3.join(", ");
  warningCiudad.textContent = "Ciudad ingresada correctamente.";
  warningCiudad.className = "text-sm text-center text-green-400";

  input.value = "";
}

// Función para buscar ciudad "madrid"
function busCiudad(e) {
  e.preventDefault();

  warningCiudad.textContent = "";

  let index = array3.indexOf("madrid");

  if (index === -1) {
    warningCiudad.textContent = "La ciudad no se encontró";
    warningCiudad.className = "text-sm text-center text-red-400";
  } else {
    warningCiudad.textContent = `Ciudad encontrada en posición: ${index}`;
    warningCiudad.className = "text-sm text-center text-green-400";
  }
}
