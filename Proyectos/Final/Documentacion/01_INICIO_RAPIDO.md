# 🚀 Inicio Rápido

## Primeros Pasos

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd "c:\Users\valle\Documents\GitHub\PDeISC\Proyectos\Final"
```

### 2. Instalar Dependencias

**Backend:**
```bash
cd Server
npm install
```

**Frontend:**
```bash
cd ProyectoFinalACV
npm install
```

### 3. Configurar Variables de Entorno

**Backend** - Crear `Server/.env`:
```bash
DB_HOST=tu-host-neon
DB_PORT=5432
DB_NAME=PCBuilderDB
DB_USER=default
DB_PASSWORD=tu-contraseña
NODE_ENV=development
```

**Frontend** - Crear `ProyectoFinalACV/.env.local`:
```bash
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_PRODUCTION_API_URL=https://tu-api-produccion.com
```

### 4. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd Server
npm start
# Servidor activo en http://192.168.1.38:5000
```

**Terminal 2 - Frontend:**
```bash
cd ProyectoFinalACV
npm start
# Expo activo en http://localhost:8082
```

### 5. Abrir en el Navegador
```
http://localhost:8082
```

---

## Estructura del Proyecto

```
Final/
├── Documentacion/              ← Toda la documentación aquí
├── Server/                     ← Backend (Node.js + Express)
│   ├── Components/             ← Servicios y controladores
│   ├── package.json
│   └── server.js
├── ProyectoFinalACV/           ← Frontend (React Native + Expo)
│   ├── app/
│   │   ├── (tabs)/             ← Pantallas
│   │   ├── services/           ← Servicios API
│   │   └── ...
│   └── package.json
└── ...
```

---

## Tecnologías Utilizadas

### Backend
- **Node.js** v22.21.0
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos (Neon)
- **módulos ESM** - Estructura de módulos moderna

### Frontend
- **React Native** - Framework multiplataforma
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP

### Base de Datos
- **PostgreSQL** - BD relacional
- **Neon** - Hosting en la nube

---

## Comandos Útiles

### Backend
```bash
# Iniciar servidor
npm start

# Iniciar en desarrollo con recarga automática
npm run dev

# Revisar sintaxis
node -c server.js
```

### Frontend
```bash
# Iniciar Expo
npm start

# Abrir en navegador
npm run web

# Limpiar caché
npm run reset-cache
```

---

## Solución de Problemas Comunes

### El backend no inicia
- Verificar variables de entorno en `.env`
- Revisar que PostgreSQL/Neon está accesible
- Revisar puertos: `netstat -ano | findstr :5000`

### El frontend no carga datos
- Verificar que backend está corriendo
- Revisar consola del navegador (F12)
- Comprobar URL de API en `apiConfig.ts`

### Error de conexión a BD
- Verificar credenciales en `.env`
- Comprobar estado de Neon Dashboard
- Revisar logs del servidor

---

## Documentación Completa

En la carpeta `Documentacion/` encontrarás:
- **Guía de Arquitectura** - Estructura técnica del proyecto
- **Manual del Backend** - API y servicios
- **Manual del Frontend** - Componentes y flujos
- **Compatibilidad Avanzada** - Sistema de validación
- **Base de Datos** - Schema y migraciones
- **Instalación y Despliegue** - Guías paso a paso

---

**Última actualización**: 2025-11-12  
**Versión**: 1.0  
