# 🎨 Manual del Frontend

## Descripción General

El frontend es una aplicación mobile construida con React Native y Expo. Proporciona una interfaz moderna para construir PCs con validación de compatibilidad en tiempo real.

**Framework**: React Native + Expo  
**Lenguaje**: TypeScript  
**Plataforma**: Web, iOS, Android

---

## Estructura del Proyecto

```
ProyectoFinalACV/
├── app/
│   ├── (tabs)/                    - Pantallas principales
│   │   ├── _layout.tsx            - Navegación
│   │   ├── index.tsx              - Inicio
│   │   ├── PcBuilder.tsx          - Constructor de PCs
│   │   ├── ComponentsCatalog.tsx  - Catálogo de componentes
│   │   ├── Projects.tsx           - Mis proyectos
│   │   ├── AdminPanel.tsx         - Panel de administración
│   │   ├── EditComponent.tsx      - Editar componente
│   │   ├── ManageProperties.tsx   - Gestionar propiedades
│   │   ├── Login.tsx              - Inicio de sesión
│   │   └── Register.tsx           - Registro
│   ├── components/
│   │   ├── HamburgerMenu.tsx      - Menú lateral
│   │   └── GoogleOAuth.tsx        - Login con Google
│   ├── services/
│   │   ├── components.ts          - API de componentes
│   │   ├── advancedCompatibility.ts - Validación avanzada
│   │   ├── projectService.js      - API de proyectos
│   │   └── api.ts                 - Cliente HTTP base
│   ├── config/
│   │   └── apiConfig.ts           - Configuración de API
│   ├── hooks/
│   │   ├── use-color-scheme.ts    - Hook de tema
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme-color.ts
│   ├── utils/
│   │   └── toast.ts               - Notificaciones
│   ├── constants/
│   │   └── theme.ts               - Tema de la app
│   ├── AuthContext.tsx            - Contexto de autenticación
│   └── _layout.tsx                - Layout raíz
├── assets/
│   └── images/
├── package.json
├── tsconfig.json
├── expo-env.d.ts
├── eslint.config.js
├── app.json
├── eas.json
└── README.md
```

---

## Pantallas Principales

### PcBuilder (Constructor de PCs)

Pantalla principal donde los usuarios construyen sus PCs.

**Funcionalidades**:
- 📝 Seleccionar componentes
- ✅ Validación automática de compatibilidad
- 📊 Ver incompatibilidades
- 💾 Guardar proyectos
- 🔄 Múltiples RAMs y almacenamiento

**Archivo**: `app/(tabs)/PcBuilder.tsx`

```typescript
interface BuildComponent {
  id: string;
  type: string;
  name: string;
  component: Component | null;
  components: Component[];        // Múltiples
  compatible: boolean;
  compatibilityIssues: string[];
  warnings: string[];
}
```

### ComponentsCatalog (Catálogo)

Muestra todos los componentes disponibles organizados por categoría.

**Categorías**:
- Procesadores
- Motherboards
- Memoria RAM
- Tarjetas Gráficas
- Almacenamiento
- Fuentes de Poder
- Gabinetes

### Projects (Mis Proyectos)

Gestiona los proyectos guardados del usuario.

**Funcionalidades**:
- 📋 Listar proyectos
- ✏️ Editar proyectos
- 🗑️ Eliminar proyectos
- 📤 Exportar proyectos

### AdminPanel (Panel Admin)

Interfaz de administración para gestionar componentes.

**Funcionalidades**:
- ➕ Agregar componentes
- ✏️ Editar componentes
- 🗑️ Eliminar componentes
- 📊 Ver estadísticas

---

## Servicios

### components.ts

Cliente para la API de componentes.

```typescript
// Obtener componentes
async getProcessors(): Promise<ApiResponse<Procesador[]>>
async getMotherboards(): Promise<ApiResponse<Motherboard[]>>
async getRAM(): Promise<ApiResponse<RAM[]>>
async getGPUs(): Promise<ApiResponse<GPU[]>>
async getStorage(): Promise<ApiResponse<Almacenamiento[]>>
async getPSUs(): Promise<ApiResponse<FuentePoder[]>>
async getCases(): Promise<ApiResponse<Gabinete[]>>

// CRUD
async createComponent(type, data): Promise<ApiResponse<Component>>
async updateComponent(type, id, data): Promise<ApiResponse<Component>>
async deleteComponent(type, id): Promise<ApiResponse<void>>
```

### advancedCompatibility.ts

Validador de compatibilidad avanzada.

```typescript
// Validaciones
async validateSocketCompatibility(cpuId, motherboardId)
async validateRAMCompatibility(ramIds, motherboardId)
async validateStorageCompatibility(storageIds, motherboardId, caseId)
async validateGPUCompatibility(gpuId, motherboardId, caseId)
async validateFormatCompatibility(motherboardId, caseId)
async validatePowerSupply(cpuId, psuId, gpuId, ramIds, storageIds)
async validateCompleteBuild(buildData)

// Helpers
getSummaryInSpanish(validation): string
```

### projectService.js

Gestión de proyectos del usuario.

```javascript
// CRUD
async getProjects(userId)
async getProject(projectId)
async createProject(projectData)
async updateProject(projectId, projectData)
async deleteProject(projectId)

// Otros
async duplicateProject(projectId)
async exportProject(projectId)
```

---

## Configuración de API

### apiConfig.ts

Detecta automáticamente el ambiente y configura la URL de API.

