document.getElementById("form1").addEventListener("submit",ag1);
document.getElementById("form2").addEventListener("submit",ag2);
document.getElementById("form3").addEventListener("submit",ag3);

let array1 = [];
let array2 = [];
let array3 = [];

let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");

function ag1(e){
    e.preventDefault();

    let validar = true;
    let id1 = document.getElementById("id1");
}

function ag2(e){
    e.preventDefault();

    let validar = true;
    let id2 = document.getElementById("id2");
}

function ag3(e){
    e.preventDefault();

    let validar = true;
    let id3 = document.getElementById("id3");
}