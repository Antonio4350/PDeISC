# 🗄️ Base de Datos

## Descripción General

La base de datos utiliza PostgreSQL con Neon para almacenar toda la información del proyecto: componentes, usuarios, proyectos y validaciones.

**Tipo**: PostgreSQL 14+  
**Host**: Neon Cloud  
**Puerto**: 5432  
**Nombre**: PCBuilderDB

---

## Tablas del Sistema

### usuarios

Almacena información de usuarios registrados.

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  contraseña_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255),
  apellido VARCHAR(255),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT true
);
```

**Campos**:
- `id` - Identificador único
- `email` - Email único para login
- `contraseña_hash` - Contraseña hasheada (nunca en texto plano)
- `nombre` - Nombre del usuario
- `apellido` - Apellido
- `fecha_creacion` - Cuándo se registró
- `activo` - Si la cuenta está activa

---

### procesadores

Almacena información de CPUs disponibles.

```sql
CREATE TABLE procesadores (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(255) NOT NULL,
  nucleos INT,
  hilos INT,
  socket VARCHAR(50),
  frecuencia_base DECIMAL(3,2),
  frecuencia_turbo DECIMAL(3,2),
  tipo_memoria VARCHAR(50),
  tdp INT,
  imagen_url VARCHAR(500),
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos principales**:
- `marca` - Intel, AMD, etc.
- `modelo` - i9-13900K, Ryzen 7 7700X, etc.
- `nucleos` - Cantidad de núcleos
- `hilos` - Cantidad de hilos
- `socket` - Socket del CPU (LGA 1700, AM5, etc.)
- `frecuencia_base` - GHz base
- `frecuencia_turbo` - GHz turbo
- `tipo_memoria` - DDR4, DDR5
- `tdp` - Thermal Design Power en Watts

---

### motherboards

Almacena información de placas base.

```sql
CREATE TABLE motherboards (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(255),
  socket VARCHAR(50),
  tipo_memoria VARCHAR(50),
  formato VARCHAR(50),
  chipset VARCHAR(100),
  slots_memoria INT DEFAULT 2,
  memoria_maxima_gb INT DEFAULT 32,
  velocidad_maxima_mhz INT DEFAULT 3200,
  bahias_sata INT DEFAULT 2,
  puertos_m2 INT DEFAULT 1,
  slots_pcie INT DEFAULT 3,
  formato_soportado VARCHAR(255) DEFAULT 'ATX',
  imagen_url VARCHAR(500),
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos de compatibilidad**:
- `slots_memoria` - Cantidad de slots RAM
- `memoria_maxima_gb` - Máximo de RAM soportada
- `velocidad_maxima_mhz` - Velocidad máxima RAM
- `bahias_sata` - Puertos SATA disponibles
- `puertos_m2` - Puertos M.2 disponibles
- `slots_pcie` - Slots PCIe disponibles
- `formato_soportado` - Formatos de MB soportados

---

### memorias_ram

Almacena módulos de memoria RAM.

```sql
CREATE TABLE memorias_ram (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(255),
  capacidad INT,
  tipo VARCHAR(50),
  velocidad_mhz INT,
  velocidad_mt INT,
  latencia INT,
  voltaje DECIMAL(3,2),
  color VARCHAR(100),
  imagen_url VARCHAR(500),
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos**:
- `capacidad` - GB por módulo
- `tipo` - DDR4, DDR5
- `velocidad_mhz` - Frecuencia en MHz
- `velocidad_mt` - Velocidad en MT/s
- `latencia` - CAS latency (CL16, etc.)
- `voltaje` - Voltaje en V

---

### tarjetas_graficas

Almacena tarjetas gráficas disponibles.

```sql
CREATE TABLE tarjetas_graficas (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(255),
  gpu VARCHAR(100),
  memoria INT,
  tipo_memoria VARCHAR(50),
  nucleos_cuda INT,
  arquitectura VARCHAR(100),
  potencia_requerida_w INT,
  longitud_mm INT,
  altura_mm INT,
  slots_ocupados DECIMAL(2,1),
  conectores_8pin INT,
  conectores_6pin INT,
  interfaz VARCHAR(50),
  imagen_url VARCHAR(500),
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos de compatibilidad**:
- `potencia_requerida_w` - TDP de la GPU
- `longitud_mm` - Longitud física en mm
- `altura_mm` - Altura física en mm
- `slots_ocupados` - Slots PCIe x16 que ocupa

---

### almacenamiento

Almacena unidades de almacenamiento (SSDs, HDDs).

```sql
CREATE TABLE almacenamiento (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(255),
  capacidad INT,
  tipo VARCHAR(50),
  interfaz VARCHAR(50),
  tamaño_fisico_mm VARCHAR(50),
  velocidad_lectura_mbs INT,
  velocidad_escritura_mbs INT,
  form_factor VARCHAR(50),
  imagen_url VARCHAR(500),
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos**:
- `capacidad` - Tamaño en GB
- `tipo` - HDD, SSD
- `interfaz` - SATA, NVMe, etc.
- `tamaño_fisico_mm` - "3.5", "2.5", "M.2 2280", etc.
- `velocidad_lectura_mbs` - Velocidad en MB/s

---

### fuentes_poder

Almacena fuentes de alimentación.

```sql
CREATE TABLE fuentes_poder (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(255),
  potencia_w INT,
  certificacion VARCHAR(50),
  modular BOOLEAN DEFAULT false,
  conectores_24pin INT DEFAULT 1,
  conectores_8pin INT DEFAULT 1,
  conectores_6pin INT DEFAULT 0,
  conectores_pcie INT DEFAULT 2,
  conectores_sata INT DEFAULT 4,
  conectores_molex INT DEFAULT 0,
  enfriamiento VARCHAR(100),
  imagen_url VARCHAR(500),
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos**:
- `potencia_w` - Capacidad en Watts
- `certificacion` - 80+ Bronze/Silver/Gold/Platinum/Titanium
- `modular` - Si es modular
- `conectores_*` - Cantidad de cada tipo de conector

---

### gabinetes

Almacena gabinetes disponibles.

```sql
CREATE TABLE gabinetes (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(255),
  formato VARCHAR(100),
  material VARCHAR(100),
  color VARCHAR(100),
  volumen_litros INT,
  motherboards_soportadas VARCHAR(500),
  formato_soportado VARCHAR(500),
  longitud_max_gpu_mm INT DEFAULT 300,
  altura_max_cooler_mm INT DEFAULT 165,
  bahias_3_5 INT DEFAULT 2,
  bahias_2_5 INT DEFAULT 1,
  slots_m2_backplane INT DEFAULT 0,
  conectores_usb INT DEFAULT 2,
  conectores_audio BOOLEAN DEFAULT true,
  ventiladores_incluidos INT DEFAULT 1,
  imagen_url VARCHAR(500),
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos de compatibilidad**:
- `formato_soportado` - Formatos de MB soportados
- `longitud_max_gpu_mm` - Largo máximo de GPU
- `altura_max_cooler_mm` - Altura máxima de cooler
- `bahias_3_5` - Bahías 3.5" para HDD
- `bahias_2_5` - Bahías 2.5" para SSD
- `slots_m2_backplane` - Slots M.2 en backplane

---

### proyectos

Almacena builds/proyectos de usuarios.

```sql
CREATE TABLE proyectos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  nombre VARCHAR(255),
  descripcion TEXT,
  procesador_id INT REFERENCES procesadores(id),
  motherboard_id INT REFERENCES motherboards(id),
  gpu_id INT REFERENCES tarjetas_graficas(id),
  psu_id INT REFERENCES fuentes_poder(id),
  case_id INT REFERENCES gabinetes(id),
  presupuesto DECIMAL(10,2),
  estado VARCHAR(50) DEFAULT 'borrador',
  compatible BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_completado TIMESTAMP
);
```

**Campos**:
- `usuario_id` - Usuario propietario
- `nombre` - Nombre del proyecto
- `descripcion` - Descripción del build
- `compatible` - Si pasa todas las validaciones
- `estado` - borrador, completado, compartido, etc.

---

### proyecto_componentes

Tabla de relación para múltiples componentes por proyecto.

```sql
CREATE TABLE proyecto_componentes (
  id SERIAL PRIMARY KEY,
  proyecto_id INT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  tipo_componente VARCHAR(50),
  componente_id INT,
  cantidad INT DEFAULT 1,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Uso**: Almacenar múltiples RAMs, discos, etc. por proyecto.

---

## Índices de Optimización

```sql
-- Búsquedas por socket
CREATE INDEX idx_procesadores_socket ON procesadores(socket);
CREATE INDEX idx_motherboards_socket ON motherboards(socket);

-- Búsquedas por tipo de memoria
CREATE INDEX idx_motherboards_tipo_memoria ON motherboards(tipo_memoria);
CREATE INDEX idx_memorias_ram_tipo ON memorias_ram(tipo);

-- Búsquedas por usuario
CREATE INDEX idx_proyectos_usuario ON proyectos(usuario_id);

-- Búsquedas por estado
CREATE INDEX idx_componentes_estado ON procesadores(estado);
CREATE INDEX idx_proyectos_estado ON proyectos(estado);
```

---

## Restricciones de Integridad

```sql
-- Socket válido
ALTER TABLE procesadores ADD CONSTRAINT chk_socket_valido
  CHECK (socket IN ('LGA 1700', 'AM5', 'AM4', 'LGA 1200', ...));

-- Capacidad positiva
ALTER TABLE memorias_ram ADD CONSTRAINT chk_capacidad_positiva
  CHECK (capacidad > 0);

-- Potencia positiva
ALTER TABLE fuentes_poder ADD CONSTRAINT chk_potencia_positiva
  CHECK (potencia_w > 0);

-- Frecuencia válida
ALTER TABLE procesadores ADD CONSTRAINT chk_frecuencia_valida
  CHECK (frecuencia_base > 0 AND frecuencia_turbo > frecuencia_base);
```

---

## Migraciones

### Añadir nuevos campos

Para agregar un campo nuevo a una tabla:

```sql
ALTER TABLE procesadores
ADD COLUMN frecuencia_boost DECIMAL(3,2);
```

### Crear tabla nueva

Para una nueva categoría de componentes:

```sql
CREATE TABLE nuevo_componente (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(255),
  -- ... otros campos
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Consultas Útiles

### Contar componentes
```sql
SELECT COUNT(*) as total FROM procesadores WHERE estado = 'activo';
SELECT COUNT(*) FROM motherboards WHERE estado = 'activo';
SELECT COUNT(*) FROM memorias_ram WHERE estado = 'activo';
```

### Encontrar componentes compatibles
```sql
SELECT * FROM procesadores 
WHERE socket = 'LGA 1700' 
  AND estado = 'activo'
ORDER BY frecuencia_turbo DESC;
```

### Ver proyectos de usuario
```sql
SELECT p.nombre, p.fecha_creacion, p.compatible
FROM proyectos p
WHERE p.usuario_id = 5
ORDER BY p.fecha_creacion DESC;
```

### Validar datos de compatibilidad
```sql
SELECT COUNT(*) FROM motherboards WHERE slots_memoria IS NULL;
SELECT COUNT(*) FROM tarjetas_graficas WHERE potencia_requerida_w IS NULL;
SELECT COUNT(*) FROM gabinetes WHERE longitud_max_gpu_mm IS NULL;
```

---

## Respaldos y Mantenimiento

### Respaldo automático en Neon
Neon realiza respaldos automáticos diarios. Se pueden restaurar desde el dashboard.

### Monitoreo
- Monitor CPU y memoria en Neon Dashboard
- Revisar logs de error
- Monitorear conexiones activas

---

## Mejores Prácticas

✅ **Hacer**:
- Usar prepared statements
- Validar datos antes de insertar
- Mantener índices actualizados
- Hacer respaldos regularmente
- Usar transacciones para cambios complejos

❌ **No hacer**:
- Guardar contraseñas en texto plano
- Inyectar SQL sin validar
- Eliminar datos sin respaldo
- Cambiar schema en producción sin testing
- Guardar archivos en BD (usar URLs)

---

**Última actualización**: 2025-11-12  
**Versión**: 1.0
