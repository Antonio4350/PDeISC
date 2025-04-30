document.addEventListener("mousedown",contar);

function contar(event)
{
    const elemento = event.target;
    document.body.innerHTML+="<p>Cantidad de hijos: </p>"+elemento.childElementCount;
}