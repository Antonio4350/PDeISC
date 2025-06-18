document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

let arraySuma = [];
let arrayMultiplica = [];
let arrayPrecio = [];

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaSuma");

const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaMultiplica");

const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPrecio");

function ag1(e) {
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

  arraySuma.push(valor);

  // Sumo todos los textos concatenándolos
  const sumaTexto = arraySuma.reduce((acum, texto) => acum + texto, "");

  contenedor1.textContent = `Textos ingresados: ${arraySuma.join(", ")}\nTextos juntos: ${sumaTexto}`;
  parrafo1.textContent = "Texto agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";

  input.value = "";
}

function ag2(e) {
  e.preventDefault();

  const input = document.getElementById("id2");
  const valor = input.value.trim();

  parrafo2.textContent = "";
  contenedor2.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo2.textContent = "Introduzca un número en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }

  const num = Number(valor);
  arrayMultiplica.push(num);

  // Multiplico todos los números
  const producto = arrayMultiplica.reduce((acum, n) => acum * n, 1);

  contenedor2.textContent = `Números ingresados: ${arrayMultiplica.join(", ")}\nNúmeros multiplicados: ${producto}`;
  parrafo2.textContent = "Número agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";

  input.value = "";
}

function ag3(e) {
  e.preventDefault();

  const input = document.getElementById("id3");
  const valor = input.value.trim();

  parrafo3.textContent = "";
  contenedor3.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo3.textContent = "Introduzca un número (precio) en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  const precioObj = { precio: parseInt(valor) };
  arrayPrecio.push(precioObj);

  // Sumo todos los precios
  const total = arrayPrecio.reduce((acum, obj) => acum + obj.precio, 0);

  contenedor3.textContent = `Precios ingresados: ${arrayPrecio.map(o => o.precio).join(", ")}\nTotal de los precios: ${total}`;
  parrafo3.textContent = "Precio agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";

  input.value = "";
}
