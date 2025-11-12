# 📊 Resumen Ejecutivo del Proyecto

## Visión General

**Proyecto Final ACV** es una aplicación web/móvil completa para la construcción y validación de computadoras personalizadas (PC Builders). Permite a usuarios crear proyectos de builds, seleccionar componentes hardware compatibles y validar la compatibilidad antes de comprar.

---

## Características Principales

### 1. Constructor de PCs Interactivo
- Seleccionar componentes de un catálogo extenso
- Ver compatibilidad en tiempo real
- Guardar múltiples proyectos
- Comparar diferentes configuraciones

### 2. Sistema Avanzado de Validación
- 6 tipos de validación automática:
  - Socket CPU ↔ Motherboard
  - Compatibilidad RAM (slots, velocidad, tipo)
  - Almacenamiento (M.2, SATA, bahías)
  - Tarjeta Gráfica (dimensiones, conectores)
  - Formato del gabinete (ATX, Micro-ATX, Mini-ITX)
  - Potencia (cálculo automático con margen de seguridad)

### 3. Base de Datos Completa
- 1000+ componentes hardware reales
- Información detallada por categoría
- Especificaciones técnicas actualizadas

### 4. Gestión de Proyectos
- Crear, editar, eliminar builds
- Compartir proyectos
- Presupuesto estimado
- Historial de cambios

### 5. Panel de Administración
- Gestionar componentes
- Agregar/editar especificaciones
- Monitoreo de usuarios
- Control de acceso

### 6. Autenticación Segura
- Login/Registro tradicional
- Integración Google OAuth
- JWT tokens
- Perfiles de usuario

---

## Estadísticas Técnicas

| Métrica | Valor |
|---------|-------|
| **Líneas de código** | 8,000+ |
| **Componentes de React** | 12+ |
| **Endpoints API** | 25+ |
| **Tablas de BD** | 10 |
| **Campos de BD** | 100+ |
| **Funciones de validación** | 6 |
| **Documentos de documentación** | 10 |
| **Líneas de documentación** | 3,500+ |

---

## Stack Tecnológico

### Frontend
```
React Native + Expo + TypeScript
├── UI Framework: React Native
├── State Management: React Context + Hooks
├── HTTP Client: Axios
├── Styling: React Native built-in
├── Navigation: Expo Router
└── Icons: Expo Icons
```

### Backend
```
Node.js + Express.js
├── Runtime: Node.js 22.21.0
├── Framework: Express.js
├── Auth: JWT + Google OAuth
├── Database: PostgreSQL
├── Validation: Custom middleware
└── Error Handling: Try-catch + middleware
```

### Base de Datos
```
PostgreSQL (Neon)
├── Tablas: 10
├── Relaciones: 15+
├── Índices: 6+
├── Views: 2+
└── Constraints: 4+
```

### Infraestructura
```
Vercel (Frontend + Backend)
├── Frontend: https://proyecto-final-acv.vercel.app
├── Backend: Serverless Functions
├── Database: Neon PostgreSQL
├── CI/CD: GitHub Actions
└── Monitoreo: Vercel Analytics
```

---

## Flujos Principales

### Flujo 1: Construir una PC

```
1. Usuario inicia sesión
2. Va a "Constructor de PC"
3. Selecciona componentes (CPU, MB, RAM, GPU, etc.)
4. Sistema valida compatibilidad en tiempo real
5. Usuario ve errores/advertencias
6. Ajusta componentes según sugerencias
7. Cuando está compatible, guarda el proyecto
8. Proyecto se almacena en su cuenta
```

### Flujo 2: Gestionar Proyectos

```
1. Usuario va a "Mis Proyectos"
2. Ve lista de builds guardados
3. Puede:
   - Editar un proyecto existente
   - Duplicar para crear variante
   - Eliminar proyecto
   - Ver detalles y presupuesto
```

### Flujo 3: Administración (Solo Admin)

```
1. Admin accede a "Panel de Administración"
2. Puede:
   - Ver todos los usuarios
   - Agregar nuevos componentes
   - Editar especificaciones
   - Eliminar componentes obsoletos
   - Monitorear actividad
```

---

## Capas de la Aplicación

### Capa de Presentación (Frontend)
- **Tecnología**: React Native + Expo + TypeScript
- **Responsabilidad**: Interfaz de usuario, UX
- **Componentes**: 12+ screens, 20+ componentes
- **Estado**: AuthContext, hooks personalizados

### Capa de Negocio (Backend)
- **Tecnología**: Node.js + Express.js
- **Responsabilidad**: Lógica, validación, autorización
- **Estructura**: Controllers + Services + Helpers
- **Endpoints**: 25+ rutas REST

### Capa de Datos (Database)
- **Tecnología**: PostgreSQL + Neon
- **Responsabilidad**: Persistencia, integridad
- **Tablas**: 10 principales + vistas
- **Relaciones**: 15+ foreign keys

