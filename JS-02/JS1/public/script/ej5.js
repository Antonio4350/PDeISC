// declaro arrays y objetos
let letras = [];
let nombres = [];
let elementos = [];

document.getElementById("form1").addEventListener("submit", agLetra);
document.getElementById("elLetras").addEventListener("click", elLetras);
document.getElementById("form2").addEventListener("submit", agNombre);
document.getElementById("remNombres").addEventListener("click", remNombres);
document.getElementById("form3").addEventListener("submit", agElemento);
document.getElementById("remElementos").addEventListener("click", remElementos);

let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");

function agLetra(e) {
  e.preventDefault();
  //inicializo
  let letra = document.getElementById("letra").value.trim();
  let letra2 = document.getElementById("letra2").value.trim();
  parrafo1.textContent = "";
  //valido
  if (letra === "" || letra2 === "" || letra.length > 1 || letra2.length > 1) {
    parrafo1.textContent = "Introduzca una letra en ambos campos";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo y muestro
  letras.push(letra, letra2);
  parrafo1.textContent = "Letras: " + letras.join(", ");
  parrafo1.className = "text-sm text-center text-green-400";
}

function elLetras(e) {
  e.preventDefault();
  //inicializo
  if (letras.length <= 1) {
    parrafo1.textContent = "No hay letras por eliminar.";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //elimino con splice y muestro
  letras.splice(1, 2);
  parrafo1.textContent =
    "Dos elementos eliminados desde pos 1: " + letras.join(", ");
  parrafo1.className = "text-sm text-center text-yellow-400";
}

function agNombre(e) {
  e.preventDefault();
  //inicializo
  let nombre = document.getElementById("nombre").value.trim();
  let nombre2 = document.getElementById("nombre2").value.trim();
  parrafo2.textContent = "";
  //valido
  if (nombre === "" || nombre2 === "") {
    parrafo2.textContent = "Introduzca ambos campos";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo y muestro
  nombres.push(nombre, nombre2);
  parrafo2.textContent = "Nombres: " + nombres.join(", ");
  parrafo2.className = "text-sm text-center text-green-400";
}

function remNombres(e) {
  e.preventDefault();
  //inicializo
  let nombre3 = document.getElementById("nombre3").value.trim();
  //valido
  if (nombre3 === "") {
    parrafo2.textContent = "Rellene aun que sea un campo.";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //elimino y muestro
  nombres.splice(1, 0, nombre3);
  parrafo2.textContent = "Array modificado exitosamente: " + nombres.join(", ");
  parrafo2.className = "text-sm text-center text-green-400";
}

function agElemento(e) {
  e.preventDefault();
  //inicializo
  let elemento = document.getElementById("elemento").value.trim();
  let elemento2 = document.getElementById("elemento2").value.trim();
  parrafo3.textContent = "";
  //valido
  if (elemento === "" || elemento2 === "") {
    parrafo3.textContent = "Introduzca ambos campos";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego y muestro
  elementos.push(elemento, elemento2);
  parrafo3.textContent = "Elementos: " + elementos.join(", ");
  parrafo3.className = "text-sm text-center text-green-400";
}

function remElementos(e) {
  e.preventDefault();
  //ingreso
  let elemento3 = document.getElementById("elemento3").value.trim();
  let elemento4 = document.getElementById("elemento4").value.trim();
  //valido
  if (elemento3 === "" || elemento4 === "") {
    parrafo3.textContent = "Rellene aun que sea un campo.";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //elimino y muestro
  elementos.splice(1, 2, elemento3, elemento4);
  parrafo3.textContent =
    "Array modificado exitosamente: " + elementos.join(", ");
  parrafo3.className = "text-sm text-center text-green-400";
}