```typescript
// Detección automática:
// 1. localhost (desarrollo)
// 2. LAN IP (desarrollo en red)
// 3. URL de producción

const apiUrl = detectEnvironment()
```

**Variables de entorno**:
```bash
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_PRODUCTION_API_URL=https://tu-api.com
```

---

## Autenticación

### AuthContext.tsx

Gestiona el estado de autenticación global.

```typescript
interface User {
  id: number
  email: string
  nombre: string
  token: string
}

// Métodos
login(email, password)
register(email, password, nombre)
logout()
loginWithGoogle(token)
```

### Flujo de Autenticación

```
Usuario accede
    ↓
¿Autenticado? NO
    ↓
Mostrar Login/Register
    ↓
Usuario ingresa credenciales
    ↓
API valida
    ↓
Guardar token en storage
    ↓
Redirigir a aplicación
```

---

## Componentes Reutilizables

### HamburgerMenu

Menú lateral con navegación principal.

```typescript
<HamburgerMenu
  user={user}
  onLogout={handleLogout}
  onNavigate={handleNavigation}
/>
```

### GoogleOAuth

Botón de login con Google.

```typescript
<GoogleOAuth onSuccess={handleGoogleLogin} />
```

---

## Hooks Personalizados

### use-color-scheme

Gestiona el tema (claro/oscuro).

```typescript
const { colorScheme, isDark } = useColorScheme()
```

### use-theme-color

Obtiene colores del tema actual.

```typescript
const color = useThemeColor('primary')
```

---

## Tema y Estilos

### constants/theme.ts

Definición centralizada de colores y estilos.

```typescript
export const theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F7DC6F',
    ...
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    ...
  }
}
```

---

## Flujos Principales

### Flujo de Constructor de PC

```
Usuario abre PcBuilder
    ↓
Categorías de componentes se cargan
    ↓
Usuario selecciona categoría
    ↓
Lista de componentes se muestra
    ↓
Usuario selecciona componente
    ↓
Componente se agrega a build
    ↓
Sistema valida compatibilidad
    ↓
Mostrar resultados (✅ OK o ❌ Problema)
    ↓
Usuario puede guardar build
```

### Flujo de Validación

```
Componente agregado
    ↓
checkAllCompatibility() se ejecuta
    ↓
Llama a multiple endpoints:
  - /compatibility/socket
  - /compatibility/ram
  - /compatibility/storage
  - /compatibility/gpu
  - /compatibility/power
    ↓
Actualiza estado de build
    ↓
Renderiza Issues y Warnings
```

---

## TypeScript Interfaces

### Component
```typescript
interface Component {
  id: number
  marca: string
  modelo: string
  tipo: string
  especificaciones: string
  socket?: string
  tipo_memoria?: string
  imagen_url?: string
  [key: string]: any
}
```

### CompatibilityResult
```typescript
interface CompatibilityResult {
  compatible: boolean
  issues: string[]
  warnings?: string[]
}
```

### BuildValidationResult
```typescript
interface BuildValidationResult {
  compatible: boolean
  validations: { [key: string]: any }
  issues: string[]
  warnings: string[]
  summary: {
    critical: number
    warnings: number
    totalChecks: number
    passedChecks: number
  }
}
```

---

## Notificaciones

### toast.ts

Sistema de notificaciones tipo toast.

```typescript
toast.success("Componente agregado")
toast.error("Error: socket incompatible")
toast.info("Información importante")
toast.warning("Advertencia: PSU justa")
```

---

## Desarrollo

### Agregar nueva pantalla

1. Crear archivo en `app/(tabs)/`:
```typescript
export default function MiPantalla() {
  return (
    <View>
      {/* Tu contenido */}
    </View>
  )
}
```

2. Agregar a navegación en `_layout.tsx`

### Agregar nuevo servicio

1. Crear archivo en `app/services/`:
```typescript
import { API_URL } from '../config/apiConfig'

export const miServicio = {
  async miMetodo(param) {
    const response = await fetch(`${API_URL}/mi-ruta`)
    return response.json()
  }
}
```

2. Importar en componentes:
```typescript
import { miServicio } from '../services/miServicio'
```

---

## Debugging

### Consola del Navegador
```
F12 → Console tab
Ver logs, errores, y network requests
```

### Red (Network tab)
```
Ver todas las solicitudes de API
Verificar responses
Comprobar headers
```

### Storage (Storage tab)
```
Ver tokens guardados
Comprobar variables locales
```

---

## Performance

### Optimizaciones Implementadas
- ✅ Lazy loading de componentes
- ✅ Caché de API responses
- ✅ Validación async (no bloquea UI)
- ✅ Renderizado condicional

### Mejores Prácticas
- Usar `React.memo()` para componentes costosos
- Implementar paginación para listas largas
- Caché de resultados de validación
- Debounce para búsquedas

---

## Testing

### Casos de prueba recomendados

**PcBuilder:**
- [ ] Agregar CPU
- [ ] Agregar Motherboard compatible
- [ ] Agregar Motherboard incompatible (error)
- [ ] Agregar múltiples RAMs
- [ ] Validaciones aparecen

**Autenticación:**
- [ ] Login exitoso
- [ ] Login fallido
- [ ] Registro exitoso
- [ ] Logout

**Compatibilidad:**
- [ ] Socket mismatch
- [ ] RAMs exceden slots
- [ ] Potencia insuficiente

---

**Última actualización**: 2025-11-12  
**Versión**: 1.0
