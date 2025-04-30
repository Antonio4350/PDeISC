document.body.addEventListener('keydown', (event) => {
    document.getElementById("tecla").textContent = "Tecla presionada: " + event.key;
});//con el evento leo la tecla que presione y la muestro en la pag