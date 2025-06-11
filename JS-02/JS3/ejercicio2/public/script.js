const inputFile = document.getElementById('inputFile');
const btnUpload = document.getElementById('btnUpload');
const resultDiv = document.getElementById('result');

inputFile.addEventListener('change', () => {
  btnUpload.disabled = !inputFile.files.length;
  resultDiv.textContent = '';
});

btnUpload.addEventListener('click', () => {
  const file = inputFile.files[0];
  if (!file) {
    alert('Selecciona un archivo TXT.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const content = reader.result;

    fetch('/sendFile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: content }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          resultDiv.textContent = 'Error: ' + data.error;
          return;
        }

        const validSorted = data.válidos.sort((a, b) => a - b);

        resultDiv.innerHTML = `
          <p><strong>Números válidos (orden ascendente):</strong> ${validSorted.join(', ')}</p>
          <p><strong>Cantidad válidos:</strong> ${data.válidosCount}</p>
          <p><strong>Cantidad inválidos:</strong> ${data.inválidosCount}</p>
          <p><strong>Porcentaje válidos:</strong> ${data.porcentajeVálidos}%</p>
          <p class="mt-3 text-green-600 font-semibold">${data.message}</p>
        `;
      })
      .catch(err => {
        resultDiv.textContent = 'Error en la conexión: ' + err.message;
      });
  };

  reader.readAsText(file);
});
