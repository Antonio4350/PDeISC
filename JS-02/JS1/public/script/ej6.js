document.getElementById("form1").addEventListener("submit",agNumero);
document.getElementById("copNumeros").addEventListener("click",copNumeros);
document.getElementById("form2").addEventListener("submit",peli);
document.getElementById("copPeliculas").addEventListener("click",copPeliculas);
document.getElementById("form3").addEventListener("submit",agarray);
document.getElementById("copArray").addEventListener("click",copArray);

let numeros = [];
let peliculas= [];
let array = [];

let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");


function agNumero(e){
    e.preventDefault();

    let validar = true;
    let numero = document.getElementById("numero").value;
    let numero2 = document.getElementById("numero2").value;
    let numero3 = document.getElementById("numero3").value;

    if(numero == "" || isNaN(numero)||numero2 == "" || isNaN(numero2)||numero3 == "" || isNaN(numero3)){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("Introduzca un Numero en todos los campos:");
        numero = "";
        numero2 = "";
        numero3 = "";
        validar = false;
    }

    if(validar){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        numeros.push(numero,numero2,numero3);
        
        parrafo1.innerHTML = "Numeros: ";
        numeros.forEach(re =>{
            parrafo1.innerHTML += re + ", ";
        })
    }
}

function copNumeros(e){
    e.preventDefault();

    let cop =  numeros.slice(0,3);

    parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        
    parrafo1.innerHTML = "Tres elementos copiados desde el inicio: ";
    cop.forEach(re =>{
        parrafo1.innerHTML += re + ", ";
    })
}

function peli(e){
    e.preventDefault();
    
    let validar = true;
    let pelicula = document.getElementById("pelicula").value;
    let pelicula2 = document.getElementById("pelicula2").value;
    let pelicula3 = document.getElementById("pelicula3").value;

    if(pelicula == "" ||pelicula2 == ""||pelicula3 == ""){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Introduzca una pelicula en todos los campos:");
        pelicula = "";
        pelicula2 = "";
        pelicula3 = "";
        validar = false;
    }

    if(validar){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        peliculas.push(pelicula,pelicula2,pelicula3);
        
        parrafo2.innerHTML = "Peliculas: ";
        peliculas.forEach(re =>{
            parrafo2.innerHTML += re + ", ";
        })

    }
}

function copPeliculas(e){
    e.preventDefault();

    let cop =  peliculas.slice(2,5);

    parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        
    parrafo2.innerHTML = "Elementos copiados del 2, 4: ";
    cop.forEach(re =>{
        parrafo2.innerHTML += re + ", ";
    })
}

function agarray(e){
    e.preventDefault();

    let validar = true;
    let elArray = document.getElementById("array").value;
    let elArray2 = document.getElementById("array2").value;
    let elArray3 = document.getElementById("array3").value;

    if(elArray == ""||elArray2 == ""||elArray3 == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca un texto en el campo:");
        elArray = "";
        elArray2 = "";
        elArray3 = "";
        validar = false;
    }

    if(validar){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        array.push(elArray, elArray2, elArray3);
        
        parrafo3.innerHTML = "Array: ";
        array.forEach(re =>{
            parrafo3.innerHTML += re + ", ";
        })
    }
}

function copArray(e){
    e.preventDefault();

    let cop = array.slice(-3);

    parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        
    parrafo3.innerHTML = "Ultimos 3 elementos copiados: ";
    cop.forEach(re =>{
        parrafo3.innerHTML += re + ", ";
    })
}