// Se agrega el evento submit a los formularios para llamar a las funciones correspondientes.
document.getElementById("form1").addEventListener("submit",agNumero);
document.getElementById("form2").addEventListener("submit",agTexto);
document.getElementById("form3").addEventListener("submit",agUsuario);
// Se crean los arrays donde se guardaran los valores ingresados.
let array1 = [];
let array2 = [];
let array3 = [];
// Se obtienen los elementos del DOM donde se mostraran los mensajes.
let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");
// Funcion que maneja el primer formulario
function agNumero(e) {
    e.preventDefault();// Se evita que se recargue la pagina al enviar el formulario

    let validar = true;
    let id1 = document.getElementById("id1").value;// Se obtiene el valor del campo id1
// Se valida que el campo no este vacio sea mayor a 10 y sea numero
    if (id1 == "" || isNaN(id1) || id1<10) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = "Introduzca un numero mayor a 10 en el campo:";
        validar = false;
    }
// Si la validacion es correcta, se agrega el numero al array y se muestra el resultado
    if (validar) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array1.push(parseInt(id1));// Se agrega el numero al array

        let aux = array1.filter(n => n >= 10);//filtro numeros mayores a 10

        parrafo1.innerHTML = "Numeros ingresados: ";
        array1.forEach(re => {
            parrafo1.innerHTML += re + ", ";// Se muestran
        });

        parrafo1.innerHTML += "<br>Numeros ordenados: ";
        aux.forEach(re => {
            parrafo1.innerHTML += re + ", ";// Se muestran
        });
    }
}

function agTexto(e) {
    e.preventDefault();

    let validar = true;
    let id2 = document.getElementById("id2").value;

    if (id2 == "") {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = "Introduzca un texto en el campo:";
        validar = false;
    }

    if (validar) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array2.push(id2);

        let aux = array2.filter(p => p.length > 5);//filtro palabras con mas de 5 letras

        parrafo2.innerHTML = "Textos ingresados: ";
        array2.forEach(re => {
            parrafo2.innerHTML += re + ", ";
        });

        parrafo2.innerHTML += "<br>Textos mayores a 5 letras: ";
        aux.forEach(re => {
            parrafo2.innerHTML += re + ", ";
        });
    }
}

function agUsuario(e) {
    e.preventDefault();

    let validar = true;

    let id3 = document.getElementById("id3").value;
    let id4 = document.getElementById("id4").checked;

    if (id3 == "") {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = "Introduzca un nombre para el usuario:";
        validar = false;
    }

    if(validar){
        array3.push({ id3, id4 });
    
        let activos = array3.filter(u => u.id4);
    
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
    
        parrafo3.innerHTML = "Usuarios ingresados:<br>";
        array3.forEach(u => {
            parrafo3.innerHTML += `${u.id3} (${u.id4 ? 'activo' : 'inactivo'}), `;//filtro usuarios activos y inactivos
        });
    
        parrafo3.innerHTML += "<br>Usuarios activos:<br>";
        activos.forEach(u => {
            parrafo3.innerHTML += u.id3 ;
        });
    }
}