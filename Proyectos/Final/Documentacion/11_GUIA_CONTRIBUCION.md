# 🤝 Guía de Contribución

Bienvenido al proyecto Proyecto Final ACV. Esta guía te ayudará a contribuir de forma efectiva.

---

## 📋 Antes de Empezar

1. **Lee la documentación**
   - [Índice de Documentación](00_INDICE.md)
   - [Inicio Rápido](01_INICIO_RAPIDO.md)
   - [Guía de Arquitectura](07_GUIA_ARQUITECTURA.md)

2. **Configura tu ambiente**
   - Sigue [Inicio Rápido - Instalación](01_INICIO_RAPIDO.md#instalación)
   - Verifica que todo funciona localmente

3. **Entiende el proyecto**
   - Lee el manual de tu especialidad (Frontend/Backend)
   - Revisa la arquitectura

---

## 🔍 Proceso de Contribución

### 1. Identifica lo que quieres hacer

**Opciones**:
- Corregir un bug (abre un Issue)
- Agregar una feature (discute primero)
- Mejorar documentación (bienvenido)
- Refactorizar código (consulta primero)

### 2. Crea una rama

```bash
# Actualiza main
git checkout main
git pull origin main

# Crea rama con nombre descriptivo
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/nombre-descriptivo
# o
git checkout -b docs/nombre-descriptivo
```

**Convención de nombres**:
- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización
- `test/` - Tests nuevos

### 3. Realiza cambios

**Directorio**:
- Frontend: `ProyectoFinalACV/`
- Backend: `Server/`

**Estilo de código**:
- Usa nombres descriptivos
- Comenta código complejo
- Sigue las convenciones del proyecto

### 4. Prueba tus cambios

```bash
# Frontend
cd ProyectoFinalACV
npm test
npm start  # Ver en navegador

# Backend
cd Server
npm test
npm start  # Probar endpoints
```

### 5. Commit y Push

```bash
# Commit con mensaje descriptivo
git add .
git commit -m "feat: describir qué hace"
git commit -m "fix: describir qué se corrigió"
git commit -m "docs: describir cambios de docs"

# Push
git push origin feature/nombre-descriptivo
```

**Formato de commit**:
```
<tipo>(<scope>): <descripción corta>

<descripción detallada opcional>

<referencias a issues>
```

Ejemplos:
```
feat(compatibility): agregar validación de GPU

Implementa validación de dimensiones de GPU contra gabinete.

Fixes #123
```

### 6. Abre un Pull Request

1. Ve a GitHub
2. Haz clic en "New Pull Request"
3. Selecciona:
   - Base: `main`
   - Compare: tu rama
4. Completa el template

**En tu PR**:
- Describe qué cambios haces
- Por qué son necesarios
- Cómo probaste
- Si hay breaking changes

### 7. Code Review

El equipo revisará tu código:
- ✅ Aprobado → Se mergeará
- 💬 Cambios solicitados → Actualiza
- ❌ Rechazado → Discute

### 8. Merge

Una vez aprobado, se mergeará a `main`.

---

## 📝 Guías de Contribución por Tipo

### 🐛 Reportar un Bug

**Crea un Issue con**:
1. **Título claro**: "El sistema dice que RAM es incompatible cuando no"
2. **Descripción**: Qué pasó vs qué debería pasar
3. **Pasos para reproducir**: 
   - Login como usuario
   - Ir a PcBuilder
   - Seleccionar MB Z790 + RAM DDR5 compatible
   - Ver error incorrecto
4. **Entorno**: OS, navegador, versión
5. **Logs**: Captura de consola del error

**Ejemplo**:
```markdown
# Bug: Validación de RAM incorrecta

## Descripción
El sistema rechaza RAM DDR5-6000 en MB que soporta DDR5-6000.

## Reproducir
1. Login
2. Ir a PcBuilder
3. Seleccionar ASUS Z790 (DDR5 soportado)
4. Agregar Corsair DDR5-6000 32GB
5. Ver: "ERROR: RAM incompatible"

## Esperado
Debe decir: "Compatible"

## OS
Windows 11, Node 22.21.0, Chrome 120

## Logs
```
Error in validateRam: Memory type mismatch
```
```

### 🎯 Solicitar una Feature

**Crea un Issue con**:
1. **Descripción clara**: Qué quieres
2. **Por qué**: Beneficios, casos de uso
3. **Alternativas**: Soluciones existentes
4. **Contexto**: Documentos relevantes

**Ejemplo**:
```markdown
# Feature: Exportar build a PDF

## Descripción
Agregar botón para descargar el build actual como PDF imprimible.

## Por qué
- Usuarios quieren llevar especificaciones a la tienda
- Facilita comparación con tiendas
- Mejora UX

## Casos de uso
- Imprimir en tienda
- Enviar a amigos
- Archivo personal

## Implementación sugerida
1. Usar librería pdf-lib o pdfkit
2. Agregar botón en PcBuilder.tsx
3. POST /projects/:id/export-pdf
```

### 📚 Mejorar Documentación

**Cambios simples**: Edita el archivo directamente  
**Cambios grandes**: Abre un Pull Request

**Qué mejorar**:
- Errores de escritura
- Explicaciones confusas
- Ejemplos faltantes
- Secciones no actualizadas
- Traducciones

**Proceso**:
```bash
git checkout -b docs/mejorar-manual-backend
# Edita Documentacion/02_MANUAL_BACKEND.md
git commit -m "docs: aclarar controladores de compatibilidad"
git push origin docs/mejorar-manual-backend
# Abre PR
```

### ♻️ Refactorizar Código

**IMPORTANTE**: Discute primero en un Issue

Refactorizations sin discusión previa pueden no ser aceptadas.

**Propuesta de refactorización**:
```markdown
# Refactor: Mejorar estructura de compatibilityService

## Cambios
- Separar validaciones en métodos más pequeños
- Usar async/await en lugar de callbacks
- Agregar type hints

## Beneficios
- Código más legible
- Más fácil de testear
- Mejor mantenimiento

## Impacto
- Breaking changes: No
- Tests actualizados: Sí
- Docs actualizadas: Sí
```

---

## 🧪 Testing

### Frontend - React Testing Library

```typescript
// tests/PcBuilder.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import PcBuilder from '../PcBuilder';

describe('PcBuilder', () => {
  it('should add component to build', () => {
    const { getByText } = render(<PcBuilder />)
    fireEvent.press(getByText('Agregar'))
    expect(getByText('Componente agregado')).toBeTruthy()
  })
})
```

### Backend - Jest + Supertest

```javascript
// tests/compatibility.test.js
const request = require('supertest')
const app = require('../server')

describe('POST /compatibility/check', () => {
  it('should validate socket compatibility', async () => {
    const res = await request(app)
      .post('/compatibility/check')
      .send({
        procesador_id: 1,
        motherboard_id: 5
      })
    
    expect(res.statusCode).toBe(200)
    expect(res.body.validaciones.socket.compatible).toBe(true)
  })
})
```

**Ejecutar tests**:
```bash
npm test
npm test -- --watch
npm test -- --coverage
```

---

## 📐 Estándares de Código

### JavaScript/TypeScript

```javascript
// ✅ BIEN
const validateComponentId = (id) => {
  if (typeof id !== 'number' || id < 1) {
    throw new Error('ID debe ser un número positivo')
  }
  return id
}

// ❌ MAL
const val = (id) => {
  if (id < 1) throw 'error'
  return id
}
```

**Reglas**:
- Nombres claros y descriptivos
- Funciones pequeñas (< 20 líneas)
- Comenta lógica compleja
- Usa async/await, no callbacks
- Manejo de errores explícito

### SQL

```sql
-- ✅ BIEN
SELECT 
  p.id,
  p.nombre,
  p.tdp,
  m.socket
FROM procesadores p
JOIN motherboards m ON p.socket = m.socket
WHERE p.id = $1

-- ❌ MAL
SELECT * FROM procesadores, motherboards
```

**Reglas**:
- Parámetros con $1, $2 (previene SQL injection)
- Índices en columnas buscadas
- Nombres de tabla en singular (procesador, no procesadores)
- Alias cortos

---

## 📦 Dependencias

### Agregar una dependencia

**Necesita aprobación**: Discute primero

```bash
# Frontend
cd ProyectoFinalACV
npm install nombre-libreria
npm install --save-dev nombre-libreria # Dev only

# Backend
cd Server
npm install nombre-libreria
```

**En tu PR**: Explica por qué necesitas la librería

### Actualizar dependencias

```bash
npm outdated  # Ver qué hay desactualizado
npm update    # Actualizar
npm audit     # Verificar seguridad
```

---

## 🔐 Seguridad

### Revisar Security Issues

```bash
npm audit
npm audit fix
```

### Prácticas Seguras

1. **Nunca commits passwords o secrets**
   ```bash
   # ❌ MAL
   git commit -m "API key: abc123xyz"
   
   # ✅ BIEN
   # Usar .env y .gitignore
   ```

2. **Validar todas las inputs**
   ```javascript
   // ❌ MAL
   const componente = req.body.id  // Podría ser malicioso
   
   // ✅ BIEN
   const id = parseInt(req.body.id)
   if (!Number.isInteger(id) || id < 1) {
     return res.status(400).json({ error: 'ID inválido' })
   }
   ```

3. **Usar queries parametrizadas**
   ```javascript
   // ❌ MAL
   db.query(`SELECT * FROM users WHERE id = ${id}`)
   
   // ✅ BIEN
   db.query('SELECT * FROM users WHERE id = $1', [id])
   ```

---

## 📋 Checklist Antes de Submit

- [ ] Leí la documentación relevante
- [ ] Mi código sigue los estándares
- [ ] Probé en mi ambiente local
- [ ] Actualicé la documentación
- [ ] Los tests pasan (`npm test`)
- [ ] Sin console.log de debugging
- [ ] Mensaje de commit descriptivo
- [ ] Abrí un Issue antes de feature grande
- [ ] Responsive design (si es frontend)
- [ ] Error handling completo

---

## 🚀 Tu Primer Pull Request

**Tareas buenos para comenzar**:

1. **Mejorar documentación**
   - Corregir errores de escritura
   - Agregar ejemplos

2. **Reportar bugs menores**
   - UI pequeños
   - Mensajes de error

3. **Mejorar tests**
   - Agregar test cases
   - Aumentar coverage

4. **Refactorizar pequeño**
   - Funciones específicas
   - Después de aprobar issue

**NO HAGAS para tu primer PR**:
- Cambios arquitectónicos
- Nuevas dependencias grandes
- Cambios de BD
- Refactorización masiva

---

## 🤝 Código de Conducta

- Sé respetuoso
- Proporciona feedback constructivo
- Evita lenguaje ofensivo
- Acepta críticas al código (no es personal)
- Ayuda a otros contribuidores

---

## 📚 Recursos Útiles

### Documentación
- [Índice completo](00_INDICE.md)
- [Guía Arquitectura](07_GUIA_ARQUITECTURA.md)
- [Referencia API](08_REFERENCIA_API.md)

### Herramientas
- VS Code + ESLint
- GitHub Desktop
- Postman (para tests API)
- pgAdmin (para BD)

### Comunidad
- GitHub Issues
- GitHub Discussions
- Email al equipo

---

## ❓ Preguntas Frecuentes

**P: ¿Debo pedir permiso para trabajar en algo?**  
R: Para features grandes sí. Para bugs y docs, directo es fine.

**P: ¿Cuánto tiempo tarda el review?**  
R: 1-3 días máximo.

**P: ¿Qué pasa si mi PR es rechazado?**  
R: Discutimos por qué y cómo mejorarlo. No es personal.

**P: ¿Puedo trabajar en múltiples PRs?**  
R: Sí, pero termina una antes de empezar otra.

**P: ¿Necesito saber todo sobre el proyecto?**  
R: No. Especializarse es bueno. Documenta lo que aprendas.

---

## 🎓 Aprende Más

Después de tu primer PR:
- Aprende sobre pruebas
- Participa en code reviews
- Ayuda a otros
- Propón mejoras

---

**Gracias por contribuir a Proyecto Final ACV** 🙏

---

**Última actualización**: 2025-01-15  
**Versión**: 1.0
