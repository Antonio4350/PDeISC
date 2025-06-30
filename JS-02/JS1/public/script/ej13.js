//agrego arrays y los objetos
let arrayNumeros = [];
let arrayPalabras = [];
let arrayPersonas = [];

document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaNumeros");
const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaPalabras");
const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPersonas");

function ag1(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id1").value.trim();
  parrafo1.textContent = "";
  contenedor1.textContent = "";
  //valido
  if (input === "" || isNaN(input)) {
    parrafo1.textContent = "Introduzca un numero en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo, uso sort y muestro
  arrayNumeros.push(Number(input));
  parrafo1.textContent = "Numero agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  contenedor1.textContent = "Numeros ingresados: " + arrayNumeros.join(", ");
  const ordenados = [...arrayNumeros].sort((a, b) => a - b);
  contenedor1.textContent += "\nNumeros ordenados: " + ordenados.join(", ");
  input.value = "";
}

function ag2(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id2").value.trim();
  parrafo2.textContent = "";
  contenedor2.textContent = "";
  //valido
  if (input === "") {
    parrafo2.textContent = "Introduzca una palabra en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo y modifico con el sort
  arrayPalabras.push(input);
  parrafo2.textContent = "Palabra agregada exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  contenedor2.textContent = "Palabras ingresadas: " + arrayPalabras.join(", ");
  const ordenadas = [...arrayPalabras].sort();
  contenedor2.textContent +=
    "\nPalabras ordenadas alfabéticamente: " + ordenadas.join(", ");
  input.value = "";
}

function ag3(e) {
  e.preventDefault();
  //inicializo
  const inputNombre = document.getElementById("id3").value.trim();
  const inputEdad = document.getElementById("id4").value.trim();
  parrafo3.textContent = "";
  contenedor3.textContent = "";
  //hago dos validaciones una por input
  if (inputNombre === "") {
    parrafo3.textContent = "Introduzca un nombre en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  if (inputEdad === "" || isNaN(inputEdad)) {
    parrafo3.textContent = "Introduzca una edad válida en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //guardo los datos y aviso
  const edad = Number(inputEdad);
  arrayPersonas.push({ inputNombre, edad });
  parrafo3.textContent = "Datos agregados exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  //muestro usuarios(nombre,edad) usando sort
  let textoPersonas =
    "Usuarios ingresados: " +
    arrayPersonas.map((p) => `${p.inputNombre} (${p.edad})`).join(", ");
  const ordenadas = [...arrayPersonas].sort((a, b) => a.edad - b.edad);
  textoPersonas +=
    "\nUsuarios ordenados por edad: " +
    ordenadas.map((p) => `${p.inputNombre} (${p.edad})`).join(", ");
  contenedor3.textContent = textoPersonas;
  inputNombre.value = "";
  inputEdad.value = "";
}
