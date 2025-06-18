document.getElementById("form1").addEventListener("submit", ag1);

let array1 = [];
let parrafo1 = document.getElementById("warning1");
let resultadoDiv = document.getElementById("resultado");

function ag1(e) {
    e.preventDefault();

    let id1 = document.getElementById("id1").value.trim();

    parrafo1.textContent = "";
    resultadoDiv.textContent = "";

    if (id1 === "") {
        parrafo1.className = "text-sm text-center text-red-400";
        parrafo1.textContent = "Introduzca un mensaje en el campo:";
        return;
    }

    parrafo1.className = "text-sm text-center text-green-400";

    let resultado = "";
    let dentroParentesis = false;
    let segmento = "";

    for (let i = 0; i < id1.length; i++) {
        let c = id1[i];
        if (c === '(') {
            dentroParentesis = true;
            segmento = "";
        } else if (c === ')') {
            dentroParentesis = false;
            let invertido = segmento.split("").reverse().join("");
            resultado += invertido;
        } else {
            if (dentroParentesis) {
                segmento += c;
            } else {
                resultado += c;
            }
        }
    }

    parrafo1.textContent = "Mensaje decodificado:";
    resultadoDiv.textContent = resultado;
    document.getElementById("id1").value = "";
}
