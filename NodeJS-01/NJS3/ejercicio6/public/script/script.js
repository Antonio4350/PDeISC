document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const $text = document.getElementById("text");
    const $select = document.getElementById("select");
    const $check = document.getElementById("check");
    const $num = document.getElementById("num");
    const $email = document.getElementById("email");
    const radio = document.querySelector('input[name="opcion"]:checked');
  
    document.getElementById("respuesta").innerHTML =
      "Texto: " + $text.value + "<br>" +
      "Radio: " + (radio ? radio.value : "Ninguno") + "<br>" +
      "Opción seleccionada: " + $select.value + "<br>" +
      "Checkbox: " + ($check.checked ? "Sí" : "No") + "<br>" +
      "Número: " + $num.value + "<br>" +
      "Email: " + $email.value;
  });
  