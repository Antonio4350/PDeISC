document.getElementById("form1").addEventListener("submit",agTexto);
document.getElementById("event").addEventListener("click",busTexto);
document.getElementById("form2").addEventListener("submit",agNumero);
document.getElementById("event2").addEventListener("click",busNumero);
document.getElementById("form3").addEventListener("submit",agCiudad);
document.getElementById("event3").addEventListener("click",busCiudad);

let array1 = [];
let array2 = [];
let array3 = [];

let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");

function agTexto(e){
    e.preventDefault();

    let validar = true;
    let id1 = document.getElementById("id1").value;

    if(id1 == ""){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("Introduzca un texto en el campo:");
        id1 = "";
        validar = false;
    }

    if(validar){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        array1.push(id1.toLowerCase());
        parrafo1.innerHTML = "Texto ingresado: ";
        array1.forEach(re =>{
            parrafo1.innerHTML += re + ", ";
        })
    }
}

function busTexto(e){
    e.preventDefault();
    
    let cop =  array1.indexOf("perro");
    
    if(cop == -1){
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = "La palabra no se encontro";
    }else{
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        parrafo1.innerHTML = "Palabra encontrada en: " + cop;
    }
}

function agNumero(e){
    e.preventDefault();

    let validar = true;
    let id2 = document.getElementById("id2").value;

    if(id2 == "" || isNaN(id2)){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Introduzca algunos numeros en el campo:");
        id2 = "";
        validar = false;
    }

    if(validar){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        array2.push(id2);
        
        parrafo2.innerHTML = "Numero ingresado: ";
        array2.forEach(re =>{
            parrafo2.innerHTML += re + ", ";
        })
    }
}

function busNumero(e){
    e.preventDefault();
    
    let cop =  array2.indexOf("50");
    
    if(cop == -1){
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = "El numero no se encontro";
    }else{
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        parrafo2.innerHTML = "Numero encontrada en: " + cop;
    }
}

function agCiudad(e){
    e.preventDefault();

    let validar = true;
    let id3 = document.getElementById("id3").value;

    if(id3 == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca un algunas ciudades en el campo:");
        id3 = "";
        validar = false;
    }

    if(validar){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        array3.push(id3.toLowerCase());
        parrafo3.innerHTML = "Ciudad ingresada: ";
        array3.forEach(re =>{
            parrafo3.innerHTML += re + ", ";
        })
    }
}

function busCiudad(e){
    e.preventDefault();
    
    let cop =  array3.indexOf("madrid");
    
    if(cop == -1){
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = "La ciudad no se encontro";
    }else{
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        parrafo3.innerHTML = "Ciudad encontrada en: " + cop;
    }
}