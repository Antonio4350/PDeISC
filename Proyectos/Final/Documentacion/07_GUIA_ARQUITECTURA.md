# 🏗️ Guía de Arquitectura

## Visión General

El proyecto sigue una arquitectura **cliente-servidor** con separación clara entre frontend, backend y base de datos.

```
┌─────────────────────────────────────────────────────────────┐
│                   NAVEGADOR WEB / MOBILE                     │
│              (React Native + Expo + TypeScript)              │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │   PcBuilder │  │   Proyectos  │  │  Panel Admin       │ │
│  └─────────────┘  └──────────────┘  └────────────────────┘ │
│                                                               │
│           ↓ REST API (Axios + Fetch)                        │
├─────────────────────────────────────────────────────────────┤
│                   BACKEND (Node.js + Express)                │
│                     Puerto: 5000                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             API REST Endpoints                        │  │
│  │  /components/* /compatibility/* /projects/* /auth/*   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Services Layer                           │  │
│  │  ComponentService  ProjectService  AuthService      │  │
│  │  CompatibilityService  PropertyService               │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
├─────────────────────────────────────────────────────────────┤
│              BASE DE DATOS (PostgreSQL en Neon)              │
│                                                               │
│  [Usuarios] [Componentes] [Proyectos] [Relaciones]         │
└─────────────────────────────────────────────────────────────┘
```

---

## Capas de la Aplicación

### 1. Presentación (Frontend)

**Tecnología**: React Native + Expo + TypeScript

**Responsabilidades**:
- Interfaz de usuario
- Interacción con usuario
- Validación de entrada
- Manejo de estado local
- Llamadas a API

**Componentes Principales**:
- `PcBuilder.tsx` - Constructor de PCs
- `ComponentsCatalog.tsx` - Catálogo de componentes
- `Projects.tsx` - Gestión de proyectos
- `AdminPanel.tsx` - Administración
- `Login.tsx` / `Register.tsx` - Autenticación

**Flujo de Datos**:
```
Usuario Interactúa
    ↓
Componente React actualiza estado
    ↓
Servicio hace request HTTP
    ↓
Backend procesa
    ↓
Respuesta llega
    ↓
Estado se actualiza
    ↓
UI se renderiza
```

### 2. Negocio (Backend)

**Tecnología**: Node.js + Express.js

**Responsabilidades**:
- Lógica de negocio
- Validaciones
- Autorización
- Procesamiento de datos
- Coordinación con BD

**Capas Internas**:

**Controllers**:
```
componentController.js          - CRUD de componentes
compatibilityController.js      - Validaciones
projectController.js            - Gestión de proyectos
authController.js               - Autenticación
propertyController.js           - Propiedades
```

**Services**:
```
componentService.js             - Lógica de componentes
compatibilityService.js         - Lógica de validación
projectService.js               - Lógica de proyectos
userService.js                  - Lógica de usuarios
```

**Helpers**:
```
database.js                     - Conexión a BD
GoogleAuth.js                   - Auth Google
startupMonitor.js               - Monitoreo
```

**Flujo de Solicitud**:
```
Request HTTP llega
    ↓
Router identifica endpoint
    ↓
Controller procesa request
    ↓
Service ejecuta lógica
    ↓
Database consulta BD
    ↓
Service retorna datos
    ↓
Controller formatea respuesta
    ↓
Response JSON se envía
```

### 3. Datos (Base de Datos)

**Tecnología**: PostgreSQL (Neon)

**Responsabilidades**:
- Almacenamiento persistente
- Integridad de datos
- Relaciones entre entidades
- Queries optimizadas

**Tablas Principales**:
- `usuarios` - Cuentas de usuarios
- `procesadores` - CPUs
- `motherboards` - Placas base
- `memorias_ram` - Módulos RAM
- `tarjetas_graficas` - GPUs
- `almacenamiento` - Discos
- `fuentes_poder` - PSUs
- `gabinetes` - Cases
- `proyectos` - Builds guardados
- `proyecto_componentes` - Relación múltiple

---

## Patrones de Diseño

### MVC (Model-View-Controller)

El backend implementa MVC:

```
Models (Database)
    ↑
Controllers (Request/Response)
    ↑
Views (JSON Response)
```

### Repository Pattern

Acceso a datos centralizado:

```javascript
// En ComponentService
async getProcessors() {
  // Consulta BD
  // Procesa datos
  // Retorna resultado
}
```

### Dependency Injection

Las dependencias se inyectan en funciones:

```javascript
export const createComponent = async (req, res, componentService) => {
  const result = await componentService.create(req.body)
  res.json(result)
}
```

---

## Flujos de Datos Principales

### Flujo 1: Ver Componentes

```
1. Frontend: GET /components/procesadores
2. Backend:
   - componentController.getProcessors()
   - componentService.queryDatabase()
   - database.query("SELECT * FROM procesadores")
3. Database: Retorna array de CPUs
4. Backend: Formatea respuesta
5. Frontend: Actualiza estado con datos
6. UI: Renderiza lista de CPUs
```

### Flujo 2: Construir PC

```
1. Frontend: Usuario selecciona componentes
2. Para cada componente:
   - Agregarlo a array local
   - Llamar validateCompatibility()
3. Backend:
   - compatibilityController recibe request
   - compatibilityService ejecuta validaciones
   - Consulta detalles en BD
   - Retorna issues/warnings
4. Frontend:
   - Recibe resultado
   - Actualiza UI con compatibilidad
   - Muestra errores o warnings
5. Usuario ve resultado visual
```

### Flujo 3: Guardar Proyecto

