document.body.addEventListener('keydown', (event) => {
    document.getElementById("tecla").textContent = "Tecla presionada: " + event.key;
});