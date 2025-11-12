# 🔧 Sistema de Compatibilidad

## Descripción General

Sistema inteligente que valida automáticamente la compatibilidad entre componentes de PC. Previene que los usuarios construyan sistemas incompatibles y proporciona advertencias sobre configuraciones no óptimas.

---

## Tipos de Validación

### 1. Compatibilidad de Socket

**¿Qué valida?**  
Que el socket del CPU coincida con el socket del Motherboard.

**Error Bloqueante**: SÍ  
**Fórmula**: `CPU.socket === Motherboard.socket`

**Ejemplo**:
```
CPU: Intel i7-13700K → Socket LGA 1700
MB: ASUS Z890-E → Socket LGA 1700
Resultado: ✅ Compatible

CPU: AMD Ryzen 7 7700X → Socket AM5
MB: ASUS Z890-E → Socket LGA 1700
Resultado: ❌ Incompatible - "Socket incompatible (AM5 vs LGA 1700)"
```

---

### 2. Compatibilidad de RAM

**¿Qué valida?**
- Cantidad de RAMs vs slots disponibles
- Capacidad total vs máximo soportado
- Velocidad vs máxima soportada
- Tipo de memoria (DDR4/DDR5)

**Error Bloqueante**: SÍ (cantidad y tipo)  
**Warning**: SÍ (velocidad limitada)

**Ejemplo**:
```
MB: ASUS Z890 (4 slots, 192GB max, DDR5 7000MHz)

Caso 1: 1x32GB DDR5 4800MHz
Resultado: ✅ Compatible (1/4 slots)

Caso 2: 2x32GB DDR5 4800MHz
Resultado: ✅ Compatible (2/4 slots)

Caso 3: 4x32GB DDR5 4800MHz
Resultado: ✅ Compatible (4/4 slots)

Caso 4: 5x32GB DDR5 4800MHz
Resultado: ❌ Error - "Excede slots de MB (5 > 4)"

Caso 5: 4x48GB DDR5 = 192GB
Resultado: ❌ Error - "Excede capacidad máxima (192 > 192GB)"

Caso 6: 4x32GB DDR5 7200MHz
Resultado: ⚠️ Warning - "Velocidad limitada a 7000MHz"
```

---

### 3. Compatibilidad de Almacenamiento

**¿Qué valida?**
- Cantidad de discos SATA vs puertos disponibles (MB + Case)
- Cantidad de NVMe M.2 vs puertos disponibles
- Bahías 3.5" para HDD (Case)
- Bahías 2.5" para SSD (Case)

**Error Bloqueante**: SÍ

**Campos requeridos**:

**Motherboard**:
```
bahias_sata (INT)     - Puertos SATA disponibles
puertos_m2 (INT)      - Puertos NVMe M.2
```

**Gabinete**:
```
bahias_3_5 (INT)      - Bahías para HDD 3.5"
bahias_2_5 (INT)      - Bahías para SSD 2.5"
slots_m2_backplane (INT) - Slots M.2 en backplane
```

**Almacenamiento**:
```
tamaño_fisico_mm (VARCHAR) - "3.5", "2.5", "M.2 2280", etc
```

**Ejemplo**:
```
MB: ASUS Z890 (2 SATA, 2 M.2)
Case: Lian Li (2x 3.5", 2x 2.5", 1 M.2 backplane)

Config 1: 2x HDD 3.5" + 2x SSD M.2
- HDD: 2 bahías 3.5" usadas ✅
- M.2: 2 puertos usados ✅
Resultado: ✅ Compatible

Config 2: 3x HDD 3.5" + 2x SSD M.2
- HDD: 3 > 2 bahías ❌
Resultado: ❌ Error - "Excede bahías HDD"
```

---

### 4. Compatibilidad de GPU

**¿Qué valida?**
- Longitud de la GPU vs longitud máxima del Case
- Altura de la GPU vs altura máxima de cooler
- Slots PCIe ocupados vs disponibles

**Error Bloqueante**: SÍ

**Campos requeridos**:

**Tarjeta Gráfica**:
```
longitud_mm (INT)       - Longitud física
altura_mm (INT)         - Altura física
slots_ocupados (DECIMAL) - Cantidad de slots x16 (1, 1.5, 2, 2.5, 3)
```

**Motherboard**:
```
slots_pcie (INT)        - Slots PCIe x16 disponibles
```

**Gabinete**:
```
longitud_max_gpu_mm (INT) - Longitud máxima GPU
altura_max_cooler_mm (INT) - Altura máxima para cooler
```

**Ejemplo**:
```
GPU: RTX 4090 (340mm largo, 110mm alto, 2.5 slots)
MB: ASUS Z890 (3 slots PCIe)
Case: Phanteks (360mm GPU max, 165mm cooler max)

Validaciones:
- Largo: 340mm <= 360mm ✅
- Alto: 110mm <= 165mm ✅
- Slots: 2.5 <= 3 ✅
Resultado: ✅ Compatible
```

---

### 5. Compatibilidad de Formato

**¿Qué valida?**
Que el formato del Motherboard esté soportado por el Case.

**Error Bloqueante**: SÍ

**Campos requeridos**:

**Motherboard**:
```
formato (VARCHAR) - "Mini-ITX", "Micro-ATX", "ATX", "E-ATX"
```

**Gabinete**:
```
formato_soportado (VARCHAR) - "Mini-ITX,Micro-ATX,ATX"
```

**Ejemplo**:
```
MB: ASUS ROG (formato: E-ATX)
Case: Lian Li (soporta: Mini-ITX,Micro-ATX,ATX)

Validación: "E-ATX" in "Mini-ITX,Micro-ATX,ATX"? NO
Resultado: ❌ Error - "Formato E-ATX no soportado"
```