```
1. Frontend: Usuario hace click "Guardar"
2. Frontend: Recopila todos los componentes seleccionados
3. POST /projects
   - Body: { nombre, componentes: [...] }
4. Backend:
   - projectController.createProject()
   - projectService.save()
   - Inserta en BD
5. Database: Guarda proyecto
6. Backend: Retorna ID del proyecto
7. Frontend: Redirige a "Mis Proyectos"
```

---

## Seguridad

### Autenticación

```
Cliente                         Servidor
   │                               │
   ├─ POST /auth/login ───────────→│
   │  { email, password }          │
   │                               │
   │← JWT Token ←─────────────────│
   │                               │
   ├─ GET /projects ──────────────→│
   │  Header: Authorization: Bearer JWT
   │                               │
   │← Projects Data ←──────────────│
```

### JWT (JSON Web Token)

1. Usuario ingresa credenciales
2. Server genera JWT con payload: `{ userId, email }`
3. Cliente almacena JWT en localStorage
4. Cada request incluye JWT
5. Server valida JWT antes de procesar

### CORS

Configurado para permitir:
```
Frontend: http://localhost:8082
Backend: http://localhost:5000
```

En producción:
```
Frontend: https://tu-dominio.com
Backend: https://api.tu-dominio.com
```

---

## Validaciones

### En Frontend

Antes de enviar al backend:
```javascript
// Validar que hay componentes
if (selectedComponents.length === 0) {
  toast.error("Agrega al menos un componente")
  return
}

// Validar valores
if (!name || name.length < 3) {
  toast.error("Nombre debe tener al menos 3 caracteres")
  return
}
```

### En Backend

Después de recibir datos:
```javascript
// Validar parámetros
if (!req.body.nombre) {
  return res.json({ success: false, error: "Campo requerido: nombre" })
}

// Validar en BD
const component = await db.query(
  "SELECT * FROM procesadores WHERE id = $1",
  [req.body.componentId]
)
if (!component.rows[0]) {
  return res.json({ success: false, error: "Componente no existe" })
}
```

---

## Manejo de Errores

### Try-Catch en Backend

```javascript
try {
  const result = await componentService.getAll()
  res.json({ success: true, data: result })
} catch (error) {
  console.error("Error:", error)
  res.json({ 
    success: false, 
    error: "Error interno del servidor"
  })
}
```

### Error Handling en Frontend

```typescript
try {
  const result = await advancedCompatibility.validateCompleteBuild(build)
  if (!result.compatible) {
    toast.warning("Build incompatible")
  }
} catch (error) {
  console.error("Error validando:", error)
  // Usar validación básica como fallback
  checkBasicCompatibility()
}
```

---

## Cache y Optimización

### Frontend

```typescript
// Cache de componentes
const [componentCache, setComponentCache] = useState({})

const getComponents = async (type) => {
  // Si está en cache, retornar
  if (componentCache[type]) {
    return componentCache[type]
  }
  
  // Si no, consultar BD
  const data = await componentService.getByType(type)
  setComponentCache(prev => ({ ...prev, [type]: data }))
  return data
}
```

### Backend

```javascript
// Cache con ttl
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

async function getCachedProcessors() {
  if (cache.has('processors')) {
    return cache.get('processors')
  }
  
  const data = await db.query("SELECT * FROM procesadores")
  cache.set('processors', data.rows)
  
  setTimeout(() => cache.delete('processors'), CACHE_TTL)
  return data.rows
}
```

---

## Testing

### Test Unitario - Backend

```javascript
// tests/compatibilityService.test.js
describe('CompatibilityService', () => {
  it('should detect socket incompatibility', async () => {
    const result = await compatibilityService.validateSocket({
      cpuSocket: 'LGA1700',
      mbSocket: 'AM5'
    })
    expect(result.compatible).toBe(false)
  })
})
```

### Test de Integración - Frontend

```typescript
// tests/PcBuilder.test.tsx
describe('PcBuilder', () => {
  it('should add component to build', () => {
    const { getByText } = render(<PcBuilder />)
    fireEvent.click(getByText('Agregar'))
    expect(getByText('Componente agregado')).toBeInTheDocument()
  })
})
```

---

## Escalabilidad

### Actualidades

```
Usuarios: ~100 simultáneos
DB Queries: ~100-200/min
API Requests: ~50-100/min
Data Size: <100GB
```

### Para 1000+ usuarios simultáneos

```
1. Usar load balancer (Nginx)
2. Múltiples instancias de Node
3. Cache distribuido (Redis)
4. Database replication (Neon Pro)
5. CDN para assets (Cloudflare)
6. Message queue para procesos async (RabbitMQ)
```

---

## Monitoreo

### Health Check

```javascript
// GET /health
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date()
  })
})
```

### Logging

```javascript
// Cada request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Errores
app.use((err, req, res, next) => {
  console.error('ERROR:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})
```

---

## Decisiones de Arquitectura

### ¿Por qué Node.js + Express?
- ✅ JavaScript en frontend y backend (un lenguaje)
- ✅ Excelente para APIs REST
- ✅ Ecosistema npm maduro
- ✅ Fácil de aprender y mantener
- ✅ Escalable horizontalmente

### ¿Por qué PostgreSQL?
- ✅ Relaciones complejas (componentes, proyectos)
- ✅ ACID transactions
- ✅ Soporte JSON nativo
- ✅ Seguro y confiable
- ✅ Excelente con Neon

### ¿Por qué React Native + Expo?
- ✅ Escribir una vez, ejecutar en web/iOS/Android
- ✅ Excelente para desarrollo rápido
- ✅ Hot reload (desarrollo más rápido)
- ✅ Comunidad grande
- ✅ Soporte TypeScript

---

**Última actualización**: 2025-11-12  
**Versión**: 1.0
