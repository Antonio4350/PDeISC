# ❓ Preguntas Frecuentes y Solución de Problemas

## Preguntas Frecuentes

### Instalación y Configuración

#### ¿Qué requisitos necesito para ejecutar el proyecto?
1. **Node.js** 18+ (recomendado 22.21.0)
2. **npm** o yarn
3. **PostgreSQL** (o Neon para la nube)
4. **Git**
5. **Expo CLI** (para frontend)

Verifica las versiones:
```bash
node --version    # Debe ser v18+
npm --version     # Debe ser 10+
```

#### ¿Cómo configuro las variables de entorno?
Crea un archivo `.env` en la raíz de `/Server` con:
```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_db
JWT_SECRET=tu_secreto_muy_seguro_aqui
NODE_ENV=development
PORT=5000
GOOGLE_CLIENT_ID=tu_id_de_google
GOOGLE_CLIENT_SECRET=tu_secreto_de_google
```

#### ¿Puedo usar una base de datos existente?
Sí, pero necesitas ajustar la `DATABASE_URL` en `.env` para apuntar a tu base de datos.

Si la base de datos no tiene las tablas, ejecuta los scripts SQL en `antoniopcbuilder.sql`.

#### ¿Cómo instalo dependencias?
```bash
# Backend
cd Server
npm install

# Frontend
cd ProyectoFinalACV
npm install
```

---

### Ejecución y Desarrollo

#### ¿Cómo inicio el desarrollo localmente?
Abre 3 terminales:

**Terminal 1 - Backend:**
```bash
cd Server
npm start
# O en modo desarrollo con hot reload:
npm run dev
```

**Terminal 2 - Frontend (Web):**
```bash
cd ProyectoFinalACV
npm start
```

**Terminal 3 - Database:**
Si usas PostgreSQL local:
```bash
psql -U postgres -d antoniopcbuilder
```

#### ¿En qué puerto ejecuta el servidor?
- Backend (Express): `5000`
- Frontend (Expo): `8082` (web) o `8081` (mobile)

#### ¿El backend falla al iniciar?
**Síntomas**: `Error: Cannot connect to database`

**Soluciones**:
1. Verifica que PostgreSQL está corriendo:
   ```bash
   # Windows
   Get-Service "PostgreSQL*"
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verifica la `DATABASE_URL` en `.env`

3. Asegúrate que la base de datos existe:
   ```bash
   createdb antoniopcbuilder
   ```

4. Ejecuta los scripts SQL:
   ```bash
   psql -U postgres -d antoniopcbuilder -f antoniopcbuilder.sql
   ```

---

### Frontend y UI

#### ¿Por qué no aparecen los componentes?
1. Verifica que el backend está corriendo (`npm start` en `/Server`)
2. Abre la consola del navegador (F12) y revisa errores
3. Verifica que `API_URL` en `config` apunta a `http://localhost:5000`

#### ¿Cómo cambio el tema (oscuro/claro)?
El tema es automático basado en el sistema operativo. Para cambiar manualmente:

En `hooks/use-color-scheme.ts`, modifica:
```typescript
const colorScheme = useColorScheme() // Se auto-detecta
// O fuerza un esquema:
const colorScheme = 'dark' // 'light' o 'dark'
```

#### ¿Por qué la validación de compatibilidad no funciona?
1. Verifica que agregaste al menos 1 componente
2. Asegúrate que cada componente tiene datos válidos en la BD
3. Revisa la consola para mensajes de error

#### ¿Cómo descargo un proyecto como PDF?
Actualmente, la función de exportar a PDF no está disponible. Puedes:
1. Captura de pantalla (Print Screen)
2. Imprimir a PDF desde el navegador (Ctrl+P)
3. Copiar los datos manualmente

---

### Autenticación

#### ¿Olvidé mi contraseña?
Actualmente no hay recuperación de contraseña automática. Opciones:
1. Pide al admin que restablezca tu contraseña en la BD
2. Elimina tu cuenta y registra una nueva
3. Usa "Login con Google" si lo disponibilizaron

