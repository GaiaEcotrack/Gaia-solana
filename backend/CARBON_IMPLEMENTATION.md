# Sistema de Créditos de Carbono - GAIA Gold Standard

## Descripción General

Este sistema implementa la metodología certificable Gold Standard para créditos de carbono en el algoritmo de Gaia. Permite a los usuarios registrar proyectos fotovoltaicos, generar reportes de monitoreo, y obtener créditos de carbono verificados (VERs) en el mercado voluntario.

## Arquitectura del Sistema

### Componentes Principales

1. **Modelos de Datos**
   - `Project`: Proyectos fotovoltaicos registrados
   - `MonitoringReport`: Reportes de monitoreo de carbono
   - `AuditLog`: Log de auditoría del sistema

2. **Servicios**
   - `CarbonReportService`: Generación y gestión de reportes
   - `ValidationService`: Validación según estándares Gold Standard

3. **Utilidades**
   - `PDFGenerator`: Generación de PDFs certificados
   - `IPFSHelper`: Subida de documentos a IPFS

4. **Controladores**
   - `CarbonController`: API REST para gestión de carbono

## Flujo de Trabajo Gold Standard

### Etapa 0: Registro del Proyecto
- Usuario registra instalación fotovoltaica
- Sistema valida coordenadas GPS, capacidad, tecnología
- Se genera ID único de proyecto
- Estado inicial: `pending`

### Etapa 1: Línea Base de Emisiones
- Se establece factor de emisión oficial por región
- Por defecto: Colombia = 0.4 kg CO₂/kWh
- Se valida fuente oficial del dato

### Etapa 2: Monitoreo de Datos
- Captura automática de datos de dispositivos
- Almacenamiento en blockchain con timestamp
- Verificación de serial del inversor y coordenadas

### Etapa 3: Reporte de Monitoreo
- Generación automática al alcanzar 1000 kg CO₂
- Creación de PDF con QR code y hash
- Subida a IPFS para inmutabilidad

### Etapa 4: Verificación y Certificación
- Revisión por verificador autorizado
- Validación de datos y metadatos
- Aprobación o rechazo con justificación

### Etapa 5: Emisión del Token GAIA-C
- Tokenización en blockchain Vara
- Metadata completa del certificado
- Asignación automática a wallet del usuario

## Instalación y Configuración

### Dependencias Requeridas

```bash
npm install pdfkit qrcode web3.storage
```

### Variables de Entorno

```env
# IPFS Configuration
WEB3_STORAGE_TOKEN=your_web3_storage_token
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Blockchain Configuration
VARA_NETWORK=wss://testnet.vara.network
GAIA_CONTRACT_ID=0xc403513f83a6d232d8508358b3c4c9f5f03f7cd7241e69ffb657b13bc024b8e6
MNEMONIC=your_vara_mnemonic

# Optional Configuration
EMAIL_NOTIFICATIONS=true
PUSH_NOTIFICATIONS=false
CACHE_ENABLED=false
MONITORING_ENABLED=false
```

## API Endpoints

### Proyectos

```http
POST /carbon/projects
GET /carbon/projects/user/:userId
GET /carbon/projects/:projectId
PUT /carbon/projects/:projectId
```

### Reportes

```http
POST /carbon/projects/:projectId/reports
PUT /carbon/reports/:reportId/submit
PUT /carbon/reports/:reportId/verify
GET /carbon/reports/user/:userId
GET /carbon/reports/project/:projectId
```

### Validación

```http
POST /carbon/projects/:projectId/validate
POST /carbon/reports/:reportId/validate
GET /carbon/validation/stats/:userId
```

### Estadísticas

```http
GET /carbon/stats/carbon/:userId
```

### Blockchain

```http
POST /carbon/reports/:reportId/tokenize
```

## Ejemplos de Uso

### Crear un Proyecto

```javascript
const projectData = {
  name: "Granja Solar Medellín",
  description: "Instalación fotovoltaica comercial de 500kWp",
  gpsCoordinates: {
    latitude: 6.2442,
    longitude: -75.5812
  },
  technologyType: "fotovoltaico",
  capacityInstalled: 500,
  startDate: "2024-01-01",
  devices: [
    {
      serialNumber: "GRW-001-2024",
      brand: "Growatt",
      model: "MTL-XH-110KTL3-X",
      capacity: 110,
      installationDate: "2024-01-01"
    }
  ]
};

const response = await fetch('/carbon/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(projectData)
});
```

### Generar Reporte de Monitoreo

```javascript
const response = await fetch(`/carbon/projects/${projectId}/reports`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log('Reporte generado:', result.report);
console.log('IPFS Hash:', result.ipfsHash);
```

### Tokenizar Crédito de Carbono

```javascript
const response = await fetch(`/carbon/reports/${reportId}/tokenize`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log('Crédito tokenizado:', result.co2Tonnes, 'toneladas');
```

## Validaciones del Sistema

