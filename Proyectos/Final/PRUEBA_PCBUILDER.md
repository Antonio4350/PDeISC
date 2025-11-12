# 🧪 GUÍA DE PRUEBA: PC Builder Sin Filtros

Sigue estos pasos para verificar que PC Builder funciona correctamente cargando TODOS los componentes.

---

## ✅ Paso 1: Inicia el Servidor Backend

```bash
cd c:\Users\valle\Documents\GitHub\PDeISC\Proyectos\Final\Server
npm start
```

**Esperado**: Verás mensajes como:
```
✅ Servidor Express escuchando en puerto 5000
✅ Base de datos conectada
```

---

## ✅ Paso 2: Inicia el Frontend Expo

En otra terminal:

```bash
cd c:\Users\valle\Documents\GitHub\PDeISC\Proyectos\Final\ProyectoFinalACV
npx expo start
```

**Esperado**: 
```
Web browser ready at http://localhost:8081
Press 'a' to open in Android
Press 'i' to open in iOS emulator
Press 'w' to open in web
Press 'j' to open in debugger
```

Presiona `w` para abrir en navegador web.

---

## ✅ Paso 3: Abre PC Builder

1. En el navegador, ve a: http://localhost:8081
2. Haz login (crea cuenta si es necesario)
3. Ve a la pestaña **"Constructor de PC"** o similar
4. Observa que está cargando ("Cargando componentes...")

---

## ✅ Paso 4: Verifica que Carguen Componentes

### 4.1 Abre la Consola del Navegador
- Presiona **F12** en el navegador
- Ve a la pestaña **"Console"**

### 4.2 Deberías ver logs como:
```
📡 API Config: {url: 'http://localhost:5000', environment: 'local', isDevelopment: true}
Cargando componentes de: processors
Cargando componentes de: motherboards
Cargando componentes de: ram
Cargando componentes de: tarjetas_graficas
Cargando componentes de: almacenamiento
Cargando componentes de: fuentes_poder
Cargando componentes de: gabinetes

Resultado para processors: {success: true, data: [...], count: 16}
✅ Procesadores: 16 componentes cargados
First component of cpu: {id: 14, marca: 'AMD', modelo: 'Ryzen 3 7300X', socket: 'AM5', ...}

Resultado para motherboards: {success: true, data: [...], count: 13}
✅ Motherboards: 13 componentes cargados

[... más logs para RAM, GPU, Storage, PSU, Gabinete ...]
```

### 4.3 Si Ves Errores
```
❌ Error: ECONNREFUSED
```
→ **Solución**: El servidor no está corriendo. Reinicia el servidor en paso 1.

```
❌ No hay componentes disponibles
```
→ **Solución**: Revisa que la BD tiene datos. Ve a: Documentacion/09_PREGUNTAS_FRECUENTES.md

---

## ✅ Paso 5: Prueba Seleccionar Componentes

### 5.1 Haz clic en "Procesadores"
- Deberías ver una lista (sin restricciones)
- Ejemplos: AMD Ryzen 3 7300X, Intel Core i7, etc.

### 5.2 Haz clic en "+Agregar al Build"
- El procesador se agrega a la izquierda
- Verás un ✅ verde (compatible por ahora)

### 5.3 Haz clic en "Motherboards"
- Deberías ver lista COMPLETA (no filtrada)
- Ej: Pueden haber MB socket AM5, LGA1700, etc.

### 5.4 Intenta agregar un MB con socket DIFERENTE
- Ej: Si agregaste AMD (AM5), agrega ASUS LGA1700
- **IMPORTANTE**: No debe estar bloqueado
- Deberías poder agregarla sin restricción

### 5.5 Verifica el Error de Compatibilidad
- Mira el panel izquierdo (Tu Build)
- Debajo del Motherboard verás un error como:
  ```
  ⚠️ Socket incompatible (AM5 vs LGA1700)
  ```
- El icono de compatibilidad cambiará a 🔴 rojo

