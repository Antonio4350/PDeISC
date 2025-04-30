document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
  //creo la funcionalidad gracias a usar la id del formulario y el submit del boton
    const $text = document.getElementById("text");//creo todas las constantes y sus ids
    const $select = document.getElementById("select");
    const $check = document.getElementById("check");
    const $num = document.getElementById("num");
    const $email = document.getElementById("email");
    const radio = document.querySelector('input[name="opcion"]:checked');
  
    document.getElementById("respuesta").innerHTML =
      "Texto: " + $text.value + "<br>" +
      "Radio: " + (radio ? radio.value : "Ninguno") + "<br>" +//muestro todos los resultados del formulario y lo mando a respuesta
      "Opción seleccionada: " + $select.value + "<br>" +
      "Checkbox: " + ($check.checked ? "Sí" : "No") + "<br>" +
      "Número: " + $num.value + "<br>" +
      "Email: " + $email.value;
  });
  