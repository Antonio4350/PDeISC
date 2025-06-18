document.getElementById("form1").addEventListener("submit", agNumero);
document.getElementById("form2").addEventListener("submit", agNombre);
document.getElementById("form3").addEventListener("submit", agPrecio);

let arrayNumeros = [];
let arrayNombres = [];
let arrayPrecios = [];

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaNumeros");

const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaNombres");

const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPrecios");

function agNumero(e) {
  e.preventDefault();

  const input = document.getElementById("id1");
  const valor = input.value.trim();

  parrafo1.textContent = "";
  contenedor1.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo1.textContent = "Introduzca un número válido en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }

  const num = parseInt(valor);
  arrayNumeros.push(num);

  const triplicados = arrayNumeros.map(n => n * 3);

  contenedor1.textContent = `Números ingresados: ${arrayNumeros.join(", ")}\nNumeros multiplicados *3: ${triplicados.join(", ")}`;
  parrafo1.textContent = "Número agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";

  input.value = "";
}

function agNombre(e) {
  e.preventDefault();

  const input = document.getElementById("id2");
  const valor = input.value.trim();

  parrafo2.textContent = "";
  contenedor2.textContent = "";

  if (valor === "") {
    parrafo2.textContent = "Introduzca un nombre en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }

  arrayNombres.push(valor);

  const mayusculas = arrayNombres.map(n => n.toUpperCase());

  contenedor2.textContent = `Nombres ingresados: ${arrayNombres.join(", ")}\nNombres en mayúsculas: ${mayusculas.join(", ")}`;
  parrafo2.textContent = "Nombre agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";

  input.value = "";
}

function agPrecio(e) {
  e.preventDefault();

  const input = document.getElementById("id3");
  const valor = input.value.trim();

  parrafo3.textContent = "";
  contenedor3.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo3.textContent = "Introduzca un precio válido en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  const precio = parseFloat(valor);
  arrayPrecios.push(precio);

  const conIva = arrayPrecios.map(p => (p * 1.21).toFixed(2));

  contenedor3.textContent = `Precios ingresados: ${arrayPrecios.join(", ")}\nPrecios con IVA: ${conIva.join(", ")}`;
  parrafo3.textContent = "Precio agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";

  input.value = "";
}
