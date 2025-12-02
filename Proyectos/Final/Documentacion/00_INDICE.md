
### Para Nuevos Desarrolladores
1. **[Inicio Rápido](01_INICIO_RAPIDO.md)** ← **COMIENZA AQUÍ**
   - Cómo instalar el proyecto
   - Estructura de carpetas
   - Primeros pasos para ejecutar localmente
   - Solución de problemas básicos

2. **[Guía de Arquitectura](07_GUIA_ARQUITECTURA.md)**
   - Visión general del proyecto
   - Cómo se comunican frontend, backend y BD
   - Patrones de diseño utilizados
   - Decisiones arquitectónicas

---

## 📚 Documentación Principal

### Backend

**[Manual Completo del Backend](02_MANUAL_BACKEND.md)**

Aprende a:
- Estructura de carpetas y componentes
- Todos los endpoints disponibles (20+)
- Controllers y Services
- Variables de entorno
- Ejemplos de requests/responses
- Autenticación
- Troubleshooting

**Secciones**:
- Descripción general
- Estructura de carpetas
- Endpoints documentados
- Controllers principales
- Services principales
- Variables de entorno
- Ejemplo de flujo de datos
- Ejemplos prácticos
- Guía de desarrollo
- Troubleshooting

---

### Frontend

**[Manual Completo del Frontend](03_MANUAL_FRONTEND.md)**

Aprende a:
- Estructura de componentes
- Pantallas principales (PcBuilder, Proyectos, Admin)
- Servicios y API
- Autenticación
- Hooks y tema
- Flujos de aplicación
- Debugging y testing

**Secciones**:
- Descripción general
- Estructura de carpetas
- Pantallas principales
- Servicios disponibles
- Autenticación y contexto
- Hooks personalizados
- Sistema de tema
- Flows principales
- Interfaces TypeScript
- Desarrollo y debugging

---

## 🔧 Guías Técnicas Específicas

### Sistema de Compatibilidad

**[Sistema Avanzado de Compatibilidad](04_SISTEMA_COMPATIBILIDAD.md)**

Todo sobre validación de hardware:
- 6 tipos de validación
- Fórmulas de cálculo
- Campos requeridos por componente
- Niveles de error
- Ejemplos de respuestas
- Futuros mejoras

**Validaciones incluidas**:
1. Socket (CPU vs Motherboard)
2. RAM (slots, capacidad, velocidad)
3. Almacenamiento (M.2, SATA, bahías)
4. Tarjeta Gráfica (dimensiones, conectores)
5. Formato (ATX, Micro-ATX, Mini-ITX)
6. Potencia (consumo calculado)

---

### Base de Datos

**[Documentación Completa de Base de Datos](05_BASE_DATOS.md)**

Aprende sobre:
- Esquema de 10 tablas
- Campos y tipos de datos
- Relaciones entre tablas
- Índices para optimización
- Constraints de integridad
- Queries útiles
- Best practices
- Backup y recuperación

**Tablas documentadas**:
- `usuarios`
- `procesadores`
- `motherboards`
- `memorias_ram`
- `tarjetas_graficas`
- `almacenamiento`
- `fuentes_poder`
- `gabinetes`
- `proyectos`
- `proyecto_componentes`

---

## 🌍 Despliegue

**[Guía Completa de Instalación y Despliegue](06_INSTALACION_DESPLIEGUE.md)**

Cubre:
- **Instalación Local** (5 pasos)
- **Despliegue en Vercel** (frontend + backend)
- **Despliegue en Render** (alternativa)
- **Database en Neon** (PostgreSQL cloud)
- **Dominios personalizados**
- **CI/CD con GitHub Actions**
- **Monitoreo y backup**
- **Troubleshooting de deployment**

**Plataformas cubiertas**:
- Vercel (recomendado)
- Render
- Neon (database)
- GitHub Actions (CI/CD)

---

## 📚 Referencia API

**[Referencia Completa de API](08_REFERENCIA_API.md)**

Documentación completa de todos los endpoints:

**Autenticación**:
- POST `/auth/register` - Registrar
- POST `/auth/login` - Login
- POST `/auth/google` - Google OAuth
- POST `/auth/logout` - Logout

**Componentes** (lectura):
- GET `/components/procesadores`
- GET `/components/motherboards`
- GET `/components/memorias`
- GET `/components/tarjetas-graficas`
- GET `/components/almacenamiento`
- GET `/components/fuentes-poder`
- GET `/components/gabinetes`

**Compatibilidad**:
- POST `/compatibility/check` - Validar todo
- POST `/compatibility/validate-socket`
- POST `/compatibility/validate-ram`
- POST `/compatibility/validate-power`
- POST `/compatibility/validate-storage`

**Proyectos**:
- GET `/projects` - Listar
- GET `/projects/:id` - Obtener uno
- POST `/projects` - Crear
- PUT `/projects/:id` - Actualizar
- DELETE `/projects/:id` - Eliminar
- POST `/projects/:id/componentes` - Agregar componente


## 📋 Resumen de Documentos

| Documento | Tipo | Audiencia | Tópicos |
|-----------|------|-----------|---------|
| **01_INICIO_RAPIDO.md** | Guía | Todos | Setup, estructura, primeros pasos |
| **02_MANUAL_BACKEND.md** | Manual | Backend devs | API, endpoints, services |
| **03_MANUAL_FRONTEND.md** | Manual | Frontend devs | UI, pantallas, componentes |
| **04_SISTEMA_COMPATIBILIDAD.md** | Especificación | Tech leads | Validaciones, reglas |
| **05_BASE_DATOS.md** | Referencia | Backend, DevOps | Tablas, esquema, queries |
| **06_INSTALACION_DESPLIEGUE.md** | Guía | DevOps, Backend | Deploy, CI/CD, hosting |
| **07_GUIA_ARQUITECTURA.md** | Arquitectura | Tech leads | Diseño, patrones |
| **08_REFERENCIA_API.md** | Referencia | Todos devs | Endpoints, ejemplos |
| **09_PREGUNTAS_FRECUENTES.md** | FAQ | Todos | Problemas comunes, soluciones |
| **10_RESUMEN_EJECUTIVO.md** | Resumen | Stakeholders | Visión general, stats |
| **11_GUIA_CONTRIBUCION.md** | Guía | Contribuidores | Cómo contribuir, estándares |
| **12_CHANGELOG.md** | Historial | Todos | Versiones, cambios, roadmap |
| **00_INDICE.md** | Navigation | Todos | Este documento |

---
