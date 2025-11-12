# 🚀 Instalación y Despliegue

## Instalación Local

### Requisitos Previos

**Hardware Mínimo**:
- 4GB RAM
- 500MB disco duro disponible
- Conexión a internet

**Software Requerido**:
- Node.js v18+ (https://nodejs.org/)
- Git (https://git-scm.com/)
- PostgreSQL client (incluido en Neon)
- Visual Studio Code (recomendado)

### Paso 1: Clonar Repositorio

```bash
git clone https://github.com/Antonio4350/PDeISC.git
cd "PDeISC/Proyectos/Final"
```

### Paso 2: Instalar Dependencias Backend

```bash
cd Server
npm install
```

**Dependencias principales**:
- express - Framework web
- pg - Driver PostgreSQL
- cors - Seguridad CORS
- dotenv - Variables de entorno

### Paso 3: Instalar Dependencias Frontend

```bash
cd ../ProyectoFinalACV
npm install
```

**Dependencias principales**:
- expo - Plataforma de desarrollo
- react-native - Framework mobile
- axios - Cliente HTTP
- typescript - Tipado estático

### Paso 4: Configurar Variables de Entorno

**Backend** - Crear `Server/.env`:
```bash
DB_HOST=tu-host-neon.neon.tech
DB_PORT=5432
DB_NAME=PCBuilderDB
DB_USER=default
DB_PASSWORD=tu-contraseña-segura
NODE_ENV=development
PORT=5000
```

**Frontend** - Crear `ProyectoFinalACV/.env.local`:
```bash
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_PRODUCTION_API_URL=https://tu-api-prod.com
```

### Paso 5: Ejecutar Localmente

**Terminal 1 - Backend**:
```bash
cd Server
npm start
# Output: ✅ Servidor activo en puerto 5000
```

**Terminal 2 - Frontend**:
```bash
cd ProyectoFinalACV
npm start
# Output: Expo activo en http://localhost:8082
```

**Terminal 3 (Opcional) - Abrir navegador**:
```bash
# Navega a http://localhost:8082
# Prensa 'w' para abrir en navegador web
```

---

## Despliegue en Vercel

### Backend en Vercel

#### Paso 1: Preparar Repositorio

```bash
# Asegúrate que el código está en GitHub
git add .
git commit -m "Preparado para despliegue"
git push origin main
```

#### Paso 2: Crear Proyecto en Vercel

1. Ve a https://vercel.com
2. Haz click en "New Project"
3. Selecciona tu repositorio
4. Configura las variables de entorno:

```
DB_HOST=tu-neon-host.neon.tech
DB_PORT=5432
DB_NAME=PCBuilderDB
DB_USER=default
DB_PASSWORD=tu-contraseña
NODE_ENV=production
```

#### Paso 3: Configurar para Monorepo

Vercel necesita saber dónde está el backend.

En el proyecto, especifica:
- **Root Directory**: `Server/`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

#### Paso 4: Desplegar

Click en "Deploy" y espera a que termine.

**URL resultante**: `https://tu-proyecto.vercel.app`

---

### Frontend en Vercel

#### Opción 1: Expo Web Simplificado

```bash
cd ProyectoFinalACV
npm run web
# Crea build web en ./web-build
```

#### Opción 2: Vercel Completo

1. Crear proyecto separado en Vercel
2. Conectar repositorio
3. Configurar variables:

```
EXPO_PUBLIC_API_URL=https://tu-backend.vercel.app
EXPO_PUBLIC_PRODUCTION_API_URL=https://tu-backend.vercel.app
```

4. Build Command: `npm run web`
5. Output Directory: `.web-build`

---

## Despliegue en Render

### Backend en Render

#### Paso 1: Conectar Repositorio

1. Ve a https://render.com
2. Click en "New" → "Web Service"
3. Conecta tu GitHub
4. Selecciona repository

#### Paso 2: Configurar Servicio

- **Name**: pcbuilder-backend
- **Root Directory**: Server/
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment**: Node

#### Paso 3: Agregar Variables de Entorno

En Render, ve a "Environment":
```
DB_HOST=tu-neon-host
DB_PORT=5432
DB_NAME=PCBuilderDB
DB_USER=default
DB_PASSWORD=contraseña
NODE_ENV=production
```

#### Paso 4: Desplegar

Click en "Create Web Service" y espera.

**URL resultante**: `https://pcbuilder-backend.onrender.com`

---

## Despliegue en Heroku

### Nota: Heroku descontinuó su plan gratuito

Para alternativas gratuitas, usa:
- **Render** (recomendado)
- **Fly.io**
- **Railway**

---

## Configuración de Base de Datos Neon

### Paso 1: Crear Cuenta Neon

1. Ve a https://neon.tech
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

### Paso 2: Obtener Credenciales

En Neon Dashboard:
- Obtén el **Connection String**
- Extrae: HOST, PORT, DATABASE, USER, PASSWORD

```
postgresql://user:password@host.neon.tech:5432/dbname
```

### Paso 3: Crear Tablas

Ejecuta el script SQL:
```bash
# En Neon Dashboard, ve a SQL Editor
# Copia contenido de migraciones SQL
# Ejecuta
```

O desde Node.js:
```javascript
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);
await client.connect();
await client.query(sqlScript);
await client.end();
```

### Paso 4: Verificar Conexión

```bash
# Desde terminal
psql "postgresql://user:password@host.neon.tech:5432/dbname"

# Desde Node.js
npm run test-connection
```

---

## Configuración de Dominio

### Usar Dominio Personalizado en Vercel

1. Compra dominio (Namecheap, GoDaddy, etc.)
2. En Vercel, ve a "Settings" → "Domains"
3. Agrega tu dominio
4. Configura DNS según instrucciones Vercel

```
Ejemplo resultado:
https://miproyecto.com → https://miproyecto.vercel.app
```

### Certificado SSL

Vercel proporciona certificados SSL **gratis** automáticamente.

---

## Variables de Entorno por Ambiente

### Desarrollo (Local)
```bash
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
API_URL=http://localhost:5000
LOG_LEVEL=debug
```

### Staging (Pre-producción)
```bash
NODE_ENV=staging
DB_HOST=tu-neon-staging.neon.tech
DB_PORT=5432
API_URL=https://api-staging.tu-dominio.com
LOG_LEVEL=info
```

### Producción
```bash
NODE_ENV=production
DB_HOST=tu-neon-prod.neon.tech
DB_PORT=5432
API_URL=https://api.tu-dominio.com
LOG_LEVEL=warn
```

---

## Automatización CI/CD

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          npm install
          npm run build
          # Push a Vercel/Render
      
      - name: Deploy Frontend
        run: |
          npm install
          npm run web
          # Push a Vercel
```

---

## Checklist de Despliegue

### Antes de Desplegar

```
✅ Verificar que código está limpio
✅ Todos los tests pasan (si existen)
✅ Variables de entorno configuradas
✅ Dependencias actualizadas
✅ Documentación actualizada
✅ Respaldo de base de datos hecho
✅ URL de API configurada en frontend
✅ Credenciales NO están en el código
```

### Durante Despliegue

```
✅ Monitorear logs de despliegue
✅ Verificar que servicio inicia correctamente
✅ Comprobar conectividad a BD
✅ Probar endpoints clave
```

### Después de Despliegue

```
✅ Verificar URL de producción funciona
✅ Probar login y features principales
✅ Revisar logs de errores
✅ Monitorear performance
✅ Notificar a equipo
```

---

## Solución de Problemas Comunes

### "Conexión a BD rechazada"
```
Solución:
1. Verificar credenciales en .env
2. Comprobar que Neon está activo
3. Revisar IP whitelist en Neon
4. Verificar conectividad de red
```

### "Módulo no encontrado"
```
Solución:
1. npm install en la carpeta correcta
2. Verificar nombres de archivos (case-sensitive)
3. Limpiar node_modules: rm -rf node_modules
4. npm install nuevamente
```

### "Puerto 5000 en uso"
```
Solución:
1. Cambiar puerto: PORT=3000 npm start
2. Matar proceso: pkill -f "node server.js"
3. Verificar: netstat -ano | findstr :5000
```

### "Frontend no encuentra API"
```
Solución:
1. Verificar EXPO_PUBLIC_API_URL en .env.local
2. Confirmar backend está corriendo
3. Revisar CORS en server.js
4. Comprobar F12 → Network → Errors
```

---

## Monitoreo en Producción

### Logs

**Vercel**:
- Ve a tu proyecto
- "Analytics" → "Function Logs"

**Render**:
- Ve a tu servicio
- "Logs" tab

**Local**:
```bash
npm start 2>&1 | tee server.log
```

### Alertas

Configurar notificaciones para:
- Errores en servidor
- Caídas de BD
- High CPU/Memory usage
- Requests lentos

---

## Backup y Recuperación

### Backup de BD en Neon

```sql
-- En Neon Dashboard
-- Ir a "Backups"
-- Crear backup manual
```

### Restaurar desde Backup

```sql
-- Contactar a soporte Neon
-- Proporcionar timestamp del backup
-- Ellos restauran la BD
```

### Backup Local

```bash
pg_dump "postgresql://user:pass@host:5432/db" > backup.sql
```

---

## Escalabilidad Futura

### Si necesitas más usuarios

1. **Base de Datos**:
   - Escalar plan Neon (más CPU/RAM)
   - Agregar réplicas para lectura

2. **Backend**:
   - Usar múltiples instancias (con balanceador)
   - Cachear responses

3. **Frontend**:
   - CDN global (Vercel incluye)
   - Optimizar assets

---

**Última actualización**: 2025-11-12  
**Versión**: 1.0
