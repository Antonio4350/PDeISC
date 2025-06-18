document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

let arrayNumeros = [];
let arrayPalabras = [];
let arrayPersonas = [];

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaNumeros");

const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaPalabras");

const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaPersonas");

function ag1(e) {
  e.preventDefault();

  const input = document.getElementById("id1");
  const valor = input.value.trim();

  parrafo1.textContent = "";
  contenedor1.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo1.textContent = "Introduzca un número en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }

  arrayNumeros.push(Number(valor));

  parrafo1.textContent = "Número agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";

  // Mostrar números ingresados
  contenedor1.textContent = "Números ingresados: " + arrayNumeros.join(", ");

  // Mostrar números ordenados
  const ordenados = [...arrayNumeros].sort((a, b) => a - b);
  contenedor1.textContent += "\nNúmeros ordenados: " + ordenados.join(", ");

  input.value = "";
}

function ag2(e) {
  e.preventDefault();

  const input = document.getElementById("id2");
  const valor = input.value.trim();

  parrafo2.textContent = "";
  contenedor2.textContent = "";

  if (valor === "") {
    parrafo2.textContent = "Introduzca una palabra en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }

  arrayPalabras.push(valor);

  parrafo2.textContent = "Palabra agregada exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";

  // Mostrar palabras ingresadas
  contenedor2.textContent = "Palabras ingresadas: " + arrayPalabras.join(", ");

  // Mostrar palabras ordenadas alfabéticamente
  const ordenadas = [...arrayPalabras].sort();
  contenedor2.textContent += "\nPalabras ordenadas alfabéticamente: " + ordenadas.join(", ");

  input.value = "";
}

function ag3(e) {
  e.preventDefault();

  const inputNombre = document.getElementById("id3");
  const inputEdad = document.getElementById("id4");
  const nombre = inputNombre.value.trim();
  const edadStr = inputEdad.value.trim();

  parrafo3.textContent = "";
  contenedor3.textContent = "";

  if (nombre === "") {
    parrafo3.textContent = "Introduzca un nombre en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  if (edadStr === "" || isNaN(edadStr)) {
    parrafo3.textContent = "Introduzca una edad válida en el campo";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  const edad = Number(edadStr);

  arrayPersonas.push({ nombre, edad });

  parrafo3.textContent = "Datos agregados exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";

  // Mostrar personas ingresadas
  let textoPersonas = "Usuarios ingresados: " + arrayPersonas.map(p => `${p.nombre} (${p.edad})`).join(", ");

  // Mostrar personas ordenadas por edad
  const ordenadas = [...arrayPersonas].sort((a, b) => a.edad - b.edad);
  textoPersonas += "\nUsuarios ordenados por edad: " + ordenadas.map(p => `${p.nombre} (${p.edad})`).join(", ");

  contenedor3.textContent = textoPersonas;

  inputNombre.value = "";
  inputEdad.value = "";
}