---

## Componentes Principales

### Backend (`/Server`)

```
Server/
├── Controllers/ (7 archivos)
│   ├── authController.js - Autenticación
│   ├── componentController.js - CRUD componentes
│   ├── compatibilityController.js - Validaciones
│   ├── projectController.js - Gestión proyectos
│   ├── propertyController.js - Propiedades
│   └── userService.js - Usuarios
│
├── Services/ (7 archivos)
│   ├── componentService.js - Lógica componentes
│   ├── compatibilityService.js - Lógica validación
│   ├── projectService.js - Lógica proyectos
│   └── ...
│
├── Helpers/
│   ├── database.js - Conexión PostgreSQL
│   ├── GoogleAuth.js - Autenticación Google
│   └── startupMonitor.js - Monitoreo
│
└── server.js - Punto de entrada (Express app)
```

### Frontend (`/ProyectoFinalACV`)

```
ProyectoFinalACV/
├── app/
│   ├── (tabs)/ - Pantallas principales
│   │   ├── PcBuilder.tsx - Constructor
│   │   ├── Projects.tsx - Proyectos
│   │   ├── AdminPanel.tsx - Admin
│   │   ├── ComponentsCatalog.tsx - Catálogo
│   │   └── ...
│   ├── AuthContext.tsx - Contexto autenticación
│   └── _layout.tsx - Router
│
├── services/
│   ├── api.ts - Configuración API
│   ├── components.ts - Servicio componentes
│   ├── advancedCompatibility.ts - Validación
│   └── projectService.js - Servicio proyectos
│
├── components/
│   ├── HamburgerMenu.tsx
│   └── GoogleOAuth.tsx
│
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
└── constants/
    └── theme.ts - Tema global
```

---

## Base de Datos

### Tablas Principales

| Tabla | Propósito | Registros |
|-------|-----------|-----------|
| `usuarios` | Cuentas de usuario | ~100 |
| `procesadores` | CPUs Intel/AMD | ~150 |
| `motherboards` | Placas base | ~120 |
| `memorias_ram` | Módulos RAM | ~200 |
| `tarjetas_graficas` | GPUs NVIDIA/AMD | ~80 |
| `almacenamiento` | SSDs/HDDs | ~150 |
| `fuentes_poder` | PSUs | ~100 |
| `gabinetes` | PC Cases | ~80 |
| `proyectos` | Builds guardados | ~500 |
| `proyecto_componentes` | Relación multi | ~2000 |

**Total de registros**: ~1500+ componentes disponibles

---

## Validaciones Implementadas

### 1. Socket
```
Valida que CPU socket = MB socket
Ejemplos:
- CPU: LGA1700 ✓ MB: LGA1700 → Compatible
- CPU: LGA1700 ✗ MB: AM5 → Incompatible
```

### 2. RAM
```
Valida tipo, velocidad y cantidad
Ejemplos:
- MB soporta DDR5-6000, 4 slots
- RAM1: 32GB DDR5-6000 ✓
- RAM2: 32GB DDR5-6000 ✓
- RAM3: 16GB DDR4 ✗ → Error: tipo incorrecto
```

### 3. Almacenamiento
```
Valida disponibilidad de bahías
Ejemplos:
- MB tiene 2x M.2 NVMe
- SSD1: Samsung 980 Pro (M.2) ✓
- SSD2: WD SN850X (M.2) ✓
- HDD: WD Red (3.5") ✓
```

### 4. Tarjeta Gráfica
```
Valida dimensiones y conectores
Ejemplos:
- Case soporta GPU hasta 300mm
- RTX 4070 Ti: 320mm ✗ → Error: muy larga
- RTX 4070: 243mm ✓
```

### 5. Formato
```
Valida MB fits in case
Ejemplos:
- Case: ATX
- MB: ATX ✓
- MB: Micro-ATX ✓
- MB: Mini-ITX ✓
```

### 6. Potencia
```
Fórmula: (CPU_TDP + GPU_W + RAM*0.5 + Storage*5 + 50) × 1.25
Ejemplo:
- CPU (i7-13700K): 125W
- GPU (RTX 4070): 192W
- RAM (64GB): 32W
- Storage (2x SSD): 10W
- Otros: 50W
- Subtotal: 409W × 1.25 = 511W mínimo
- Recomendación: PSU 650W+
```

---

## API REST

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Login
- `POST /auth/google` - Google OAuth
- `POST /auth/logout` - Logout

### Componentes
- `GET /components/[tipo]` - Obtener por categoría
- `GET /components/[tipo]?filtros` - Con filtros
- `GET /components/[id]` - Detalle específico

### Validación
- `POST /compatibility/check` - Validar todo
- `POST /compatibility/validate-socket`
- `POST /compatibility/validate-ram`
- `POST /compatibility/validate-power`
- `POST /compatibility/validate-storage`
- `POST /compatibility/validate-format`

