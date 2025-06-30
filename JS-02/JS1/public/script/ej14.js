// agrego los arrays y los objetos
let arrayLetras = [];
let arrayNumeros = [];
let arrayTextos = [];

document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaLetras");
const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaNumeros");
const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaTexto");

function ag1(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id1").value.trim();
  parrafo1.textContent = "";
  contenedor1.textContent = "";
  //valido
  if (input.length !== 1) {
    parrafo1.textContent = "Introduzca una letra sola en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego, uso reverse y lo muestro
  arrayLetras.push(input);
  parrafo1.textContent = "Letra agregada exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  contenedor1.textContent = "Letras ingresadas: " + arrayLetras.join(", ");
  const invertidas = [...arrayLetras].reverse();
  contenedor1.textContent += "\nLetras invertidas: " + invertidas.join(", ");
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
  //agrego, uso reverse y lo muestro
  arrayNumeros.push(Number(input));
  parrafo2.textContent = "Numero agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  contenedor2.textContent = "Numeros ingresados: " + arrayNumeros.join(", ");
  const invertidos = [...arrayNumeros].reverse();
  contenedor2.textContent += "\nNumeros invertidos: " + invertidos.join(", ");
  input.value = "";
}
function ag3(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id3").value.trim();
  parrafo3.textContent = "";
  contenedor3.textContent = "";
  //valido
  if (input === "") {
    parrafo3.textContent = "Introduzca un texto en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego , uso reverse y lo muestro
  arrayTextos.push(input);
  parrafo3.textContent = "Texto agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  contenedor3.textContent = "Textos ingresados: " + arrayTextos.join(", ");
  const invertido = input.split("").reverse().join("");
  contenedor3.textContent += "\nTexto invertido: " + invertido;
  input.value = "";
}
