// Se agrega el evento submit a los formularios para llamar a las funciones correspondientes.
document.getElementById("form1").addEventListener("submit",agLetra);
document.getElementById("elLetras").addEventListener("click",elLetras);
document.getElementById("form2").addEventListener("submit",agNombre);
document.getElementById("remNombres").addEventListener("click",remNombres);
document.getElementById("form3").addEventListener("submit",agElemento);
document.getElementById("remElementos").addEventListener("click",remElementos);
// Se crean los arrays donde se guardaran los valores ingresados.
let letras = [];
let nombres = [];
let elementos = [];
// Se obtienen los elementos del DOM donde se mostraran los mensajes.

let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");
// Funcion que maneja el primer formulario
function agLetra (e){
    e.preventDefault();// Se evita que se recargue la pagina al enviar el formulario

    let validar = true;
    let letra = document.getElementById("letra").value;// Se obtiene el valor del campo id1
    let letra2 = document.getElementById("letra2").value;
// Se valida que el campo no este vacio y sea un numero
    if(letra == "" || letra2 == ""){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("Introduzca una letra en ambos campos");
        validar = false;
    }
// Si la validacion es correcta, se agrega el numero al array y se muestra el resultado
    if(validar){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        letras.push(letra);//Se agrega al array
        letras.push(letra2);

        parrafo1.innerHTML = "Letras: ";
        letras.forEach(re =>{
            parrafo1.innerHTML += re + ", ";// Se muestran
        })
    }
}

function elLetras(e){
    e.preventDefault();

    let validar = true;

    if(validar){
        letras.splice(1,2);//elimino una seccion
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        
        parrafo1.innerHTML = "Dos elementos eliminados desde pos 1: ";
        letras.forEach(re =>{
            parrafo1.innerHTML += re + ", ";
        })
    }

    if(letras.length <= 1){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("No hay letras por eliminar.");
        validar = false;
    }
}


function agNombre (e){
    e.preventDefault();

    let validar = true;
    let nombre = document.getElementById("nombre").value;
    let nombre2 = document.getElementById("nombre2").value;
    
    
    if(nombre == "" || nombre2 == ""){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Introduzca ambos campos");
        validar = false;
    }

    if(validar){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        nombres.push(nombre);
        nombres.push(nombre2);

        parrafo2.innerHTML = "Nombres: ";
        nombres.forEach(re =>{
            parrafo2.innerHTML += re + ", ";
        })
    }
}

function remNombres(e){
    e.preventDefault();
    
    let nombre3 = document.getElementById("nombre3").value;
    
    let validar = true;

    if(validar){
        nombres.splice(1,0,nombre3);//inserto una seccion del array
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        parrafo2.innerHTML = "Array modificado exitosamente: ";
        nombres.forEach(re =>{
            parrafo2.innerHTML += re + ", ";
        })
    }

    if(nombres.length <= 1){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Rellene aun que sea un campo.");
        validar = false;
    }
}

function agElemento (e){
    e.preventDefault();

    let validar = true;
    let elemento = document.getElementById("elemento").value;
    let elemento2 = document.getElementById("elemento2").value;
    
    
    if(elemento == "" || elemento2 == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca ambos campos");
        validar = false;
    }

    if(validar){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        elementos.push(elemento);
        elementos.push(elemento2);

        parrafo3.innerHTML = "Elementos: ";
        elementos.forEach(re =>{
            parrafo3.innerHTML += re + ", ";
        })
    }
}

function remElementos(e){
    e.preventDefault();
    
    let elemento3 = document.getElementById("elemento3").value;
    let elemento4 = document.getElementById("elemento4").value;
    
    let validar = true;
    
    if(elemento3 == "" || elemento4 == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Rellene aun que sea un campo.");
        validar = false;
    }
    if(validar){
        elementos.splice(1,2,elemento3,elemento4);//remplazo dos elementos del array
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        parrafo3.innerHTML = "Array modificado exitosamente: ";
        elementos.forEach(re =>{
            parrafo3.innerHTML += re + ", ";
        })
    }
}


