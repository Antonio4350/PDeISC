//agrego arrays y los objetos a utilizar
let arrayNumeros = [];
let arrayTextos = [];
let arrayUsuarios = [];

document.getElementById("form1").addEventListener("submit", agNumero);
document.getElementById("form2").addEventListener("submit", agTexto);
document.getElementById("form3").addEventListener("submit", agUsuario);

const parrafo1 = document.getElementById("warning1");
const contenedor1 = document.getElementById("listaNumeros");
const parrafo2 = document.getElementById("warning2");
const contenedor2 = document.getElementById("listaTexto");
const parrafo3 = document.getElementById("warning3");
const contenedor3 = document.getElementById("listaUsuarios");

function agNumero(e) {
  e.preventDefault();
  // inicializo
  const input = document.getElementById("id1");
  const valor = input.value.trim();
  parrafo1.textContent = "";
  contenedor1.textContent = "";
  //valido
  if (valor === "" || isNaN(valor) || Number(valor) < 10) {
    parrafo1.textContent = "Introduzca un numero mayor a 10 en el campo";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego al array uso el filter y lo muestro
  arrayNumeros.push(parseInt(valor));
  const mayores = arrayNumeros.filter((n) => n >= 10);
  contenedor1.textContent = `Numeros ingresados: ${arrayNumeros.join(
    ", "
  )}\nNumeros mayores o iguales a 10: ${mayores.join(", ")}`;
  parrafo1.textContent = "Numero agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  input.value = "";
}

function agTexto(e) {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("id2");
  const valor = input.value.trim();
  parrafo2.textContent = "";
  contenedor2.textContent = "";
  //valido
  if (valor === "") {
    parrafo2.textContent = "Introduzca un texto en el campo";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego al array uso el filter y lo muestro
  arrayTextos.push(valor);
  const largos = arrayTextos.filter((p) => p.length > 5);
  contenedor2.textContent = `Textos ingresados: ${arrayTextos.join(
    ", "
  )}\nTextos mayores a 5 letras: ${largos.join(", ")}`;
  parrafo2.textContent = "Texto agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  input.value = "";
}

function agUsuario(e) {
  e.preventDefault();
  //inicializo
  const inputNombre = document.getElementById("id3");
  const inputActivo = document.getElementById("id4");
  parrafo3.textContent = "";
  contenedor3.textContent = "";
  const nombre = inputNombre.value.trim();
  const activo = inputActivo.checked;
  //valido
  if (nombre === "") {
    parrafo3.textContent = "Introduzca un nombre para el usuario";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego al array, uso filter y lo muestro
  arrayUsuarios.push({ nombre, activo });
  const activos = arrayUsuarios.filter((u) => u.activo);
  contenedor3.innerHTML = `Usuarios ingresados:<br>${arrayUsuarios
    .map((u) => `${u.nombre} (${u.activo ? "activo" : "inactivo"})`)
    .join(", ")}<br><br>Usuarios activos:<br>${activos
    .map((u) => u.nombre)
    .join(", ")}`;
  parrafo3.textContent = "Usuario agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  inputNombre.value = "";
  inputActivo.checked = false;
}
