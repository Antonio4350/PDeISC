// Declaracion de arrays para almacenar animales y productos
const animales = [];
const parrafo1 = document.getElementById("warningAnimales");
const contenedor1 = document.getElementById("listaAnimales");

const productos = [];
const parrafo2 = document.getElementById("warningSupermercado");
const contenedor2 = document.getElementById("listaProductos");

// Manejo del formulario para agregar animales
document
  .getElementById("formularioAnimales")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    parrafo1.textContent = "";

    const nuevoAnimal = document.getElementById("inAnimal").value.trim();
    if (nuevoAnimal === "") {
      parrafo1.textContent = "Ingrese un animal";
      parrafo1.className =
        "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-400";
      return;
    }

    animales.push(nuevoAnimal);
    actualizarListaAnimales();

    parrafo1.textContent = "Animal ingresado exitosamente";
    parrafo1.className =
      "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-400";
    document.getElementById("inAnimal").value = "";
  });

// Manejo del evento para eliminar el ultimo animal
document.getElementById("dlAnimal").addEventListener("click", () => {
  if (animales.length === 0) {
    parrafo1.textContent = "No hay animales para eliminar";
    parrafo1.className =
      "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-400";
    return;
  }

  animales.pop();
  actualizarListaAnimales();

  parrafo1.textContent = "Último animal eliminado";
  parrafo1.className =
    "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-400";
});

// Funcion para actualizar la lista visual de animales
function actualizarListaAnimales() {
  contenedor1.innerHTML = "";
  animales.forEach((a) => {
    contenedor1.innerHTML += `<p class="text-gray-300">${a}</p>`;
  });
}

// Manejo del formulario para agregar productos
document
  .getElementById("formularioSupermercado")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    parrafo2.textContent = "";

    const nuevoProducto = document.getElementById("inProducto").value.trim();
    if (nuevoProducto === "") {
      parrafo2.textContent = "Ingrese un producto";
      parrafo2.className =
        "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-400";
      return;
    }

    productos.push(nuevoProducto);
    actualizarListaProductos();

    parrafo2.textContent = "Producto ingresado exitosamente";
    parrafo2.className =
      "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-400";
    document.getElementById("inProducto").value = "";
  });

// Manejo del evento para eliminar el ultimo producto
document.getElementById("dlProducto").addEventListener("click", () => {
  if (productos.length === 0) {
    parrafo2.textContent = "No hay productos para eliminar";
    parrafo2.className =
      "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-400";
    return;
  }

  const eliminado = productos.pop();
  actualizarListaProductos();

  parrafo2.textContent = `Se elimino: ${eliminado}`;
  parrafo2.className =
    "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-400";
});

// Manejo del evento para eliminar todos los productos de la lista
document.getElementById("dlLista").addEventListener("click", () => {
  if (productos.length === 0) {
    parrafo2.textContent = "La lista ya esta vacia";
    parrafo2.className =
      "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-400";
    return;
  }
  productos.length = 0; // Vacía el array
  actualizarListaProductos();

  parrafo2.textContent = "Lista eliminada exitosamente";
  parrafo2.className =
    "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-400";
});

// Funcion para actualizar la lista visual de productos
function actualizarListaProductos() {
  contenedor2.innerHTML = "";
  productos.forEach((a) => {
    contenedor2.innerHTML += `<p class="text-gray-300">${a}</p>`;
  });
}
