# 📚 Referencia Completa de API

## Configuración Base

```
URL Base (Local): http://localhost:5000
URL Base (Producción): https://api-tu-dominio.com

Headers Requeridos:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN> (en endpoints protegidos)
```

---

## Autenticación

### POST /auth/register

Registrar nuevo usuario

**Parámetros**:
```json
{
  "email": "usuario@example.com",
  "password": "miContraseña123",
  "nombre": "Juan Pérez"
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid-123",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez"
  }
}
```

**Errores Posibles**:
- `400`: Email ya existe
- `400`: Contraseña muy corta (mín. 8 caracteres)
- `500`: Error interno del servidor

---

### POST /auth/login

Iniciar sesión

**Parámetros**:
```json
{
  "email": "usuario@example.com",
  "password": "miContraseña123"
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez"
  }
}
```

**Errores Posibles**:
- `401`: Email o contraseña incorrectos
- `404`: Usuario no encontrado
- `500`: Error interno del servidor

---

### POST /auth/google

Autenticación con Google

**Parámetros**:
```json
{
  "token": "google-id-token"
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "uuid-123",
    "email": "usuario@gmail.com"
  }
}
```

---

### POST /auth/logout

Cerrar sesión

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

---

## Componentes - Lectura

### GET /components/procesadores

Obtener todos los procesadores

**Query Parameters**:
```
?socket=LGA1700          (opcional - filtrar por socket)
?minTdp=50               (opcional - TDP mínimo)
?maxTdp=250              (opcional - TDP máximo)
?limit=10                (opcional - máx. resultados)
?offset=0                (opcional - para paginación)
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Intel Core i7-13700K",
      "socket": "LGA1700",
      "nucleos": 16,
      "frecuencia_base": 3.4,
      "frecuencia_boost": 5.4,
      "tdp": 125,
      "precio": 450.00
    }
  ],
  "total": 45
}
```

---

### GET /components/motherboards

Obtener todas las placas base

**Query Parameters**:
```
?socket=LGA1700
?chipset=Z790
?precio_min=100
?precio_max=300
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "ASUS ROG STRIX Z790-E",
      "socket": "LGA1700",
      "chipset": "Z790",
      "slots_ram": 4,
      "tipo_ram": "DDR5",
      "slots_m2": 2,
      "slots_pcie": 3,
      "formato": "ATX",
      "precio": 299.00
    }
  ],
  "total": 28
}
```

---

### GET /components/memorias

Obtener módulos RAM

**Query Parameters**:
```
?tipo=DDR5
?velocidad=6000
?capacidad=32
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Corsair Vengeance DDR5 32GB",
      "tipo": "DDR5",
      "capacidad": 32,
      "velocidad": 6000,
      "latencia": 30,
      "precio": 130.00
    }
  ],
  "total": 52
}
```

---

### GET /components/tarjetas-graficas

Obtener tarjetas gráficas

**Query Parameters**:
```
?memoria_minima=8
?memoria_maxima=24
?arquitectura=Ada
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "NVIDIA RTX 4070 Ti",
      "arquitectura": "Ada",
      "memoria_gb": 12,
      "memoria_tipo": "GDDR6X",
      "ancho_banda": 192,
      "tdp": 285,
      "puertos": "3x DisplayPort, 1x HDMI",
      "longitud_mm": 320,
      "ancho_mm": 112,
      "altura_mm": 60,
      "conectores_poder": "1x 12-pin",
      "precio": 799.00
    }
  ],
  "total": 35
}
```

---

### GET /components/almacenamiento

Obtener dispositivos de almacenamiento

**Query Parameters**:
```
?tipo=SSD
?interfaz=NVMe
?capacidad=1000
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Samsung 980 Pro 1TB",
      "tipo": "SSD",
      "interfaz": "NVMe",
      "forma": "M.2",
      "capacidad_gb": 1000,
      "velocidad_lectura": 7100,
      "velocidad_escritura": 6000,
      "precio": 89.99
    }
  ],
  "total": 61
}
```

---

### GET /components/fuentes-poder

Obtener fuentes de poder

**Query Parameters**:
```
?potencia_minima=650
?potencia_maxima=1200
?certificacion=80+Gold
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Corsair RM850x Gold",
      "potencia_w": 850,
      "certificacion": "80+ Gold",
      "modular": true,
      "conectores_8pin": 2,
      "conectores_6pin": 1,
      "conectores_pcie": 2,
      "precio": 129.99
    }
  ],
  "total": 43
}
```

---

### GET /components/gabinetes

