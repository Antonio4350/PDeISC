// Arrays y objetos
let numeros = [];
let peliculas = [];
let array = [];

const parrafo1 = document.getElementById("warning1");
const contenedorNumeros = document.getElementById("listaNumeros");
const parrafo2 = document.getElementById("warning2");
const contenedorPeliculas = document.getElementById("listaPeliculas");
const parrafo3 = document.getElementById("warning3");
const contenedorArray = document.getElementById("listaArray");

document.getElementById("form1").addEventListener("submit", agNumero);
document.getElementById("copNumeros").addEventListener("click", copNumeros);
document.getElementById("form2").addEventListener("submit", peli);
document.getElementById("copPeliculas").addEventListener("click", copPeliculas);
document.getElementById("form3").addEventListener("submit", agarray);
document.getElementById("copArray").addEventListener("click", copArray);

function agNumero(e) {
  e.preventDefault();
  //inicializo
  let numero = document.getElementById("numero").value.trim();
  let numero2 = document.getElementById("numero2").value.trim();
  let numero3 = document.getElementById("numero3").value.trim();
  parrafo1.textContent = "";
  contenedorNumeros.textContent = "";
  //valido
  if (
    numero === "" ||
    isNaN(numero) ||
    numero2 === "" ||
    isNaN(numero2) ||
    numero3 === "" ||
    isNaN(numero3)
  ) {
    parrafo1.textContent = "Introduzca un numero valido en todos los campos";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego, muestro y limpio los inputs
  numeros.push(numero, numero2, numero3);
  contenedorNumeros.textContent = numeros.join(", ");
  parrafo1.textContent = "Numeros agregados exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  document.getElementById("numero").value = "";
  document.getElementById("numero2").value = "";
  document.getElementById("numero3").value = "";
}

function copNumeros(e) {
  e.preventDefault();
  //valido
  if (numeros.length === 0) {
    parrafo1.textContent = "No hay numeros para copiar";
    parrafo1.className = "text-sm text-center text-red-400";
    contenedorNumeros.textContent = "";
    return;
  }
  //copio con slice y muestro
  const cop = numeros.slice(0, 3);
  contenedorNumeros.textContent = cop.join(", ");
  parrafo1.textContent = "Tres elementos copiados desde el inicio";
  parrafo1.className = "text-sm text-center text-yellow-400";
}

function peli(e) {
  e.preventDefault();
  //inicializo
  let pelicula = document.getElementById("pelicula").value.trim();
  let pelicula2 = document.getElementById("pelicula2").value.trim();
  let pelicula3 = document.getElementById("pelicula3").value.trim();
  parrafo2.textContent = "";
  contenedorPeliculas.textContent = "";
  //valido
  if (pelicula === "" || pelicula2 === "" || pelicula3 === "") {
    parrafo2.textContent = "Introduzca una pelicula en todos los campos";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego, muestro y limpio
  peliculas.push(pelicula, pelicula2, pelicula3);
  contenedorPeliculas.textContent = peliculas.join(", ");
  parrafo2.textContent = "Peliculas agregadas exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  document.getElementById("pelicula").value = "";
  document.getElementById("pelicula2").value = "";
  document.getElementById("pelicula3").value = "";
}

function copPeliculas(e) {
  e.preventDefault();
  //valido
  if (peliculas.length < 3) {
    parrafo2.textContent = "No hay suficientes peliculas para copiar";
    parrafo2.className = "text-sm text-center text-red-400";
    contenedorPeliculas.textContent = "";
    return;
  }
  //copio y muestro
  const cop = peliculas.slice(2, 5);
  contenedorPeliculas.textContent = cop.join(", ");
  parrafo2.textContent = "Elementos copiados del 2 al 4";
  parrafo2.className = "text-sm text-center text-yellow-400";
}

function agarray(e) {
  e.preventDefault();
  //inicializo
  let elArray = document.getElementById("array").value.trim();
  let elArray2 = document.getElementById("array2").value.trim();
  let elArray3 = document.getElementById("array3").value.trim();
  parrafo3.textContent = "";
  contenedorArray.textContent = "";
  //valido
  if (elArray === "" || elArray2 === "" || elArray3 === "") {
    parrafo3.textContent = "Introduzca un texto en todos los campos";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego, muestro y limpio
  array.push(elArray, elArray2, elArray3);
  contenedorArray.textContent = array.join(", ");
  parrafo3.textContent = "Textos agregados exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  document.getElementById("array").value = "";
  document.getElementById("array2").value = "";
  document.getElementById("array3").value = "";
}

function copArray(e) {
  e.preventDefault();
  //valido
  if (array.length < 3) {
    parrafo3.textContent = "No hay suficientes textos para copiar";
    parrafo3.className = "text-sm text-center text-red-400";
    contenedorArray.textContent = "";
    return;
  }
  //cop y muestro
  const cop = array.slice(-3);
  contenedorArray.textContent = cop.join(", ");
  parrafo3.textContent = "Ultimos 3 textos copiados";
  parrafo3.className = "text-sm text-center text-yellow-400";
}
