//agrego arrays y objetos
let arrayNombres = [];
let arrayNumeros = [];
let arrayPersonas = [];

document.getElementById("form1").addEventListener("submit", agNombre);
document.getElementById("form2").addEventListener("submit", agNumero);
document.getElementById("form3").addEventListener("submit", agPersona);

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaNombres");
const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaNumeros");
const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPersonas");

function agNombre(e) {
  e.preventDefault();
  // inicializo
  const input = document.getElementById("id1").value.trim();
  parrafo1.textContent = "";
  contenedor1.textContent = "";
  //valido
  if (input === "") {
    parrafo1.textContent = "Introduzca un nombre en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo, muestro y limpio usando .map
  arrayNombres.push(input);
  contenedor1.textContent = arrayNombres.map((n) => `Saludos ${n}`).join(", ");
  parrafo1.textContent = "Nombre agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  input.value = "";
}

function agNumero(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id2").value.trim();
  parrafo2.textContent = "";
  contenedor2.textContent = "";
  //valido
  if (input === "" || isNaN(input)) {
    parrafo2.textContent = "Introduzca un número válido en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  // guardo, muestro y limpio
  const num = parseInt(input);
  arrayNumeros.push(num);
  contenedor2.textContent = arrayNumeros.map((n) => n * 2).join(", ");
  parrafo2.textContent = "Número agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  input.value = "";
}

function agPersona(e) {
  e.preventDefault();
  //inicilizo
  const nombreInput = document.getElementById("id3").value.trim();
  const edadInput = document.getElementById("id4").value.trim();
  parrafo3.textContent = "";
  contenedor3.textContent = "";
  //valido nombre
  if (nombreInput === "") {
    parrafo3.textContent = "Introduzca un nombre en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //valido edad
  if (edadInput === "" || isNaN(edadInput)) {
    parrafo3.textContent = "Introduzca una edad válida en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo muestro y limpio usando .map
  const edadNum = parseInt(edadInput);
  arrayPersonas.push({ nombreInput, edadInput: edadNum });
  contenedor3.textContent = arrayPersonas
    .map((p) => `${p.nombreInput}, ${p.edadInput} años`)
    .join(" | ");
  parrafo3.textContent = "Persona agregada exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  nombreInput.value = "";
  edadInput.value = "";
}
