
```
Final/
├── Documentacion/              ← Toda la documentación aquí
├── Server/                     ← Backend (Node.js + Express)
│   ├── Components/             ← Servicios y controladores
│   ├── package.json
│   └── server.js
├── ProyectoFinalACV/           ← Frontend (React Native + Expo)
│   ├── app/
│   │   ├── (tabs)/             ← Pantallas
│   │   ├── services/           ← Servicios API
│   │   └── ...
│   └── package.json
└── ...
```

## Comandos 

### Backend
```bash
# Iniciar servidor
npm start

# Iniciar en desarrollo con recarga automática
npm run dev

# Revisar sintaxis
node -c server.js
```

### Frontend
```bash
# Iniciar Expo
npm start

# Abrir en navegador
npm run web

# Limpiar caché
npm run reset-cache
```
