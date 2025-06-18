document.getElementById("form1").addEventListener("submit", agNombre);
document.getElementById("form2").addEventListener("submit", agNumero);
document.getElementById("form3").addEventListener("submit", agPersona);

let arrayNombres = [];
let arrayNumeros = [];
let arrayPersonas = [];

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaNombres");

const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaNumeros");

const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPersonas");

function agNombre(e) {
  e.preventDefault();
  const input = document.getElementById("id1");
  const valor = input.value.trim();

  parrafo1.textContent = "";
  contenedor1.textContent = "";

  if (valor === "") {
    parrafo1.textContent = "Introduzca un nombre en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }

  arrayNombres.push(valor);
  contenedor1.textContent = arrayNombres.map(n => `Saludos ${n}`).join(", ");
  parrafo1.textContent = "Nombre agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";

  input.value = "";
}

function agNumero(e) {
  e.preventDefault();
  const input = document.getElementById("id2");
  const valor = input.value.trim();

  parrafo2.textContent = "";
  contenedor2.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo2.textContent = "Introduzca un número válido en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }

  const num = parseInt(valor);
  arrayNumeros.push(num);
  contenedor2.textContent = arrayNumeros.map(n => n * 2).join(", ");
  parrafo2.textContent = "Número agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";

  input.value = "";
}

function agPersona(e) {
  e.preventDefault();
  const nombreInput = document.getElementById("id3");
  const edadInput = document.getElementById("id4");

  const nombre = nombreInput.value.trim();
  const edad = edadInput.value.trim();

  parrafo3.textContent = "";
  contenedor3.textContent = "";

  if (nombre === "") {
    parrafo3.textContent = "Introduzca un nombre en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  if (edad === "" || isNaN(edad)) {
    parrafo3.textContent = "Introduzca una edad válida en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  const edadNum = parseInt(edad);
  arrayPersonas.push({ nombre, edad: edadNum });
  contenedor3.textContent = arrayPersonas
    .map(p => `${p.nombre}, ${p.edad} años`)
    .join(" | ");
  parrafo3.textContent = "Persona agregada exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";

  nombreInput.value = "";
  edadInput.value = "";
}