---

### 6. Compatibilidad de Potencia

**¿Qué valida?**  
Que la fuente de poder tenga suficiente capacidad para el sistema.

**Error Bloqueante**: SÍ (si insuficiente)  
**Warning**: SÍ (si muy ajustada)

**Fórmula de Cálculo**:
```
Consumo Total = (CPU_TDP + GPU_W + RAM*0.5 + Storage*5 + 50) * 1.25

Desglose:
- CPU_TDP: Consumo del procesador
- GPU_W: Potencia requerida de la tarjeta gráfica
- RAM*0.5: 0.5W por GB de memoria
- Storage*5: 5W por disco duro/SSD
- 50: Consumo fijo (MB, cooler, otros)
- *1.25: Margen de seguridad 25%
```

**Validaciones**:
```
Consumo / Capacidad PSU:
- <= 60%  → ✅ OK
- 60-80%  → ⚠️ Warning "PSU justa, considera capacidad mayor"
- > 80%   → ❌ Error "PSU insuficiente"
```

**Ejemplo**:
```
CPU: i9-13900K        → 253W TDP
GPU: RTX 4090         → 450W
RAM: 2x32GB DDR5      → 32W (16W*2)
Storage: 3x SSD       → 15W (5W*3)
MB + Cooler + Otros   → 50W
Margen (1.25x)        → Multiplicador

Cálculo:
(253 + 450 + 32 + 15 + 50) * 1.25 = 975W recomendado

PSU 650W  → 975W > 650W → ❌ ERROR - Insuficiente
PSU 850W  → 975W > 850W → ❌ ERROR - Insuficiente
PSU 1000W → 975W <= 1000W → ✅ Compatible
```

---

## Campos Requeridos por Tabla

### procesadores
```
✅ tdp (INT) - Thermal Design Power en Watts
```

### motherboards
```
✅ slots_memoria (INT)        - Cantidad de slots RAM
✅ memoria_maxima_gb (INT)    - Capacidad máxima total
✅ velocidad_maxima_mhz (INT) - Velocidad RAM máxima
✅ bahias_sata (INT)          - Puertos SATA
✅ puertos_m2 (INT)           - Puertos M.2 NVMe
✅ slots_pcie (INT)           - Slots PCIe x16
✅ formato_soportado (VARCHAR) - Formatos de MB
```

### memorias_ram
```
✅ tipo (VARCHAR)          - DDR4/DDR5
✅ velocidad_mhz (INT)     - MHz
✅ capacidad (INT)         - GB
```

### tarjetas_graficas
```
✅ potencia_requerida_w (INT) - TDP en W
✅ longitud_mm (INT)          - Longitud física
✅ altura_mm (INT)            - Altura física
✅ slots_ocupados (DECIMAL)   - Slots ocupados
```

### almacenamiento
```
✅ tamaño_fisico_mm (VARCHAR) - "3.5", "2.5", "M.2"
✅ velocidad_lectura_mbs (INT) - Velocidad lectura
```

### fuentes_poder
```
✅ potencia_w (INT)       - Capacidad en Watts
✅ certificacion (VARCHAR) - 80+ Bronze/Silver/Gold
✅ conectores_8pin (INT)  - Conectores 8-pin CPU
✅ conectores_pcie (INT)  - Conectores PCIe GPU
```

### gabinetes
```
✅ formato_soportado (VARCHAR)  - Formatos soportados
✅ longitud_max_gpu_mm (INT)    - Largo máximo GPU
✅ altura_max_cooler_mm (INT)   - Altura máxima cooler
✅ bahias_3_5 (INT)             - Bahías 3.5"
✅ bahias_2_5 (INT)             - Bahías 2.5"
✅ slots_m2_backplane (INT)     - Slots M.2 backplane
```

---

## Severidad de Errores

### 🔴 Errores Bloqueantes (Critical)
Impiden guardar el build. Deben resolverse.

**Ejemplos**:
- Socket incompatible
- Excede slots RAM
- Excede capacidad total RAM
- GPU no cabe en el case
- Formato incompatible
- PSU insuficiente
- Excede puertos de almacenamiento

### 🟡 Advertencias (Warnings)
Informativas. No bloquean pero aconsejan mejora.

**Ejemplos**:
- RAM más lenta que máximo soportado
- PSU muy ajustada (>60% consumo)
- Storage con velocidad limitada
- Solo un slot PCIe disponible

### 🟢 Compatible
Todas las validaciones pasaron.

---

## Respuesta API

### Estructura General
```json
{
  "success": true,
  "data": {
    "compatible": true,
    "issues": [],
    "warnings": []
  }
}
```

### Ejemplo de Error
```json
{
  "success": false,
  "error": "No se pudo conectar a la base de datos"
}
```

### Ejemplo de Incompatibilidad
```json
{
  "success": true,
  "data": {
    "compatible": false,
    "issues": [
      "Socket incompatible: AM5 vs LGA 1700",
      "RAM type incompatible: DDR4 vs DDR5"
    ],
    "warnings": [
      "RAM speed limited to 5400MHz"
    ]
  }
}
```

---

## Migraciones de Base de Datos

### Script de Migración
```sql
-- Ejecutar: .\run_migration.ps1
-- O copiar en Neon Dashboard
```

La migración añade automáticamente:
- Todos los campos requeridos
- Índices para optimización
- Comentarios de documentación

---

## Próximas Mejoras

- [ ] Validación de chipset compatibilidad
- [ ] Validación de conectores PSU
- [ ] Recomendaciones automáticas
- [ ] Cálculo de precio total
- [ ] Sistema de overclocking compatibility
- [ ] Noise level estimation

---

**Última actualización**: 2025-11-12  
**Versión**: 1.0
