//agrego arrays y los objetos
let arraySuma = [];
let arrayMultiplica = [];
let arrayPrecio = [];

document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaSuma");
const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaMultiplica");
const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPrecio");

function ag1(e) {
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
  //agrego, uso reduce y muestro
  arraySuma.push(input);
  const sumaTexto = arraySuma.reduce((acum, texto) => acum + texto, "");
  contenedor1.textContent = `Textos ingresados: ${arraySuma.join(
    ", "
  )}\nTextos juntos: ${sumaTexto}`;
  parrafo1.textContent = "Texto agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  input.value = "";
}

function ag2(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id2").value.trim();
  parrafo2.textContent = "";
  contenedor2.textContent = "";
  //valido
  if (input === "" || isNaN(input)) {
    parrafo2.textContent = "Introduzca un numero en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego, uso reduce y muestro
  arrayMultiplica.push(input);
  const producto = arrayMultiplica.reduce((acum, n) => acum * n, 1);
  contenedor2.textContent = `Numeros ingresados: ${arrayMultiplica.join(
    ", "
  )}\nNumeros multiplicados: ${producto}`;
  parrafo2.textContent = "Numero agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  input.value = "";
}

function ag3(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id3").value.trim();
  parrafo3.textContent = "";
  contenedor3.textContent = "";
  //valido
  if (input === "" || isNaN(input)) {
    parrafo3.textContent = "Introduzca un numero (precio) en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego, modifico con reduce y lo muestro
  const precioObj = { precio: parseInt(input) };
  arrayPrecio.push(precioObj);
  const total = arrayPrecio.reduce((acum, obj) => acum + obj.precio, 0);
  contenedor3.textContent = `Precios ingresados: ${arrayPrecio
    .map((o) => o.precio)
    .join(", ")}\nTotal de los precios: ${total}`;
  parrafo3.textContent = "Precio agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  input.value = "";
}