### 5.6 Cambia el Motherboard
- Vuelve a la pestaña Motherboards
- Selecciona un MB con socket AM5 (compatible)
- El error desaparecerá
- El icono cambiará a 🟢 verde

---

## ✅ Paso 6: Completa la Build Entera

Sigue este orden:

1. **Procesador** (CPU)
   - Selecciona cualquiera (ej: AMD Ryzen)

2. **Motherboard** (MB)
   - Selecciona con socket compatible
   - Verás si es compatible automáticamente

3. **Memoria RAM**
   - Selecciona RAM (DDR5, DDR4, etc.)
   - Sistema valida que MB soporte ese tipo

4. **Tarjeta Gráfica**
   - Selecciona GPU
   - Sistema valida dimensiones vs gabinete

5. **Almacenamiento**
   - Selecciona 1-2 discos
   - Sistema valida bahías disponibles

6. **Fuente de Poder**
   - Selecciona PSU
   - Sistema valida potencia suficiente para todo

7. **Gabinete**
   - Selecciona case
   - Sistema valida que todo cabe adentro

---

## ✅ Paso 7: Guarda tu Build

Cuando termines (con o sin warnings):
1. Haz clic en botón **"Guardar Build"**
2. Debería aparecer: ✅ "Build guardado!"
3. Verifica en "Mis Proyectos" que aparece tu build

---

## ✅ Verificación de Éxito

### Checklist de Funcionamiento Correcto

- [ ] Se cargan 16 procesadores sin filtros
- [ ] Se cargan 13 motherboards sin filtros
- [ ] Se cargan 13 RAM sin filtros
- [ ] Se cargan 10 GPU sin filtros
- [ ] Se cargan 10 discos sin filtros
- [ ] Se cargan 10 fuentes sin filtros
- [ ] Se cargan 10 gabinetes sin filtros
- [ ] Puedo seleccionar componentes de CUALQUIER socket
- [ ] No hay restricción al agregar (aunque sea incompatible)
- [ ] El sistema AUTOMÁTICAMENTE detecta incompatibilidades
- [ ] Veo errores/warnings en rojo en la UI
- [ ] Cuando cambio componentes, se actualiza automáticamente
- [ ] Puedo guardar la build

---

## ❌ Si Algo No Funciona

### Error: "No hay componentes disponibles"
```
Solución:
1. Verifica que el servidor está corriendo (puerto 5000)
2. Revisa en consola del navegador si hay errores
3. Abre http://localhost:5000/components/processors directamente
   - Debe retornar JSON con datos
```

### Error: "Socket incompatible" pero debería ser compatible
```
Solución:
1. Abre consola del navegador (F12)
2. Busca logs de compatibilidad
3. Verifica en BD que socket está correcto:
   SELECT socket FROM procesadores WHERE id = 14;
```

### Error: "No puedo agregar un segundo componente del mismo tipo"
```
Solución:
Para RAM y Almacenamiento, deberías poder agregar múltiples.
Esto está implementado en handleAddComponent()
```

### Servidor crasha al iniciar
```
Solución:
1. Puerto 5000 ya está en uso:
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

2. Base de datos no conecta:
   - Verifica DATABASE_URL en Server/.env
   - Verifica BD está corriendo
   - Ejecuta: node test-api.js para diagnóstico
```

---

## 📊 Información de Contacto

Si algo no funciona después de estos pasos:

1. **Revisa**: Documentacion/09_PREGUNTAS_FRECUENTES.md
2. **Ejecuta**: Server/test-api.js para diagnóstico
3. **Verifica**: Consola del navegador (F12) → Console tab
4. **Revisa**: Server/server.js logs (terminal del servidor)

---

**Fecha**: 2025-01-15  
**Versión**: 1.0  
**Estado**: ✅ Listo para Pruebas

Sigue estos pasos y debería funcionar correctamente.
Si algo falla, el problema será obvio en los logs.
