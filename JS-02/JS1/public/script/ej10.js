//agrego arrays y objetos
let arrayNumeros = [];
let arrayNombres = [];
let arrayPrecios = [];

document.getElementById("form1").addEventListener("submit", agNumero);
document.getElementById("form2").addEventListener("submit", agNombre);
document.getElementById("form3").addEventListener("submit", agPrecio);

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaNumeros");
const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaNombres");
const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPrecios");

function agNumero(e) {
  e.preventDefault();
//inicializo
  const input = document.getElementById("id1").value.trim();
  parrafo1.textContent = "";
  contenedor1.textContent = "";
//valido
  if (input === "" || isNaN(input)) {
    parrafo1.textContent = "Introduzca un numero valido en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
//uso el map para multiplicar por 3, lo muestro y limpio
  arrayNumeros.push(parseInt(input));
  const triplicados = arrayNumeros.map(n => n * 3);
  contenedor1.textContent = `Numeros ingresados: ${arrayNumeros.join(", ")}\nNumeros multiplicados *3: ${triplicados.join(", ")}`;
  parrafo1.textContent = "Numero agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";

  input.value = "";
}

function agNombre(e) {
  e.preventDefault();
//inicializo
  const input = document.getElementById("id2").value.trim();
  parrafo2.textContent = "";
  contenedor2.textContent = "";
//valido
  if (input === "") {
    parrafo2.textContent = "Introduzca un nombre en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
//guardo, modifico con el map, muestro y limpio
  arrayNombres.push(input);
  const mayusculas = arrayNombres.map(n => n.toUpperCase());
  contenedor2.textContent = `Nombres ingresados: ${arrayNombres.join(", ")}\nNombres en mayusculas: ${mayusculas.join(", ")}`;
  parrafo2.textContent = "Nombre agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  input.value = "";
}

function agPrecio(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id3").value.trim();
  parrafo3.textContent = "";
  contenedor3.textContent = "";
//valido
  if (input === "" || isNaN(input)) {
    parrafo3.textContent = "Introduzca un precio valido en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
//agrego al array, modifico con el map, muestro y limpio
  arrayPrecios.push(parseFloat(input));
  const conIva = arrayPrecios.map(p => (p * 1.21).toFixed(2));
  contenedor3.textContent = `Precios ingresados: ${arrayPrecios.join(", ")}\nPrecios con IVA: ${conIva.join(", ")}`;
  parrafo3.textContent = "Precio agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  input.value = "";
}