Obtener gabinetes

**Query Parameters**:
```
?formato=ATX
?tipo_almacenamiento=3.5in
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "NZXT H510 Flow",
      "formato_soportado": "ATX",
      "capacidad_bahias_35": 2,
      "capacidad_bahias_25": 2,
      "slots_expansión": 7,
      "puerto_usb_30": 2,
      "puerto_usb_c": 1,
      "compatibilidad_cooler_altura_mm": 165,
      "ancho_mm": 210,
      "profundidad_mm": 468,
      "altura_mm": 425,
      "precio": 109.99
    }
  ],
  "total": 28
}
```

---

## Compatibilidad

### POST /compatibility/check

Validar compatibilidad completa de un build

**Parámetros**:
```json
{
  "procesador_id": 1,
  "motherboard_id": 5,
  "ram_ids": [10, 11],
  "tarjeta_grafica_id": 3,
  "almacenamiento_ids": [20, 21],
  "fuente_poder_id": 8,
  "gabinete_id": 12
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "compatible": false,
  "validaciones": {
    "socket": {
      "compatible": true,
      "detalles": "Socket LGA1700 coincide"
    },
    "memoria_ram": {
      "compatible": true,
      "slots_usados": 2,
      "slots_disponibles": 4,
      "capacidad_total": 64,
      "detalles": "RAM DDR5-6000 compatible"
    },
    "almacenamiento": {
      "compatible": true,
      "detalles": "2x M.2 NVMe, 1x 2.5 SATA"
    },
    "tarjeta_grafica": {
      "compatible": false,
      "detalles": "GPU demasiado larga para el gabinete (320mm, max 300mm)"
    },
    "formato": {
      "compatible": true,
      "detalles": "ATX motherboard en gabinete ATX"
    },
    "potencia": {
      "compatible": true,
      "consumo_total": 680,
      "consumo_procesador": 125,
      "consumo_gpu": 285,
      "consumo_otros": 50,
      "potencia_fuente": 850,
      "margen_seguridad": "1.25x (está bien)"
    }
  },
  "issues": [
    {
      "tipo": "INCOMPATIBLE",
      "componente": "Tarjeta Gráfica",
      "mensaje": "La RTX 4070 Ti mide 320mm pero el gabinete solo acepta 300mm",
      "severidad": "error"
    }
  ],
  "warnings": [
    {
      "tipo": "ADVERTENCIA",
      "componente": "Potencia",
      "mensaje": "La fuente solo deja 170W de margen. Considera 950W para más seguridad",
      "severidad": "warning"
    }
  ]
}
```

---

### POST /compatibility/validate-socket

Validar socket CPU-MB

**Parámetros**:
```json
{
  "procesador_id": 1,
  "motherboard_id": 5
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "compatible": true,
  "detalles": "Socket LGA1700 en CPU coincide con socket LGA1700 en motherboard"
}
```

---

### POST /compatibility/validate-ram

Validar compatibilidad de RAM

**Parámetros**:
```json
{
  "motherboard_id": 5,
  "ram_ids": [10, 11]
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "compatible": true,
  "detalles": {
    "slots_disponibles": 4,
    "slots_usados": 2,
    "capacidad_total": 64,
    "tipo": "DDR5-6000",
    "notas": "Todas las RAM son DDR5-6000, compatible con motherboard"
  }
}
```

---

### POST /compatibility/validate-power

Validar fuente de poder

**Parámetros**:
```json
{
  "procesador_id": 1,
  "tarjeta_grafica_id": 3,
  "fuente_poder_id": 8
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "compatible": true,
  "consumo": {
    "procesador": 125,
    "gpu": 285,
    "otros": 50,
    "total": 460,
    "total_con_margen": 575,
    "potencia_fuente": 850,
    "margen_disponible": 275
  },
  "detalles": "Suficiente potencia con margen seguro de 1.25x"
}
```

---

### POST /compatibility/validate-storage

Validar almacenamiento

**Parámetros**:
```json
{
  "motherboard_id": 5,
  "gabinete_id": 12,
  "almacenamiento_ids": [20, 21]
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "compatible": true,
  "detalles": {
    "m2_disponibles": 4,
    "m2_usados": 2,
    "sata_35_disponibles": 2,
    "sata_35_usados": 0,
    "sata_25_disponibles": 2,
    "sata_25_usados": 1
  }
}
```

---

## Proyectos

### GET /projects