#### ¿Cómo funciona "Login con Google"?
1. Haz clic en "Continuar con Google"
2. Selecciona tu cuenta de Google
3. Se te redirige y se crea automáticamente un usuario

#### ¿Qué significa "Token inválido"?
Tu sesión expiró. Solución: Haz login nuevamente.

Los tokens expiran después de:
- Desarrollo: 24 horas
- Producción: 1 hora (en `authController.js`)

---

### Proyectos y Componentes

#### ¿Cuántos componentes puedo agregar?
No hay límite técnico, pero recuerda:
- **RAM**: Máximo 4 módulos (slots disponibles)
- **Almacenamiento**: Máximo 4 (2x M.2 + 2x SATA)
- **Otros componentes**: 1 cada uno (CPU, MB, GPU, PSU, Case)

#### ¿Puedo editar un proyecto después de crearlo?
Sí. Abre el proyecto y modifica los componentes. Los cambios se guardan automáticamente.

#### ¿Cómo elimino un proyecto?
En "Mis Proyectos", busca el proyecto y haz clic en el botón "Eliminar" (papelera).

**Advertencia**: No se puede deshacer esta acción.

#### ¿Qué significa "Incompatible"?
Un componente no funciona con los otros. Ejemplos:
- Socket de CPU no coincide con motherboard
- RAM no es del tipo/velocidad soportada
- GPU es demasiado larga para el gabinete
- Fuente de poder insuficiente

Revisa los detalles en la sección de "Compatibilidad" para ver cuál es el problema.

---

### Base de Datos

#### ¿Cómo hago un backup de la BD?
```bash
# Backup completo
pg_dump -U postgres antoniopcbuilder > backup.sql

# Restore
psql -U postgres antoniopcbuilder < backup.sql
```

#### ¿Cómo agrego nuevos componentes a la BD?
En SQL:
```sql
INSERT INTO procesadores (
  nombre, socket, nucleos, frecuencia_base, frecuencia_boost, tdp, precio
) VALUES (
  'Intel Core i9-14900K', 'LGA1700', 24, 3.6, 6.2, 170, 589.00
);
```

O usa el Panel Admin en la aplicación.

#### ¿Cómo elimino datos de prueba?
```sql
-- Deletear todos los proyectos de un usuario
DELETE FROM proyectos WHERE usuario_id = 'uuid-usuario';

-- Deletear componentes
DELETE FROM procesadores WHERE id = 1;

-- CUIDADO: Esto elimina todo
DELETE FROM usuarios;
```

---

## Solución de Problemas

### Error: "ECONNREFUSED"
**Significa**: No puedes conectarte al servidor (backend)

**Soluciones**:
1. Verifica que el backend está corriendo:
   ```bash
   lsof -i :5000  # Linux/Mac
   netstat -ano | findstr :5000  # Windows
   ```

2. Si otro proceso ocupa el puerto:
   ```bash
   kill -9 <PID>  # Linux/Mac
   taskkill /PID <PID> /F  # Windows
   ```

3. Reinicia el backend

---

### Error: "CORS Error"
**Significa**: El navegador bloqueó una solicitud cross-origin

