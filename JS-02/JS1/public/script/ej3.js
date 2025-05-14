// Asignacion de eventos a los formularios para capturar el envio
document.getElementById("form1").addEventListener("submit", color);
document.getElementById("form2").addEventListener("submit", tarea);
document.getElementById("form3").addEventListener("submit", usuario);

// Inicializacion de arrays para almacenar colores, tareas y usuarios
let colores = [];
let tareas = [];
let usuarios = [];

// Inicializacion de los elementos HTML donde se mostraran los mensajes de advertencia
let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");

// Funcion para manejar el formulario de colores
function color(e) {
    e.preventDefault(); // Evitar la recarga de la pagina

    // Obtener los valores de los colores ingresados
    let color1 = document.getElementById("color1").value;
    let color2 = document.getElementById("color2").value;
    let color3 = document.getElementById("color3").value;

    let validar = true; // Variable para controlar si la validacion fue exitosa

    // Verificar que los tres campos de colores esten llenos
    if (color1 == "" || color2 == "" || color3 == "") {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("Introduzca todo los colores:");
        validar = false; // Marcar como no valido
    }

    // Si la validacion es exitosa, agregar los colores al array y mostrar la lista
    if (validar) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        colores.unshift(color1); // Agregar color al principio del array
        colores.unshift(color2);
        colores.unshift(color3);

        parrafo1.innerHTML = "Colores: ";
        colores.forEach(re => {
            parrafo1.innerHTML += re + " "; // Mostrar todos los colores
        });
    }
}

// Funcion para manejar el formulario de tareas
function tarea(e) {
    e.preventDefault(); // Evitar la recarga de la pagina

    // Obtener los valores de las tareas ingresadas
    let tarea = document.getElementById("tareaComun").value;
    let tareaUrgente = document.getElementById("tareaUrgente").value;
    let validar = true;

    // Verificar que ambos campos de tareas esten llenos
    if (tarea == "" || tareaUrgente == "") {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Introduzca ambas Tareas:");
        validar = false; // Marcar como no valido
    }

    // Si la validacion es exitosa, agregar las tareas al array y mostrar la lista
    if (validar) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        tareas.push(tarea); // Agregar tarea al final del array
        tareas.unshift(tareaUrgente); // Agregar tarea urgente al principio

        parrafo2.innerHTML = "Tareas: ";
        tareas.forEach(re => {
            parrafo2.innerHTML += re + ", "; // Mostrar todas las tareas
        });
    }
}

// Funcion para manejar el formulario de usuarios
function usuario(e) {
    e.preventDefault(); // Evitar la recarga de la pagina

    // Obtener el valor del usuario ingresado
    let usuari = document.getElementById("usuario").value;
    let validar = true;

    // Verificar que el campo de usuario no este vacio
    if (usuari == "") {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca un Usuario:");
        validar = false; // Marcar como no valido
    }

    // Si la validacion es exitosa, agregar el usuario al array y mostrar la lista
    if (validar) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        usuarios.unshift(usuari); // Agregar usuario al principio del array

        parrafo3.innerHTML = "Usuarios: ";
        usuarios.forEach(re => {
            parrafo3.innerHTML += re + ", "; // Mostrar todos los usuarios
        });
    }
}
