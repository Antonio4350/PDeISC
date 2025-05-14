// Asignacion de evento al formulario con id "form1"
document.getElementById("form1").addEventListener("submit", ag1);

// Inicializacion de un array vacio para almacenar los datos
let array1 = [];

// Inicializacion del elemento de parrafo para mostrar mensajes
let parrafo1 = document.getElementById("warning1");

// Funcion que se ejecuta al enviar el formulario
function ag1(e) {
    e.preventDefault(); // Evitar la recarga de la pagina al enviar el formulario

    let validar = true; // Variable para controlar si la validacion es exitosa
    let id1 = document.getElementById("id1").value; // Obtener el valor ingresado en el input con id "id1"

    // Verificar si el campo esta vacio
    if (id1.trim() === "") {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = "Introduzca un mensaje en el campo:"; // Mostrar mensaje de error
        validar = false; // Marcar la validacion como falsa
    }

    // Si la validacion es exitosa, proceder a decodificar el mensaje
    if (validar) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";

        let resultado = ""; // Variable para almacenar el resultado decodificado
        let dentroParentesis = false; // Variable para verificar si estamos dentro de parentesis
        let segmento = ""; // Variable para almacenar el segmento dentro de parentesis

        // Recorrer el mensaje caracter por caracter
        for (let i = 0; i < id1.length; i++) {
            let c = id1[i]; // Obtener el caracter actual

            // Verificar si el caracter es un parentesis de apertura
            if (c === '(') {
                dentroParentesis = true; // Establecer que estamos dentro de parentesis
                segmento = ""; // Inicializar el segmento vacio
            } 
            // Verificar si el caracter es un parentesis de cierre
            else if (c === ')') {
                dentroParentesis = false; // Establecer que hemos salido de los parentesis
                let invertido = segmento.split("").reverse().join(""); // Invertir el segmento dentro de parentesis
                resultado += invertido; // Agregar el segmento invertido al resultado
            } 
            else {
                // Si no estamos dentro de parentesis, agregar el caracter directamente al resultado
                if (dentroParentesis) {
                    segmento += c; // Si estamos dentro de parentesis, agregar el caracter al segmento
                } else {
                    resultado += c; // Si no estamos dentro de parentesis, agregar el caracter al resultado
                }
            }
        }
        // Mostrar el mensaje decodificado en el parrafo
        parrafo1.innerHTML = "Mensaje decodificado:<br>" + resultado;
    }
}
