import http from 'http';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// Import server to ensure it's running in this process (server.js calls startServer())
try {
  // dynamic import for ESM
  await import('./server.js');
  // give server a moment to bind
  await new Promise((r) => setTimeout(r, 1200));
} catch (e) {
  // If import fails, continue and we'll get connection errors from requests
  console.log('Warning: could not import server.js:', e.message || e);
}

const endpoints = [
  '/health',
  '/components/tarjetas_graficas',
  '/components/almacenamiento',
  '/components/fuentes_poder',
  '/components/gabinetes'
];

function get(path) {
  const options = {
    hostname: HOST,
    port: PORT,
    path,
    method: 'GET',
    timeout: 5000
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        resolve({ path, statusCode: res.statusCode, body: parsed });
      });
    });

    req.on('error', (err) => resolve({ path, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ path, error: 'timeout' }); });
    req.end();
  });
}

(async () => {
  console.log(`Checking endpoints on http://${HOST}:${PORT}`);
  for (const ep of endpoints) {
    const result = await get(ep);
    console.log('\n==== ' + ep + ' ====>');
    if (result.error) {
      console.log('ERROR:', result.error);
    } else {
      console.log('Status:', result.statusCode);
      if (typeof result.body === 'object') {
        try {
          console.log('Body (JSON):', JSON.stringify(result.body, null, 2));
        } catch (e) {
          console.log('Body (object):', result.body);
        }
      } else {
        console.log('Body:', result.body);
      }
    }
  }
})();