Obtener todos los proyectos del usuario actual

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:
```
?limit=10
?offset=0
?estado=borrador
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Gaming PC 2024",
      "descripcion": "PC para juegos competitivos",
      "usuario_id": "uuid-123",
      "estado": "borrador",
      "presupuesto": 1500,
      "componentes_count": 7,
      "fecha_creacion": "2024-01-15",
      "fecha_actualizacion": "2024-01-20"
    }
  ],
  "total": 5
}
```

---

### GET /projects/:id

Obtener detalles de un proyecto específico

**Parámetros URL**:
```
:id = ID del proyecto (ej: 1)
```

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Gaming PC 2024",
    "descripcion": "PC para juegos competitivos",
    "usuario_id": "uuid-123",
    "estado": "borrador",
    "presupuesto": 1500,
    "costo_total": 1450.00,
    "fecha_creacion": "2024-01-15",
    "fecha_actualizacion": "2024-01-20",
    "componentes": [
      {
        "tipo": "procesador",
        "componente_id": 1,
        "nombre": "Intel Core i7-13700K"
      },
      {
        "tipo": "motherboard",
        "componente_id": 5,
        "nombre": "ASUS ROG STRIX Z790-E"
      }
    ]
  }
}
```

---

### POST /projects

Crear nuevo proyecto

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Parámetros**:
```json
{
  "nombre": "Gaming PC 2024",
  "descripcion": "PC para juegos competitivos",
  "presupuesto": 1500
}
```

**Respuesta Exitosa** (201):
```json
{
  "success": true,
  "message": "Proyecto creado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Gaming PC 2024",
    "estado": "borrador"
  }
}
```

**Errores Posibles**:
- `400`: Nombre requerido
- `400`: Presupuesto debe ser número positivo
- `401`: No autenticado
- `500`: Error interno

---

### PUT /projects/:id

Actualizar proyecto

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Parámetros**:
```json
{
  "nombre": "Gaming PC 2024 - Actualizado",
  "descripcion": "Nueva descripción",
  "presupuesto": 1800,
  "estado": "finalizado"
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Proyecto actualizado"
}
```

---

### DELETE /projects/:id

Eliminar proyecto

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Proyecto eliminado"
}
```

---

### POST /projects/:id/componentes

Agregar componente a proyecto

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Parámetros**:
```json
{
  "tipo": "procesador",
  "componente_id": 1,
  "cantidad": 1
}
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Componente agregado al proyecto"
}
```

---

### DELETE /projects/:id/componentes/:component-id

Remover componente de proyecto

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Componente removido"
}
```

---

## Propiedades

### GET /properties

Obtener todas las propiedades disponibles (socket, tipos de memoria, etc.)

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": {
    "sockets": ["LGA1700", "AM5", "LGA1200"],
    "tipos_ram": ["DDR5", "DDR4"],
    "interfaz_almacenamiento": ["NVMe", "SATA"],
    "certificaciones_psu": ["80+ Bronze", "80+ Silver", "80+ Gold", "80+ Platinum"],
    "formatos_mb": ["ATX", "Micro-ATX", "Mini-ITX"]
  }
}
```

---

### GET /properties/:tipo

Obtener propiedades específicas

**Parámetros URL**:
```
:tipo = sockets | tipos_ram | interfaz_almacenamiento | etc.
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "data": ["LGA1700", "AM5", "LGA1200", "TRX50"]
}
```

---

## Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Parámetros inválidos |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | No tiene permisos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Server Error | Error interno del servidor |

---

## Errores Comunes

### Error: "Token inválido"
```json
{
  "success": false,
  "error": "Token inválido o expirado"
}
```
**Solución**: Haz login nuevamente para obtener un nuevo token

### Error: "Campo requerido"
```json
{
  "success": false,
  "error": "Campo requerido: nombre"
}
```
**Solución**: Incluye el campo requerido en la solicitud

### Error: "Recurso no encontrado"
```json
{
  "success": false,
  "error": "Componente con ID 999 no encontrado"
}
```
**Solución**: Verifica que el ID es correcto

---

## Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "miContraseña123"
  }'
```

### Obtener procesadores
```bash
curl -X GET "http://localhost:5000/components/procesadores?socket=LGA1700"
```

### Validar compatibilidad
```bash
curl -X POST http://localhost:5000/compatibility/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "procesador_id": 1,
    "motherboard_id": 5,
    "ram_ids": [10, 11],
    "tarjeta_grafica_id": 3,
    "almacenamiento_ids": [20],
    "fuente_poder_id": 8,
    "gabinete_id": 12
  }'
```

---

**Última actualización**: 2025-11-12  
**Versión**: 2.0
