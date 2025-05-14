// Se agrega el evento submit a los formularios para llamar a las funciones correspondientes.
document.getElementById("form1").addEventListener("submit", ag1);
document.getElementById("form2").addEventListener("submit", ag2);
document.getElementById("form3").addEventListener("submit", ag3);

// Se crean los arrays donde se guardaran los valores ingresados.
let array1 = [];
let array2 = [];
let array3 = [];

// Se obtienen los elementos del DOM donde se mostraran los mensajes.
let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");

// Funcion que maneja el primer formulario
function ag1(e) {
    e.preventDefault(); // Se evita que se recargue la pagina al enviar el formulario

    let validar = true;
    let id1 = document.getElementById("id1").value; // Se obtiene el valor del campo id1

    // Se valida que el campo no este vacio ni contenga caracteres no numericos
    if (id1 == "" || isNaN(id1)) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = "Introduzca un numero en el campo:"; // Mensaje de error
        validar = false; 
    }

    // Si la validacion es correcta, se agrega el numero al array y se muestra el resultado
    if (validar) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array1.push(id1); // Se agrega el numero al array
        parrafo1.innerHTML = "Numeros ingresados: ";
        array1.forEach(re => {
            parrafo1.innerHTML += re + ", "; // Se muestran los numeros ingresados
        });

        array1.sort((a, b) => a - b); // Se ordenan los numeros

        parrafo1.innerHTML += "<br>Numeros ordenados: " + array1; // Se muestran los numeros ordenados
    }
}

// Funcion que maneja el segundo formulario
function ag2(e) {
    e.preventDefault(); // Se evita que se recargue la pagina al enviar el formulario

    let validar = true; // Bandera de validacion
    let id2 = document.getElementById("id2").value; // Se obtiene el valor del campo id2

    // Se valida que el campo no este vacio
    if (id2 == "") {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = "Introduzca una palabra en el campo:"; // Mensaje de error
        validar = false; // Se cambia la bandera de validacion a falsa
    }

    // Si la validacion es correcta, se agrega la palabra al array y se muestra el resultado
    if (validar) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array2.push(id2); // Se agrega la palabra al array
        
        parrafo2.innerHTML = "Palabras ingresadas: ";
        array2.forEach(re => {
            parrafo2.innerHTML += re + ", "; // Se muestran las palabras ingresadas
        });

        array2.sort(); // Se ordenan las palabras alfabeticamente

        parrafo2.innerHTML += "<br>Palabras ordenadas alfabeticamente: " + array2; // Se muestran las palabras ordenadas
    }
}

// Funcion que maneja el tercer formulario
function ag3(e) {
    e.preventDefault(); // Se evita que se recargue la pagina al enviar el formulario

    let validar = true; // Bandera de validacion
    let id3 = document.getElementById("id3").value; // Se obtiene el valor del campo id3
    let id4 = document.getElementById("id4").value; // Se obtiene el valor del campo id4

    // Se valida que el campo id3 no este vacio
    if (id3 == "") {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = "Introduzca un nombre en el campo:"; // Mensaje de error
        validar = false; // Se cambia la bandera de validacion a falsa
    }

    // Se valida que el campo id4 no este vacio ni contenga caracteres no numericos
    if (id4 == "" || isNaN(id4)) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = "Introduzca una edad en el campo:"; // Mensaje de error
        validar = false; // Se cambia la bandera de validacion a falsa
    }

    // Si la validacion es correcta, se agrega el usuario al array y se muestra el resultado
    if (validar) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        let usuario = {
            nombre: id3, // Se crea el objeto usuario
            edad: parseInt(id4), // Se agrega la edad del usuario
        };
    
        array3.push(usuario); // Se agrega el usuario al array
        parrafo3.innerHTML = "Usuarios ingresados: ";
        array3.forEach(u => {
            parrafo3.innerHTML += u.nombre + ', ' + u.edad + ', '; // Se muestran los usuarios ingresados
        });

        array3.sort((a, b) => a.edad - b.edad); // Se ordenan los usuarios por edad

        parrafo3.innerHTML += "<br>Usuarios ordenados por edad: ";
        array3.forEach(u => {
            parrafo3.innerHTML += u.nombre + ', ' + u.edad + ', '; // Se muestran los usuarios ordenados por edad
        });
    }
}
