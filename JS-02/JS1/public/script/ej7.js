// Arrays y objetos
let array1 = [];
let array2 = [];
let array3 = [];

let resultadoTexto = document.getElementById("listaTextos");
let resultadoNumero = document.getElementById("listaNumeros");
let resultadoCiudad = document.getElementById("listaCiudades");

let warningTexto = document.getElementById("warningResult1");
let warningNumero = document.getElementById("warningResult2");
let warningCiudad = document.getElementById("warningResult3");

document.getElementById("form1").addEventListener("submit", agTexto);
document.getElementById("event").addEventListener("click", busTexto);
document.getElementById("form2").addEventListener("submit", agNumero);
document.getElementById("event2").addEventListener("click", busNumero);
document.getElementById("form3").addEventListener("submit", agCiudad);
document.getElementById("event3").addEventListener("click", busCiudad);

function agTexto(e) {
  e.preventDefault();
  //inicializo
  let input = document.getElementById("id1").value.trim();
  warningTexto.textContent = "";
  resultadoTexto.textContent = "";
  //valido
  if (input === "") {
    warningTexto.textContent = "Introduzca un texto en el campo:";
    warningTexto.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego, convierto en minuscula y muestro
  array1.push(input.toLowerCase());
  resultadoTexto.textContent = array1.join(", ");
  warningTexto.textContent = "Texto ingresado correctamente.";
  warningTexto.className = "text-sm text-center text-green-400";
  input.value = "";
}

function busTexto(e) {
  e.preventDefault();
  //inicializo
  warningTexto.textContent = "";
  let index = array1.indexOf("perro");
  //valido y muestro res
  if (index === -1) {
    warningTexto.textContent = "La palabra no se encontró";
    warningTexto.className = "text-sm text-center text-red-400";
  } else {
    warningTexto.textContent = `Palabra encontrada en posición: ${index}`;
    warningTexto.className = "text-sm text-center text-green-400";
  }
}

function agNumero(e) {
  e.preventDefault();
  //inicializo
  let input = document.getElementById("id2").value.trim();
  warningNumero.textContent = "";
  resultadoNumero.textContent = "";
  //valido
  if (input === "" || isNaN(input)) {
    warningNumero.textContent = "Introduzca algunos numeros en el campo:";
    warningNumero.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego y mestro
  array2.push(input);
  resultadoNumero.textContent = array2.join(", ");
  warningNumero.textContent = "Numero ingresado correctamente.";
  warningNumero.className = "text-sm text-center text-green-400";
  input.value = "";
}

function busNumero(e) {
  e.preventDefault();
  //inicializo
  warningNumero.textContent = "";
  let index = array2.indexOf("50");
  //valido y muestro
  if (index === -1) {
    warningNumero.textContent = "El numero no se encontró";
    warningNumero.className = "text-sm text-center text-red-400";
  } else {
    warningNumero.textContent = `Numero encontrado en posición: ${index}`;
    warningNumero.className = "text-sm text-center text-green-400";
  }
}

function agCiudad(e) {
  e.preventDefault();
  //inicializo
  let input = document.getElementById("id3").value.trim();
  warningCiudad.textContent = "";
  resultadoCiudad.textContent = "";
  //valido
  if (input === "") {
    warningCiudad.textContent = "Introduzca algunas ciudades en el campo:";
    warningCiudad.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo muestro y limpio
  array3.push(input.toLowerCase());
  resultadoCiudad.textContent = array3.join(", ");
  warningCiudad.textContent = "Ciudad ingresada correctamente.";
  warningCiudad.className = "text-sm text-center text-green-400";
  input.value = "";
}

function busCiudad(e) {
  e.preventDefault();
  //inicializo
  warningCiudad.textContent = "";
  let index = array3.indexOf("madrid");
  //valido y muestro
  if (index === -1) {
    warningCiudad.textContent = "La ciudad no se encontró";
    warningCiudad.className = "text-sm text-center text-red-400";
  } else {
    warningCiudad.textContent = `Ciudad encontrada en posición: ${index}`;
    warningCiudad.className = "text-sm text-center text-green-400";
  }
}