### Proyectos
- `GET /projects` - Listar
- `GET /projects/:id` - Detalle
- `POST /projects` - Crear
- `PUT /projects/:id` - Actualizar
- `DELETE /projects/:id` - Eliminar
- `POST /projects/:id/componentes` - Agregar componente

### Propiedades
- `GET /properties` - Todas
- `GET /properties/:tipo` - Específicas

---

## Seguridad

### Autenticación
- JWT tokens con expiración
- Google OAuth 2.0
- Hash de contraseñas

### Autorización
- Middlewares de verificación
- Roles de usuario (User, Admin)
- Validación de propiedad de recursos

### Validación
- Input validation en backend
- SQL injection prevention (parameterized queries)
- CORS configurado
- Rate limiting (configurable)

### Base de Datos
- ACID transactions
- Foreign keys constraints
- Índices para seguridad y performance
- Backups automáticos en Neon

---

## Despliegue

### Desarrollo Local
```bash
# Terminal 1: Backend
cd Server && npm start

# Terminal 2: Frontend
cd ProyectoFinalACV && npm start

# Terminal 3: Base de datos (si es local)
psql -U postgres -d antoniopcbuilder
```

### Producción
```
Frontend: Vercel
├── URL: https://proyecto-final-acv.vercel.app
├── Build: npm run build
├── Deploy: Automático desde GitHub
└── Env: REACT_APP_API_URL=https://api-tu-dominio.com

Backend: Vercel Serverless
├── URL: https://api-tu-dominio.com
├── Deploy: Automático desde GitHub
└── Runtime: Node.js

Database: Neon PostgreSQL
├── Cloud: neon.tech
├── Backups: Automáticos diarios
└── Failover: Configurado
```

---

## Roadmap Futuro

### Corto Plazo (1-2 meses)
- [ ] Exportar build a PDF
- [ ] Compartir links de proyectos
- [ ] Wishlist pública
- [ ] Búsqueda avanzada de componentes

### Mediano Plazo (3-6 meses)
- [ ] Precios de retailers en tiempo real
- [ ] Notificaciones de precio
- [ ] Recomendaciones basadas en IA
- [ ] Mobile app nativa (iOS/Android)

### Largo Plazo (6-12 meses)
- [ ] Marketplace de vendedores
- [ ] Integración con tiendas
- [ ] Configurador 3D
- [ ] Comunidad y reviews

---

## Métricas de Éxito

### Adopción
- [ ] 1000+ usuarios registrados
- [ ] 500+ builds creados
- [ ] 100+ builds compartidos

### Engagement
- [ ] 70%+ tasa de retención semanal
- [ ] Promedio 3+ proyectos por usuario
- [ ] 50%+ uso del panel de admin

### Técnico
- [ ] 99.9% uptime
- [ ] <500ms response time
- [ ] <1% error rate
- [ ] 0 security incidents

---

## Equipo de Desarrollo

### Roles
- **Full Stack Developer**: Implementación
- **DevOps**: Infraestructura y despliegue
- **QA**: Testing y calidad
- **Product Manager**: Visión y features

### Responsabilidades
- Desarrollo según especificaciones
- Code review
- Testing (unitario, integración, E2E)
- Deployment y monitoreo
- Documentación (ACTUALIZADA)

---

## Costo Operativo Estimado

| Servicio | Costo Mensual | Anual |
|----------|---------------|----|
| Neon PostgreSQL | $150 | $1,800 |
| Vercel (Pro) | $20 | $240 |
| GitHub Pro (opcional) | $4 | $48 |
| Dominio | $12 | $144 |
| SSL Certificate | $0 | $0 |
| **Total** | **$186** | **$2,232** |

*Nota: Los primeros 12 meses pueden tener costos adicionales de desarrollo*

---

## Próximos Pasos

1. **Revisar Documentación**
   - Lee el [Índice](00_INDICE.md) para navegar todos los docs

2. **Configurar Ambiente**
   - Sigue el [Inicio Rápido](01_INICIO_RAPIDO.md)

3. **Entender Arquitectura**
   - Lee la [Guía de Arquitectura](07_GUIA_ARQUITECTURA.md)

4. **Desarrollar**
   - Según tu especialidad: [Frontend](03_MANUAL_FRONTEND.md) o [Backend](02_MANUAL_BACKEND.md)

5. **Desplegar**
   - Sigue la [Guía de Despliegue](06_INSTALACION_DESPLIEGUE.md)

---

## Contacto y Soporte

- **Documentación**: Carpeta `Documentacion/`
- **Issues**: GitHub repository
- **Preguntas**: Ver [FAQ](09_PREGUNTAS_FRECUENTES.md)

---

**Última actualización**: 2025-01-15  
**Versión**: 1.0  
**Estado**: ✅ En Desarrollo Activo

---

**Para empezar**: Ve al [Índice de Documentación](00_INDICE.md) 📖
