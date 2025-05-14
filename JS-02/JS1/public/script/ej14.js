// Asignar evento de envio a los formularios
document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

// Inicializacion de arrays vacios para almacenar los datos
let array1 = [];
let array2 = [];
let array3 = [];

// Inicializacion de los elementos de parrafo para mostrar mensajes
let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");

// Funcion para agregar letras al array1
function ag1(e){
    e.preventDefault(); // Evitar la recarga de la pagina

    let validar = true; // Variable para controlar si la validacion es exitosa
    let id1 = document.getElementById("id1").value; // Obtener el valor del input "id1"

    // Verificar si el valor ingresado tiene una longitud diferente a 1
    if (id1.length !== 1) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = "Introduzca una letra sola en el campo:"; // Mostrar mensaje de error
        validar = false; // Marcar la validacion como falsa
    }

    // Si la validacion es exitosa, agregar la letra al array1
    if (validar) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";

        array1.push(id1);

        parrafo1.innerHTML = "Letras ingresadas: ";
        array1.forEach(re => {
            parrafo1.innerHTML += re + ", "; // Mostrar las letras ingresadas
        });

        // Crear una copia del array y revertirla
        let aux = [...array1];
        aux.reverse();

        parrafo1.innerHTML += "<br>Letras invertidas: ";
        aux.forEach(re => {
            parrafo1.innerHTML += re + ", "; // Mostrar las letras invertidas
        });
    }
}

// Funcion para agregar numeros al array2
function ag2(e){
    e.preventDefault(); // Evitar la recarga de la pagina

    let validar = true; // Variable para controlar si la validacion es exitosa
    let id2 = document.getElementById("id2").value; // Obtener el valor del input "id2"

    // Verificar si el valor ingresado no es un numero
    if (id2 == "" || isNaN(id2)) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = "Introduzca un numero en el campo:"; // Mostrar mensaje de error
        validar = false; // Marcar la validacion como falsa
    }

    // Si la validacion es exitosa, agregar el numero al array2
    if (validar) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array2.push(parseInt(id2)); // Convertir el valor a numero e ingresarlo en el array2

        parrafo2.innerHTML = "Numeros ingresados: ";
        array2.forEach(re => {
            parrafo2.innerHTML += re + ", "; // Mostrar los numeros ingresados
        });

        // Crear una copia del array y revertirla
        let aux = [...array2];
        aux.reverse();

        parrafo2.innerHTML += "<br>Numeros invertidos: ";
        aux.forEach(re => {
            parrafo2.innerHTML += re + ", "; // Mostrar los numeros invertidos
        });
    }
}

// Funcion para agregar texto al array3
function ag3(e) {
    e.preventDefault(); // Evitar la recarga de la pagina

    let validar = true; // Variable para controlar si la validacion es exitosa
    let id3 = document.getElementById("id3").value; // Obtener el valor del input "id3"

    // Verificar si el campo esta vacio
    if (id3 == "") {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = "Introduzca un texto en el campo:"; // Mostrar mensaje de error
        validar = false; // Marcar la validacion como falsa
    }

    // Si la validacion es exitosa, procesar el texto
    if (validar) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";

        let array3 = id3.split(""); // Convertir el texto a un array de caracteres

        parrafo3.innerHTML = "Texto ingresado: ";
        parrafo3.innerHTML += id3; // Mostrar el texto ingresado

        array3.reverse(); // Invertir el array de caracteres

        parrafo3.innerHTML += "<br>Texto invertido: ";
        parrafo3.innerHTML += array3.join(""); // Mostrar el texto invertido
    }
}