**Solución en backend** (`Server/server.js`):
```javascript
app.use(cors({
  origin: ['http://localhost:8082', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

Reinicia el backend después de cambiar.

---

### Error: "Database Connection Refused"
**Significa**: PostgreSQL no está corriendo

**Soluciones**:
1. Inicia PostgreSQL:
   ```bash
   # Windows
   pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start
   
   # Linux
   sudo systemctl start postgresql
   
   # Mac
   brew services start postgresql
   ```

2. Verifica el puerto (default 5432):
   ```bash
   psql -h localhost -U postgres
   ```

---

### Error: "Module not found"
**Significa**: Falta una dependencia

**Soluciones**:
1. Reinstala dependencias:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Verifica el nombre del archivo (case-sensitive en Linux)

3. Ejecuta en la carpeta correcta

---

### El servidor se cuelga / lentitud
**Síntomas**: La aplicación responde lentamente o se congela

**Soluciones**:
1. Revisa uso de memoria:
   ```bash
   # Linux
   free -h
   
   # Windows
   Get-Process node | Format-Table Name, WorkingSet
   ```

2. Revisa logs del servidor para queries lentas

3. Reinicia el servidor

4. Si persiste, puede ser un query ineficiente en la BD

---

### Errores de Compatibilidad no funcionan
**Síntomas**: Todos los builds dicen "Compatible" incluso si no lo son

**Soluciones**:
1. Verifica que los datos en la BD están completos:
   ```sql
   SELECT * FROM procesadores WHERE id = 1;
   -- Debe tener: socket, tdp, nucleos, etc.
   ```

2. Revisa `compatibilityService.js` para validaciones

3. Mira la consola del backend para errores

4. Prueba con el endpoint `/compatibility/check` directamente

---

### Login no funciona
**Síntomas**: 
- "Email o contraseña incorrectos"
- "Usuario no existe"

**Soluciones**:
1. Verifica que te registraste primero
2. Comprueba que el email y contraseña son correctos (case-sensitive)
3. Revisa que el usuario existe en la BD:
   ```sql
   SELECT * FROM usuarios WHERE email = 'tuEmail@example.com';
   ```

4. Si la contraseña olvidaste, pide al admin que la resetee

---

### "Unauthorized" en endpoints protegidos
**Significa**: No enviaste el JWT token

**Soluciones**:
1. Asegúrate de hacer login primero
2. Verifica que el token se guardó en localStorage:
   ```javascript
   console.log(localStorage.getItem('userToken'))
   ```

3. Comprueba que envías el header correcto:
   ```
   Authorization: Bearer <TOKEN>
   ```

4. Si el token expiró, haz login nuevamente

---

### Problemas con Google OAuth
**Síntomas**: 
- "Google Auth failed"
- Redirección incorrecta

**Soluciones**:
1. Verifica que `GOOGLE_CLIENT_ID` en `.env` es correcto
2. En Google Cloud Console, agrega las URLs permitidas:
   ```
   http://localhost:8082
   http://localhost:5000
   https://tu-dominio.com
   ```

3. Reinicia el servidor después de cambiar `.env`

---

### Error al guardar un proyecto
**Síntomas**: "Error al guardar proyecto"

**Soluciones**:
1. Verifica que tienes una sesión activa (login)
2. Revisa que el nombre del proyecto no está vacío
3. Mira la consola del navegador para más detalles
4. Intenta refrescar la página

---

### Componentes no se ven en el catálogo
**Síntomas**: "No hay componentes disponibles"

**Soluciones**:
1. Verifica que la BD tiene datos:
   ```sql
   SELECT COUNT(*) FROM procesadores;
   ```

2. Si está vacía, ejecuta el script de datos:
   ```bash
   psql -U postgres -d antoniopcbuilder -f UPDATE_COMPONENT_DATA.sql
   ```

3. Revisa que el backend está corriendo

4. Intenta refrescar (Ctrl+F5 para limpiar caché)

---

## Debugging Avanzado

### Habilitar logs detallados en backend
En `server.js`:
```javascript
// Agrega antes de app.listen()
app.use((req, res, next) => {
  console.log('▶ [%s] %s %s', new Date().toISOString(), req.method, req.path)
  console.log('  Body:', JSON.stringify(req.body, null, 2))
  console.log('  Headers:', req.headers)
  next()
})
```

### Ver queries SQL en PostgreSQL
En `database.js`:
```javascript
client.on('query', (query) => {
  console.log('📊 SQL:', query.text)
})
```

### Inspeccionar requests en el navegador
1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Realiza la acción
4. Haz clic en la solicitud para ver detalles

---

## Contacto y Soporte

Si el problema persiste:
1. Revisa los logs completos en la consola
2. Busca en GitHub Issues del proyecto
3. Contacta al equipo de desarrollo
4. Proporciona:
   - Versión de Node.js
   - Sistema operativo
   - Steps para reproducir el error
   - Mensajes de error exactos
   - Logs de la consola

---

**Última actualización**: 2025-11-12  
**Versión**: 1.0
