// Script de diagnóstico para verificar componentes
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🔍 Iniciando diagnóstico de API...\n');

  try {
    // Test 1: Procesadores
    console.log('1️⃣  Cargando procesadores...');
    const processorsRes = await fetch(`${API_URL}/components/processors`);
    const processorsData = await processorsRes.json();
    console.log(`   ✅ Respuesta: ${processorsData.success ? 'OK' : 'ERROR'}`);
    console.log(`   📊 Cantidad: ${processorsData.count || 0} procesadores`);
    if (processorsData.data && processorsData.data.length > 0) {
      console.log(`   ℹ️  Primer procesador:`, {
        id: processorsData.data[0].id,
        marca: processorsData.data[0].marca,
        modelo: processorsData.data[0].modelo,
        socket: processorsData.data[0].socket
      });
    }

    // Test 2: Motherboards
    console.log('\n2️⃣  Cargando motherboards...');
    const mbRes = await fetch(`${API_URL}/components/motherboards`);
    const mbData = await mbRes.json();
    console.log(`   ✅ Respuesta: ${mbData.success ? 'OK' : 'ERROR'}`);
    console.log(`   📊 Cantidad: ${mbData.count || 0} motherboards`);

    // Test 3: RAM
    console.log('\n3️⃣  Cargando RAM...');
    const ramRes = await fetch(`${API_URL}/components/ram`);
    const ramData = await ramRes.json();
    console.log(`   ✅ Respuesta: ${ramData.success ? 'OK' : 'ERROR'}`);
    console.log(`   📊 Cantidad: ${ramData.count || 0} módulos RAM`);

    // Test 4: GPUs
    console.log('\n4️⃣  Cargando GPUs...');
    const gpuRes = await fetch(`${API_URL}/components/tarjetas_graficas`);
    const gpuData = await gpuRes.json();
    console.log(`   ✅ Respuesta: ${gpuData.success ? 'OK' : 'ERROR'}`);
    console.log(`   📊 Cantidad: ${gpuData.count || 0} GPUs`);

    // Test 5: Almacenamiento
    console.log('\n5️⃣  Cargando almacenamiento...');
    const storageRes = await fetch(`${API_URL}/components/almacenamiento`);
    const storageData = await storageRes.json();
    console.log(`   ✅ Respuesta: ${storageData.success ? 'OK' : 'ERROR'}`);
    console.log(`   📊 Cantidad: ${storageData.count || 0} discos`);

    // Test 6: Fuentes
    console.log('\n6️⃣  Cargando fuentes de poder...');
    const psuRes = await fetch(`${API_URL}/components/fuentes_poder`);
    const psuData = await psuRes.json();
    console.log(`   ✅ Respuesta: ${psuData.success ? 'OK' : 'ERROR'}`);
    console.log(`   📊 Cantidad: ${psuData.count || 0} fuentes`);

    // Test 7: Gabinetes
    console.log('\n7️⃣  Cargando gabinetes...');
    const caseRes = await fetch(`${API_URL}/components/gabinetes`);
    const caseData = await caseRes.json();
    console.log(`   ✅ Respuesta: ${caseData.success ? 'OK' : 'ERROR'}`);
    console.log(`   📊 Cantidad: ${caseData.count || 0} gabinetes`);

    console.log('\n✅ Diagnóstico completado');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
