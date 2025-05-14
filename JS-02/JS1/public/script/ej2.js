// Declaracion de arrays para almacenar animales y productos
const animales = [];
const parrafo1 = document.getElementById("warningAnimales");
const contenedor1 = document.getElementById("listaAnimales");

const productos = [];
const parrafo2 = document.getElementById("warningSupermercado");
const contenedor2 = document.getElementById("listaProductos");

// Manejo del formulario para agregar animales
document.getElementById("formulario1").addEventListener("submit", e => {
    e.preventDefault(); // Previene la recarga de la pagina
    parrafo1.innerHTML = ""; // Limpiar cualquier mensaje previo

    const nuevoAnimal = document.getElementById("inAnimal").value.trim(); // Obtener el valor del animal ingresado
    // Validar si el campo esta vacio
    if (nuevoAnimal === "") {
        parrafo1.textContent = "Ingrese un animal"; // Mensaje de error
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si el campo esta vacio
    }

    animales.push(nuevoAnimal); // Agregar el animal al array
    actualizarListaAnimales(); // Actualizar la lista visual de animales

    // Mensaje de exito
    parrafo1.textContent = "Animal ingresado exitosamente";
    parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
    document.getElementById("inAnimal").value = ""; // Limpiar el input
});

// Manejo del evento para eliminar el ultimo animal
document.getElementById("dlAnimal").addEventListener("click", () => {
    if (animales.length === 0) {
        parrafo1.textContent = "No hay animales para eliminar"; // Mensaje si el array esta vacio
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si no hay animales para eliminar
    }

    animales.pop(); // Eliminar el ultimo animal
    actualizarListaAnimales(); // Actualizar la lista visual de animales

    // Mensaje de exito
    parrafo1.textContent = "Ultimo animal eliminado";
    parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
});

// Funcion para actualizar la lista visual de animales
function actualizarListaAnimales() {
    contenedor1.innerHTML = ""; // Limpiar la lista visual
    animales.forEach(a => {
        contenedor1.innerHTML += `<p class="text-gray-700">${a}</p>`; // Agregar cada animal a la lista
    });
}

// Manejo del formulario para agregar productos
document.getElementById("formulario2").addEventListener("submit", e =>{
    e.preventDefault(); // Previene la recarga de la pagina
    parrafo1.innerHTML = ""; // Limpiar cualquier mensaje previo

    const nuevoProducto = document.getElementById("inProducto").value.trim(); // Obtener el valor del producto ingresado
    // Validar si el campo esta vacio
    if (nuevoProducto === "") {
        parrafo2.textContent = "Ingrese un producto"; // Mensaje de error
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si el campo esta vacio
    }

    productos.push(nuevoProducto); // Agregar el producto al array
    actualizarListaProductos(); // Actualizar la lista visual de productos

    // Mensaje de exito
    parrafo2.textContent = "Producto ingresado exitosamente";
    parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
    document.getElementById("inProducto").value = ""; // Limpiar el input
});

// Manejo del evento para eliminar el ultimo producto
document.getElementById("dlProducto").addEventListener("click", () => {
    if (productos.length === 0) {
        parrafo2.textContent = "No hay productos para eliminar"; // Mensaje si el array esta vacio
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si no hay productos para eliminar
    }

    const eliminado = productos.pop(); // Eliminar el ultimo producto
    actualizarListaProductos(); // Actualizar la lista visual de productos

    // Mensaje de exito
    parrafo2.textContent = `Se elimino: ${eliminado}`;
    parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
});

// Manejo del evento para eliminar todos los productos de la lista
document.getElementById("dlLista").addEventListener("click", () => {
    while (productos.length > 0) {
        productos.pop(); // Eliminar todos los productos del array
        actualizarListaProductos(); // Actualizar la lista visual de productos

        // Mensaje de exito
        parrafo2.textContent = "Lista eliminada exitosamente";
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
    }
});

// Funcion para actualizar la lista visual de productos
function actualizarListaProductos() {
    contenedor2.innerHTML = ""; // Limpiar la lista visual
    productos.forEach(a => {
        contenedor2.innerHTML += `<p class="text-gray-700">${a}</p>`; // Agregar cada producto a la lista
    });
}
