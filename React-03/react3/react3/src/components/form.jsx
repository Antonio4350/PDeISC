//Se pasa por parametro una funcion con lo que se debe realizar al subir los datos
//y valores de para que se usa el formulario
function Formulario({ subirDatos, datos })
{      
    //Valores por defecto para los campos del formulario
    let defaultValues = {
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        fecha_nacimiento: '',
        email: ''
    }
    //En caso que se quiera editar un usuario se rellenan los valores por defecto
    //Con los que se pasen por parametro
    if(datos.modo === "editar")
    {
        defaultValues = {
            nombre: datos.usuario.nombre,
            apellido: datos.usuario.apellido,
            direccion: datos.usuario.direccion,
            telefono: datos.usuario.telefono,
            fecha_nacimiento: datos.usuario.fecha_nacimiento.split("T")[0],
            email: datos.usuario.email
        }
    }
    //Valida uno por uno todos los campos necesarios.
    function validar(e)
    {
        e.preventDefault();
        document.getElementById('error').innerHTML = '';
        let error = document.getElementById('error');
        let valido = true;
        let nombre = document.getElementById('nombre').value;
        document.getElementById('nombre').classList.remove('error');
        let apellido = document.getElementById('apellido').value;
        document.getElementById('apellido').classList.remove('error');
        let direccion = document.getElementById('direccion').value;
        document.getElementById('direccion').classList.remove('error');
        let telefono = document.getElementById('telefono').value;
        document.getElementById('telefono').classList.remove('error');
        let fecha_nacimiento = document.getElementById('fecha').value;
        let email = document.getElementById('email').value;
        document.getElementById('email').classList.remove('error');
        //Si algun campo no esta segun los estandares se cancela la operacion y se informa que sucedio
        if(!verificarText(nombre))
        {
          valido = false;
          error.innerHTML = 'Ingresar un nombre valido';
          document.getElementById('nombre').classList.add('error');
        }
        if(!verificarText(apellido))
        {
          valido = false;
          error.innerHTML = 'Ingresar un apellido valido';
          document.getElementById('apellido').classList.add('error');
        }
        if(!verificarTextconNumeros(direccion))
        {
          valido = false;
          error.innerHTML = 'Ingresar una direccion valida';
          document.getElementById('direccion').classList.add('error');
        }
        if(!verificarTelef(telefono))
        {
          valido = false;
          error.innerHTML = 'Ingresar un telefono valido';
          document.getElementById('telefono').classList.add('error');
        }
        if(!verificarEmail(email))
        {
          valido = false;
          error.innerHTML = 'Ingresar un email valido';
          document.getElementById('email').classList.add('error');
        }
        if(valido)
        {
          //Si estan todos los campos bien, se crea un objeto con los valores
          let usuario = {
            nombre: nombre,
            apellido: apellido,
            direccion: direccion,
            telefono: telefono,
            fecha_nacimiento: fecha_nacimiento,
            email: email
          }
          subirDatos(usuario);//Y se envia a la funcion que fue pasada por parametro
        }
    }

    //Se utiliza un regex para verificar que el telefono cumpla con los requisitos
    function verificarEmail(email)//True si es valido
    {
      let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      return emailRegex.test(email);
    }

    function verificarTelef(tel)//True si es valido
    {
      let telRegex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
      return telRegex.test(tel);
    }

    function verificarText(text)//True si es valido
    {
      let textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
      return textRegex.test(text);
    }

    function verificarTextconNumeros(texto)//True si es valido
    {
      let regex = /^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
      return regex.test(texto);
    }
    //Vuelve a la pestaña de inicio
    function volver()
    {
      window.location.href = "/";
    }

    return (
        <div className="container mx-auto p-6 max-w-lg">
          <form onSubmit={validar} className="bg-white shadow-md rounded-2xl p-8 space-y-6 border border-gray-200">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nombre</label>
              <input type="text" id="nombre" required defaultValue={defaultValues.nombre} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Apellido</label>
              <input type="text" id="apellido" required defaultValue={defaultValues.apellido} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Dirección</label>
              <input type="text" id="direccion" required defaultValue={defaultValues.direccion} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Teléfono</label>
              <input type="tel" id="telefono" required defaultValue={defaultValues.telefono} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Fecha de Nacimiento</label>
              <input type="date" id="fecha" required defaultValue={defaultValues.fecha_nacimiento} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input type="email" id="email" required defaultValue={defaultValues.email} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div className="flex justify-between items-center pt-4">
              <button type="button" onClick={volver} className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors">Volver sin Guardar</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">Guardar</button>
            </div>
            <div id="error" className="text-red-600 mt-4"></div>
          </form>
        </div>
      );
      
}

export default Formulario