### Validación de Proyecto
- Coordenadas GPS válidas
- Capacidad instalada > 0
- Fecha de inicio válida
- Al menos un dispositivo registrado
- Factor de emisión válido

### Validación de Reporte
- Mínimo 1000 kg CO₂ evitado
- Rango de fechas ≤ 1 año
- Energía generada > 0
- Hash del certificado presente
- Metadatos completos

### Validación de Datos de Energía
- Límite máximo por hora: 10,000 kWh
- Timestamps válidos y secuenciales
- Valores de kWh > 0
- Consistencia temporal

## Factores de Emisión por Región

| País | Factor (kg CO₂/kWh) | Fuente |
|------|---------------------|---------|
| Colombia | 0.40 | Resolución CREG 123/2024 |
| México | 0.45 | SENER 2024 |
| Chile | 0.35 | CNE 2024 |
| Argentina | 0.50 | ENRE 2024 |
| Perú | 0.38 | OSINERGMIN 2024 |
| Ecuador | 0.42 | ARCERNNR 2024 |

## Estructura de Datos

### Proyecto
```javascript
{
  projectId: "GS-USER123-ABC123-XYZ",
  userId: "user123",
  name: "Granja Solar",
  gpsCoordinates: { latitude: 6.2442, longitude: -75.5812 },
  technologyType: "fotovoltaico",
  capacityInstalled: 500,
  goldStandardStatus: "registered",
  emissionFactor: 0.4,
  devices: [...],
  totalEnergyGenerated: 15000,
  totalCO2Avoided: 6000
}
```

### Reporte de Monitoreo
```javascript
{
  projectId: "GS-USER123-ABC123-XYZ",
  userId: "user123",
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2024-01-31T23:59:59Z",
  energyGenerated_kWh: 15000,
  co2Avoided_kg: 6000,
  emissionFactor: 0.4,
  status: "verified",
  certificateHash: "abc123...",
  metadata: {
    gpsCoordinates: "6.2442,-75.5812",
    deviceSerial: "GRW-001-2024",
    deviceBrand: "Growatt"
  }
}
```

## Seguridad y Auditoría

### Log de Auditoría
- Todas las acciones críticas son registradas
- Incluye IP, User-Agent, timestamp
- Hash de blockchain cuando aplica
- Retención configurable (por defecto 1 año)

### Validación de Permisos
- Usuarios solo pueden acceder a sus proyectos
- Verificadores requieren rol específico
- Admins tienen acceso completo
- Middleware de autenticación en todas las rutas

### Inmutabilidad de Datos
- PDFs subidos a IPFS
- Hash del certificado en blockchain
- Versionado de reportes
- Rollback en caso de errores

## Monitoreo y Métricas

### Métricas Disponibles
- Total de proyectos por usuario
- Proyectos certificados vs pendientes
- Reportes generados y verificados
- CO₂ total evitado por usuario
- Score promedio de validación

### Health Checks
- Conexión a MongoDB
- Conexión a blockchain Vara
- Estado del servicio IPFS
- Validación de modelos

## Troubleshooting

### Problemas Comunes

1. **Error de conexión IPFS**
   - Verificar WEB3_STORAGE_TOKEN
   - Revisar conectividad de red
   - Verificar límites de API

2. **Error de validación de proyecto**
   - Verificar coordenadas GPS
   - Comprobar capacidad instalada
   - Validar dispositivos registrados

3. **Error de blockchain**
   - Verificar conexión a Vara
   - Comprobar MNEMONIC
   - Validar contract ID

4. **Error de generación de PDF**
   - Verificar dependencias (pdfkit, qrcode)
   - Comprobar permisos de escritura
   - Validar datos del reporte

### Logs del Sistema
- MongoDB: Conexión y queries
- Blockchain: Transacciones y errores
- IPFS: Subidas y descargas
- Validación: Scores y errores
- Auditoría: Todas las acciones

## Roadmap y Mejoras Futuras

### Fase 1 (Implementada)
- ✅ Modelos básicos
- ✅ Servicios core
- ✅ Generación de PDFs
- ✅ Subida a IPFS
- ✅ Validaciones Gold Standard

### Fase 2 (Próximamente)
- 🔄 Integración con dispositivos reales
- 🔄 Dashboard de monitoreo
- 🔄 Notificaciones automáticas
- 🔄 API de terceros

### Fase 3 (Futuro)
- 📋 Integración directa con Gold Standard
- 📋 Marketplace de créditos
- 📋 Análisis avanzado de datos
- 📋 Machine Learning para predicciones

## Soporte y Contacto

Para soporte técnico o preguntas sobre la implementación:

- **Documentación**: Este archivo
- **Issues**: Repositorio del proyecto
- **Email**: soporte@gaia.com
- **Discord**: Comunidad GAIA

## Licencia

Este sistema está bajo la licencia MIT. Ver archivo LICENSE para más detalles.

---

**Nota**: Esta implementación cumple con los estándares Gold Standard para créditos de carbono y está diseñada para ser auditada por terceros independientes.
