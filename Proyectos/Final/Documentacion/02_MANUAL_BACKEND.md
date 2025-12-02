
## Estructura de Carpetas

```
Server/
├── Components/
│   ├── authController.js           - Autenticación de usuarios
│   ├── componentController.js      - CRUD de componentes
│   ├── componentService.js         - Lógica de componentes
│   ├── projectController.js        - Gestión de proyectos
│   ├── projectService.js           - Lógica de proyectos
│   ├── propertyController.js       - Propiedades de componentes
│   ├── propertyService.js          - Lógica de propiedades
│   ├── userService.js              - Gestión de usuarios
│   ├── GoogleAuth.js               - Autenticación con Google
│   ├── database.js                 - Conexión a BD
│   ├── compatibilityService.js     - Validación de compatibilidad
│   ├── compatibilityController.js  - Endpoints de compatibilidad
│   └── startupMonitor.js           - Monitor de inicio
├── server.js                       - Archivo principal
├── package.json                    - Dependencias
└── .env                           - Variables de entorno
```

---

## Endpoints de la API

### Componentes

```
GET    /components/procesadores         - Obtener todos los procesadores
GET    /components/procesadores/:id     - Obtener procesador por ID
POST   /components/procesadores         - Crear procesador
PUT    /components/procesadores/:id     - Actualizar procesador
DELETE /components/procesadores/:id     - Eliminar procesador

GET    /components/motherboards         - Obtener motherboards
POST   /components/motherboards         - Crear motherboard
PUT    /components/motherboards/:id     - Actualizar
DELETE /components/motherboards/:id     - Eliminar

GET    /components/ram                  - Obtener memorias RAM
GET    /components/tarjetas_graficas    - Obtener tarjetas gráficas
GET    /components/almacenamiento       - Obtener almacenamiento
GET    /components/fuentes_poder        - Obtener fuentes de poder
GET    /components/gabinetes            - Obtener gabinetes
```

### Compatibilidad

```
POST /compatibility/socket         - Validar socket CPU vs MB
POST /compatibility/ram            - Validar RAMs múltiples
POST /compatibility/storage        - Validar almacenamiento
POST /compatibility/gpu            - Validar GPU
POST /compatibility/format         - Validar formato
POST /compatibility/power          - Validar potencia
POST /compatibility/complete-build - Validación completa
```

### Proyectos

```
GET    /projects                   - Obtener proyectos del usuario
GET    /projects/:id               - Obtener proyecto por ID
POST   /projects                   - Crear nuevo proyecto
PUT    /projects/:id               - Actualizar proyecto
DELETE /projects/:id               - Eliminar proyecto
```

### Autenticación

```
POST /auth/login                   - Login de usuario
POST /auth/register                - Registro de usuario
POST /auth/google                  - Login con Google
```

---

## Controladores Principales

### ComponentController

Maneja todas las operaciones CRUD de componentes.

```javascript
// Obtener todos los componentes de un tipo
GET /components/{tipo}

// Obtener componente específico
GET /components/{tipo}/{id}

// Crear componente
POST /components/{tipo}
Body: {
  marca: "string",
  modelo: "string",
  especificaciones: "string",
  ...otros campos
}

// Actualizar componente
PUT /components/{tipo}/{id}

// Eliminar componente
DELETE /components/{tipo}/{id}
```

### CompatibilityController

Valida compatibilidad entre componentes.

```javascript
// Socket compatibility
POST /compatibility/socket
Body: { cpuId: number, motherboardId: number }
Response: { compatible: boolean, issues: string[] }

// RAM compatibility
POST /compatibility/ram
Body: { ramIds: number[], motherboardId: number }
Response: { compatible: boolean, issues: string[] }

// Poder
POST /compatibility/power
Body: { cpuId, psuId, gpuId?, ramIds?, storageIds? }
Response: { 
  compatible: boolean, 
  actual: number,
  recommended: number,
  issues: string[]
}
```

---

## Servicios Principales

### ComponentService

Lógica de negocio para componentes:
- `getProcessors()` - Obtener CPUs
- `getMotherboards()` - Obtener motherboards
- `getRAM()` - Obtener memorias
- `getGPUs()` - Obtener tarjetas gráficas
- `getStorage()` - Obtener almacenamiento
- `getPSUs()` - Obtener fuentes
- `getCases()` - Obtener gabinetes

### CompatibilityService

Validaciones de compatibilidad:
- `validateSocketCompatibility()` - CPU vs MB
- `validateRAMCompatibility()` - Múltiples RAMs
- `validateStorageCompatibility()` - Almacenamiento
- `validateGPUCompatibility()` - Tarjeta gráfica
- `validateFormatCompatibility()` - Formato MB vs Case
- `validatePowerSupply()` - Consumo de poder
- `validateCompleteBuild()` - Build completo

