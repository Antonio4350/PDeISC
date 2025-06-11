const form = document.getElementById('numForm');
const input = document.getElementById('numInput');
const addBtn = document.getElementById('addBtn');
const saveBtn = document.getElementById('saveBtn');
const warning = document.getElementById('warning');
const numList = document.getElementById('numList');
const count = document.getElementById('count');
const savedMessage = document.getElementById('savedMessage');

let numbers = [];

function actualizarUI() {
  numList.textContent = numbers.join(', ');
  count.textContent = `Números ingresados (${numbers.length}/20)`;

  if (numbers.length >= 10) {
    addBtn.classList.replace('bg-green-400', 'bg-green-600');
    saveBtn.disabled = false;
    saveBtn.classList.replace('bg-gray-400', 'bg-green-400');
  } else {
    addBtn.classList.replace('bg-green-600', 'bg-green-400');
    saveBtn.disabled = true;
    saveBtn.classList.replace('bg-green-400', 'bg-gray-400');
  }
}

addBtn.addEventListener('click', () => {
  const val = input.value.trim();
  warning.textContent = '';
  savedMessage.textContent = '';

  if (val === '' || isNaN(val)) {
    warning.textContent = 'Ingrese un número válido.';
    return;
  }
  if (numbers.length >= 20) {
    warning.textContent = 'Ya se ingresaron los 20 números permitidos.';
    return;
  }
  numbers.push(Number(val));
  input.value = '';
  actualizarUI();
});

saveBtn.addEventListener('click', async () => {
  warning.textContent = '';
  savedMessage.textContent = '';

  if (numbers.length < 10) {
    warning.textContent = 'Debe ingresar al menos 10 números para guardar.';
    return;
  }

  const fileName = 'numeros.txt';
  const data = numbers.join('\n');

  try {
    const res = await fetch('/guardarArchivo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, data }),
    });
    const json = await res.json();

    if (res.ok) {
      savedMessage.textContent = json.message;
      numbers = []; // Limpiar el array después de guardar
      actualizarUI();
    } else {
      warning.textContent = json.error || 'Error al guardar archivo.';
    }
  } catch (error) {
    warning.textContent = 'Error en la conexión: ' + error.message;
  }
});

actualizarUI();
