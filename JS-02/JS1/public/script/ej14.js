document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

let arrayLetras = [];
let arrayNumeros = [];
// Para el texto no guardamos en array global porque se procesa cada vez

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaLetras");

const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaNumeros");

const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaTexto");

function ag1(e) {
  e.preventDefault();

  const input = document.getElementById("id1");
  const valor = input.value.trim();

  parrafo1.textContent = "";
  contenedor1.textContent = "";

  if (valor.length !== 1) {
    parrafo1.textContent = "Introduzca una letra sola en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }

  arrayLetras.push(valor);

  parrafo1.textContent = "Letra agregada exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";

  contenedor1.textContent = "Letras ingresadas: " + arrayLetras.join(", ");

  const invertidas = [...arrayLetras].reverse();
  contenedor1.textContent += "\nLetras invertidas: " + invertidas.join(", ");

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

  arrayNumeros.push(Number(valor));

  parrafo2.textContent = "Número agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";

  contenedor2.textContent = "Números ingresados: " + arrayNumeros.join(", ");

  const invertidos = [...arrayNumeros].reverse();
  contenedor2.textContent += "\nNúmeros invertidos: " + invertidos.join(", ");

  input.value = "";
}

function ag3(e) {
  e.preventDefault();

  const input = document.getElementById("id3");
  const valor = input.value.trim();

  parrafo3.textContent = "";
  contenedor3.textContent = "";

  if (valor === "") {
    parrafo3.textContent = "Introduzca un texto en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  parrafo3.textContent = "Texto agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";

  contenedor3.textContent = "Texto ingresado: " + valor;

  const invertido = valor.split("").reverse().join("");
  contenedor3.textContent += "\nTexto invertido: " + invertido;

  input.value = "";
}