---

## Variables de Entorno

```env
# Base de Datos
DB_HOST=ep-yellow-sky-a1u2u3v4.neon.tech
DB_PORT=5432
DB_NAME=PCBuilderDB
DB_USER=default
DB_PASSWORD=tu-contraseña-aqui

# Servidor
NODE_ENV=development
PORT=5000

# Google Auth (opcional)
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
```

---

## Flujo de Datos

```
Cliente Frontend
    ↓
Expo/React Native
    ↓
API REST (http://localhost:5000)
    ↓
Express.js Server
    ↓
Services (Lógica de negocio)
    ↓
PostgreSQL Database
```

---

## Base de Datos

### Tablas Principales

**procesadores**
```
- id (PK)
- marca
- modelo
- nucleos
- socket
- frecuencia_base
- tipo_memoria
- tdp
```

**motherboards**
```
- id (PK)
- marca
- modelo
- socket
- tipo_memoria
- formato
- chipset
- slots_memoria
- memoria_maxima_gb
- velocidad_maxima_mhz
- bahias_sata
- puertos_m2
- slots_pcie
```

**memorias_ram**
```
- id (PK)
- marca
- modelo
- capacidad
- tipo (DDR4/DDR5)
- velocidad_mhz
- velocidad_mt
- latencia
```

**tarjetas_graficas**
```
- id (PK)
- marca
- modelo
- memoria
- tipo_memoria
- nucleos_cuda
- potencia_requerida_w
- longitud_mm
- altura_mm
- slots_ocupados
```

**almacenamiento**
```
- id (PK)
- marca
- modelo
- capacidad
- tipo (SSD/HDD)
- interfaz
- tamaño_fisico_mm
- velocidad_lectura_mbs
```

**fuentes_poder**
```
- id (PK)
- marca
- modelo
- potencia_w
- certificacion
- modular
- conectores_8pin
- conectores_6pin
- conectores_pcie
- conectores_sata
- conectores_molex
```

**gabinetes**
```
- id (PK)
- marca
- modelo
- formato
- motherboards_soportadas
- formato_soportado
- longitud_max_gpu_mm
- altura_max_cooler_mm
- bahias_3_5
- bahias_2_5
- slots_m2_backplane
```

---

## Ejemplo de Solicitud API

### Obtener todos los procesadores

```bash
curl -X GET http://localhost:5000/components/procesadores
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "marca": "Intel",
      "modelo": "i9-13900K",
      "nucleos": 24,
      "socket": "LGA 1700",
      "frecuencia_base": 3.0,
      "tipo_memoria": "DDR5",
      "tdp": 253
    }
  ]
}
```

### Validar compatibilidad de socket

```bash
curl -X POST http://localhost:5000/compatibility/socket \
  -H "Content-Type: application/json" \
  -d '{"cpuId": 1, "motherboardId": 2}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "compatible": true,
    "issues": []
  }
}
```

---

## Autenticación

### Login

```bash
POST /auth/login
Body: {
  email: "usuario@ejemplo.com",
  password: "contraseña"
}

Response: {
  success: true,
  token: "jwt-token-aqui",
  user: { id, email, nombre }
}
```

### Register

```bash
POST /auth/register
Body: {
  email: "nuevo@ejemplo.com",
  password: "contraseña",
  nombre: "Tu Nombre"
}

Response: {
  success: true,
  token: "jwt-token-aqui",
  user: { id, email, nombre }
}
```

---

## Monitoreo y Logs

El servidor incluye logging automático de:
- Conexiones a la base de datos
- Solicitudes de API
- Errores y excepciones
- Validaciones de compatibilidad

Revisa la consola del servidor para ver:
```
✅ Servidor activo en puerto 5000
✅ Conexión a BD establecida
⚠️  Error: Campo requerido faltante
```

---

## Solución de Problemas

### Puerto 5000 en uso
```powershell
Get-Process -Name node | Stop-Process -Force
```

### Conexión a BD falla
- Verificar credenciales en `.env`
- Comprobar que Neon está accesible
- Revisar logs de error

### Endpoint no encontrado
- Verificar ruta es correcta
- Asegurarse que rutas están registradas en `server.js`
- Revisar nombre del controlador

---

## Desarrollo

### Agregar nuevo endpoint

1. Crear método en el controlador:
```javascript
// ComponentController.js
export const obtenerMisDatos = async (req, res) => {
  try {
    // Tu lógica aquí
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
```

2. Registrar ruta en `server.js`:
```javascript
app.get('/ruta/nueva', componentController.obtenerMisDatos);
```

### Modificar validaciones

Editar `compatibilityService.js`:
```javascript
async validateMiValidacion(param1, param2) {
  // Tu lógica de validación
  return {
    compatible: true/false,
    issues: [],
    warnings: []
  };
}
```
