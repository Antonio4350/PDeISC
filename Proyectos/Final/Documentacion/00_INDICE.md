# 📖 Índice de Documentación

Bienvenido a la documentación completa del Proyecto Final ACV. Esta carpeta contiene toda la información necesaria para entender, desarrollar y desplegar la aplicación.

---

## 🚀 Comienza Aquí

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

## 🤝 Contribuir al Proyecto

**[Guía de Contribución](11_GUIA_CONTRIBUCION.md)**

Cómo contribuir:
- Proceso de contribución paso a paso
- Reportar bugs y solicitar features
- Estándares de código
- Testing
- Code review

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

---

## ❓ Preguntas Frecuentes

**[Preguntas Frecuentes y Solución de Problemas](09_PREGUNTAS_FRECUENTES.md)**

Secciones:
1. **Instalación y Configuración**
   - Requisitos del sistema
   - Configuración de variables de entorno
   - Usando base de datos existente

2. **Ejecución y Desarrollo**
   - Cómo iniciar desarrollo local
   - En qué puertos corre
   - Solución de problemas de inicio

3. **Frontend y UI**
   - Por qué no aparecen componentes
   - Cambiar tema
   - Validación de compatibilidad

4. **Autenticación**
   - Contraseña olvidada
   - Login con Google
   - Token inválido

5. **Proyectos y Componentes**
   - Límites técnicos
   - Editar/eliminar proyectos
   - Entender incompatibilidades

6. **Base de Datos**
   - Hacer backups
   - Agregar componentes
   - Limpiar datos de prueba

7. **Solución de Problemas**
   - ECONNREFUSED
   - CORS Error
   - Database Connection Refused
   - Module not found
   - Servidor lento
   - Validación no funciona
   - Login no funciona
   - Y más...

---

## 🎯 Guías por Rol

### Para Desarrolladores Frontend
1. [Inicio Rápido](01_INICIO_RAPIDO.md)
2. [Manual Frontend](03_MANUAL_FRONTEND.md)
3. [Referencia API](08_REFERENCIA_API.md)
4. [Preguntas Frecuentes](09_PREGUNTAS_FRECUENTES.md)

### Para Desarrolladores Backend
1. [Inicio Rápido](01_INICIO_RAPIDO.md)
2. [Manual Backend](02_MANUAL_BACKEND.md)
3. [Base de Datos](05_BASE_DATOS.md)
4. [Sistema de Compatibilidad](04_SISTEMA_COMPATIBILIDAD.md)
5. [Referencia API](08_REFERENCIA_API.md)

### Para DevOps / Infraestructura
1. [Guía de Despliegue](06_INSTALACION_DESPLIEGUE.md)
2. [Base de Datos](05_BASE_DATOS.md)
3. [Preguntas Frecuentes](09_PREGUNTAS_FRECUENTES.md)

### Para Arquitectos / Tech Leads
1. [Guía de Arquitectura](07_GUIA_ARQUITECTURA.md)
2. [Sistema de Compatibilidad](04_SISTEMA_COMPATIBILIDAD.md)
3. [Base de Datos](05_BASE_DATOS.md)
4. [Guía de Despliegue](06_INSTALACION_DESPLIEGUE.md)

### Para Product Managers / Stakeholders
1. [Inicio Rápido](01_INICIO_RAPIDO.md) - Para entender la estructura
2. [Manual Frontend](03_MANUAL_FRONTEND.md) - Para ver funcionalidades
3. [Sistema de Compatibilidad](04_SISTEMA_COMPATIBILIDAD.md) - Para entender features
4. [Resumen Ejecutivo](10_RESUMEN_EJECUTIVO.md) - Visión general

---

## 📋 Historial de Cambios

**[Changelog y Versiones](12_CHANGELOG.md)**

Historial completo:
- Versión 1.0.0 (Lanzamiento inicial)
- Features completadas
- Roadmap futuro
- Notas de lanzamiento

---

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

## 🔍 Búsqueda Rápida

### "¿Cómo...?"

**...instalo el proyecto?**
→ [Inicio Rápido - Instalación](01_INICIO_RAPIDO.md#instalación)

**...creo un endpoint en el backend?**
→ [Manual Backend - Crear endpoint](02_MANUAL_BACKEND.md#crear-nuevo-endpoint)

**...valido componentes?**
→ [Sistema Compatibilidad](04_SISTEMA_COMPATIBILIDAD.md)

**...despliego en producción?**
→ [Guía Despliegue](06_INSTALACION_DESPLIEGUE.md)

**...debugueo un problema?**
→ [Preguntas Frecuentes](09_PREGUNTAS_FRECUENTES.md#debugging-avanzado)

---

## 📞 Información de Contacto

Para preguntas o problemas:

1. **Revisa las FAQ** - [Preguntas Frecuentes](09_PREGUNTAS_FRECUENTES.md)
2. **Busca en GitHub Issues** del repositorio
3. **Contacta al equipo de desarrollo**

---

## 📈 Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-01-15 | 1.0 | Documentación inicial en español |
| 2025-01-16 | 1.1 | Agregadas guías de arquitectura y FAQ |

---

## ✅ Checklist: Primeras Cosas a Hacer

Para nuevos desarrolladores:

- [ ] Leer [Inicio Rápido](01_INICIO_RAPIDO.md)
- [ ] Clonar el repositorio
- [ ] Instalar dependencias
- [ ] Configurar `.env`
- [ ] Ejecutar en local
- [ ] Leer [Guía Arquitectura](07_GUIA_ARQUITECTURA.md)
- [ ] Explorar el código
- [ ] Ejecutar un primer cambio
- [ ] Leer el manual de tu especialidad (Frontend/Backend)
- [ ] Guardar [Referencia API](08_REFERENCIA_API.md) como favorito

---

## 🎓 Recursos Externos

### Tecnologías Principales

- **Node.js**: https://nodejs.org/docs/
- **Express.js**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **React Native**: https://reactnative.dev/docs/
- **Expo**: https://docs.expo.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/

### Plataformas de Despliegue

- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **Neon**: https://neon.tech/docs
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Última actualización**: 2025-01-15  
**Versión**: 1.0  
**Estado**: ✅ Completa

---

¿Necesitas ayuda? Comienza por el [Inicio Rápido](01_INICIO_RAPIDO.md) → 🚀
