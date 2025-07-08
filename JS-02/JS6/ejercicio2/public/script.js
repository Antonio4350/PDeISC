document.getElementById("btnFetch").addEventListener("click", () => {
  enviarDatos("/api/fetch");//para usar este caso apreto el boton y llamo a la funcion con el parametro correspondiente
  //que seria la url del server
});
document.getElementById("btnAxios").addEventListener("click", () => {
  enviarDatos("/api/axios");//para usar este caso apreto el boton y llamo a la funcion con el parametro correspondiente
  //que seria la url del server
});

function enviarDatos(url) {
  const nombre = document.getElementById("nombre").value.trim();//tomo valores
  const email = document.getElementById("email").value.trim();//tomo valores

  if (!nombre || !email) {//valido
    mostrar("Completa ambos campos");
    return;
  }

  fetch(url, {//hago el fetch
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nombre, email: email }),
  })
    .then(res => res.json())
    .then(data => {//muestro data recibida o el error
      if (data.id) {
        mostrar(`ID recibido (${data.fuente}): ${data.id}`);
      } else {
        mostrar("error en la respuesta");
      }
    })
    .catch(() => mostrar("error al enviar datos"));
}

function mostrar(mensaje) {//creo la funcion para mostrar el o los mensajes
  document.getElementById("res").textContent = mensaje;
}