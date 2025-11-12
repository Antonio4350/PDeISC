# Proyecto Final ACV - PC Builder

**Una aplicación moderna para construir y validar computadoras personalizadas**

## ⚠️ IMPORTANTE: Cómo Usar PC Builder

**El PC Builder AHORA carga TODOS los componentes sin restricciones:**

1. ✅ Se cargan TODOS los procesadores, motherboards, RAM, GPUs, etc.
2. ✅ Puedes seleccionar CUALQUIER componente (sin filtros previos)
3. ✅ La validación de compatibilidad ocurre DESPUÉS de seleccionar
4. ✅ Ves los problemas de compatibilidad en la UI (⚠️ rojo = incompatible, ✅ verde = compatible)
5. ✅ Puedes cambiar componentes hasta que funcione todo junto

## 📖 Documentación

**TODA LA DOCUMENTACIÓN ESTÁ EN LA CARPETA `Documentacion/`**

Para empezar, dirígete a:
```
👉 Documentacion/00_INDICE.md
```

Este archivo te guiará a través de toda la documentación según tu rol.

## 🔄 Flujo Correcto de PC Builder

### Paso 1: Selecciona Componentes
1. Haz clic en una categoría (Procesadores, Motherboards, RAM, etc.)
2. Se cargan TODOS los componentes disponibles
3. Selecciona el que quieras (sin restricciones)

### Paso 2: Sistema Valida Automáticamente
El sistema automáticamente valida:
- ✅ **Socket**: CPU socket = MB socket
- ✅ **RAM**: Tipo y velocidad compatible
- ✅ **Almacenamiento**: Bahías y interfaces disponibles
- ✅ **GPU**: Espacio en gabinete
- ✅ **Formato**: MB cabe en gabinete
- ✅ **Potencia**: PSU suficiente para todo

### Paso 3: Ve Resultados
- 🟢 Verde = Componente compatible
- 🔴 Rojo = Problema de compatibilidad (ej: socket no coincide)
- Cambia componentes hasta que todo esté verde

### Paso 4: Guarda tu Build
Cuando todos los componentes sean compatibles (o aunque haya warnings), haz clic en "Guardar Build"

## ⚙️ Requisitos

- Node.js 18+
- PostgreSQL o Neon (BD en la nube)
- Expo CLI para desarrollo

## 🚀 Inicio Rápido

### Backend
```bash
cd Server
npm install
npm start  # Inicia en puerto 5000
```

### Frontend
```bash
cd ProyectoFinalACV
npm install
npx expo start  # Abre en navegador o Expo Go
```

### Base de Datos
```bash
# Si usas local
createdb antoniopcbuilder
psql -U postgres -d antoniopcbuilder -f antoniopcbuilder.sql

# Si usas Neon
# Configura DATABASE_URL en Server/.env
```

## 📚 Stack Técnico

- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon)
- **Auth**: JWT + Google OAuth
- **API**: REST con 25+ endpoints

## 📋 Contenido de Documentación

| Documento | Para Quién |
|-----------|-----------|
| **00_INDICE.md** | Todos (comienza aquí) |
| **01_INICIO_RAPIDO.md** | Nuevos desarrolladores |
| **02_MANUAL_BACKEND.md** | Devs Backend |
| **03_MANUAL_FRONTEND.md** | Devs Frontend |
| **04_SISTEMA_COMPATIBILIDAD.md** | Todos (entiende la validación) |
| **05_BASE_DATOS.md** | Devs Backend / DBA |
| **06_INSTALACION_DESPLIEGUE.md** | DevOps |
| **07_GUIA_ARQUITECTURA.md** | Tech Leads |
| **08_REFERENCIA_API.md** | Devs (referencia técnica) |
| **09_PREGUNTAS_FRECUENTES.md** | Todos (troubleshooting) |
| **10_RESUMEN_EJECUTIVO.md** | Stakeholders |
| **11_GUIA_CONTRIBUCION.md** | Contribuidores |
| **12_CHANGELOG.md** | Todos (historial) |

## ✨ Características

✅ Constructor de PCs interactivo  
✅ Validación automática de compatibilidad (6 tipos)  
✅ 1000+ componentes hardware  
✅ Gestión completa de proyectos  
✅ Panel de administración  
✅ Autenticación segura (JWT + Google OAuth)  
✅ API REST completa  
✅ Documentación en español  

## 🆘 Ayuda

### Problemas al usar PC Builder
→ Ver: `Documentacion/09_PREGUNTAS_FRECUENTES.md` → "Flujo PC Builder"

### Problemas técnicos
→ Ver: `Documentacion/09_PREGUNTAS_FRECUENTES.md` → "Solución de Problemas"

### Cómo funciona la compatibilidad
→ Ver: `Documentacion/04_SISTEMA_COMPATIBILIDAD.md`

### Referencias de API
→ Ver: `Documentacion/08_REFERENCIA_API.md`

## 📞 Contacto

Preguntas o problemas:
1. Revisa `Documentacion/09_PREGUNTAS_FRECUENTES.md`
2. Busca en el `Documentacion/00_INDICE.md`
3. Abre un Issue en GitHub

## 📄 Licencia

[Tu licencia aquí]

---

**Última actualización**: 2025-01-15  
**Versión**: 1.0  
**Estado**: ✅ Funcional y Documentado

---

### 👉 **¡COMIENZA AQUÍ!** → `Documentacion/00_INDICE.md`
