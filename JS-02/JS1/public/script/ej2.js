const animales = [];
const parrafo1 = document.getElementById("warningAnimales");
const contenedor1 = document.getElementById("listaAnimales");

const productos = [];
const parrafo2 = document.getElementById("warningSupermercado");
const contenedor2 = document.getElementById("listaProductos");


// Agregar animal
document.getElementById("formulario1").addEventListener("submit", e => {
    e.preventDefault();
    parrafo1.innerHTML = "";
  
    const nuevoAnimal = document.getElementById("inAnimal").value.trim();
    if (nuevoAnimal === "") {
        parrafo1.textContent = "Ingrese un animal";
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        return;
    }

    animales.push(nuevoAnimal);
    actualizarListaAnimales();

    parrafo1.textContent = "Animal ingresado exitosamente";
    parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
    document.getElementById("inAnimal").value = ""; // limpiar input
});

// Eliminar último animal
document.getElementById("dlAnimal").addEventListener("click", () => {
  if (animales.length === 0) {
    parrafo1.textContent = "No hay animales para eliminar";
    parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
    return;
  }

    animales.pop();
    actualizarListaAnimales();

    parrafo1.textContent = "Ultimo animal eliminado";
    parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
});

// Actualizar la lista visual de animales
function actualizarListaAnimales() {
    contenedor1.innerHTML = "";
    animales.forEach(a => {
    contenedor1.innerHTML += `<p class="text-gray-700">${a}</p>`;
  });
}

//agregar producto
document.getElementById("formulario2").addEventListener("submit", e =>{
    e.preventDefault();
    parrafo1.innerHTML = "";
  
    const nuevoProducto = document.getElementById("inProducto").value.trim();
    if (nuevoProducto === "") {
        parrafo2.textContent = "Ingrese un producto";
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        return;
    }

    productos.push(nuevoProducto);
    actualizarListaProductos();

    parrafo2.textContent = "Producto ingresado exitosamente";
    parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
    document.getElementById("inProducto").value = ""; // limpiar input
});

//eliminar ultimo producto
document.getElementById("dlProducto").addEventListener("click", () => {
    if (productos.length === 0) {
      parrafo2.textContent = "No hay productos para eliminar";
      parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
      return;
    }
    
    const eliminado = productos.pop();
    actualizarListaProductos();
  
    parrafo2.textContent = `Se eliminó: ${eliminado}`;
    parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
  });
  
//Eliminar Array
document.getElementById("dlLista").addEventListener("click", () => {
    while(productos.length > 0){
        productos.pop();

        actualizarListaProductos();

        parrafo2.textContent = "Lista eliminada exitosamente";
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
    } 
})


// Actualizar la lista visual de productos
function actualizarListaProductos() {
    contenedor2.innerHTML = "";
    productos.forEach(a => {
    contenedor2.innerHTML += `<p class="text-gray-700">${a}</p>`;
    });
}
