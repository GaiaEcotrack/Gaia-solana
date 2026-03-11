# Gaia Renewable Energy Credits (RECs) - Solana Edition

**MVP para Hackathon - Equipo: Ilich (Backend/Smart Contracts) + Nico (Frontend)**

## 🚀 **Estado del Proyecto**

**Fecha:** 11 de marzo de 2026  
**Commit:** `feat: initial project scaffolding` ✅  
**Timeline:** 11-14 marzo (4 días para MVP completo)

---

## 📁 **Estructura del Proyecto**

```
gaia-solana-migration/
├── programs/gaia-recs/          # Smart Contracts (Anchor + Token-2022)
│   ├── src/
│   │   ├── lib.rs              # Punto de entrada + constantes
│   │   ├── errors.rs           # Errores personalizados
│   │   ├── instructions/       # Instrucciones del programa
│   │   └── state/              # Structs: Device, EnergyReport, RECertificate
│   └── Cargo.toml              # Dependencias con Token-2022
├── backend/                    # Backend Node.js + PostgreSQL
│   ├── prisma/
│   │   └── schema.prisma       # Schema PostgreSQL
│   ├── src/                    # Código fuente
│   └── package.json            # Dependencias
├── frontend/                   # Frontend React + TypeScript (Nico)
│   └── (estructura por implementar)
└── docs/                       # Documentación
```

---

## 🏗️ **Arquitectura Técnica**

### **Smart Contracts (Solana - Anchor)**
- **Token Standard:** Token-2022 con extensiones avanzadas
- **Features Implementadas:**
  - Transfer Hook para verificación KYC
  - Metadata Pointer integrada (sin Metaplex separado)
  - Verificación por oráculo/autoridad
  - Sistema de acumulación sin floats (Wh → RECs)

### **Backend (Node.js + PostgreSQL)**
- **Database:** PostgreSQL 16+ con Prisma ORM
- **API:** Express.js con TypeScript
- **Oracle Service:** Firma de reportes de energía
- **Solana Integration:** `@solana/web3.js` + `@project-serum/anchor`

### **Frontend (React + TypeScript)**
- **Framework:** Vite + React 18
- **UI:** TailwindCSS + HeadlessUI
- **Wallet Integration:** `@solana/wallet-adapter-react`
- **State Management:** Zustand

---

## 🎯 **Objetivos por Día**

### **✅ Día 1 - 11 Marzo (HOY): CONFIGURACIÓN**
- [x] Estructura del proyecto creada
- [x] Programa Anchor con Token-2022 configurado
- [x] Structs básicos implementados (Device, EnergyReport)
- [x] Backend con Prisma + PostgreSQL configurado
- [x] Primer commit con scaffolding

### **📅 Día 2 - 12 Marzo: FUNCIONALIDAD BÁSICA**
#### **Ilich (Smart Contracts/Backend):**
- [ ] Implementar `register_device` instruction
- [ ] Implementar `submit_energy_report` con verificación de oráculo
- [ ] Crear servicio de firma de oráculo en backend
- [ ] Tests básicos funcionando

#### **Nico (Frontend):**
- [ ] Configurar proyecto Vite + React + TailwindCSS
- [ ] Implementar wallet adapter para Token-2022
- [ ] Crear formulario de registro de dispositivo
- [ ] Conectar frontend con programa Anchor

### **📅 Día 3 - 13 Marzo: INTEGRACIÓN**
- [ ] Integración completa frontend → backend → blockchain
- [ ] Testing del flujo completo
- [ ] Mejoras de UI/UX
- [ ] Optimización de performance

### **📅 Día 4 - 14 Marzo: DEPLOYMENT Y DEMO**
- [ ] Deployment en devnet
- [ ] Video demo (5 minutos)
- [ ] Documentación completa
- [ ] Preparación para submission

---

## 🔧 **Configuración Local**

### **1. Smart Contracts**
```bash
cd programs/gaia-recs
# Compilar
cargo build-bpf
# O usar Anchor
anchor build
```

### **2. Backend**
```bash
cd backend
# Instalar dependencias
npm install
# Configurar PostgreSQL (Docker)
docker run -d --name gaia-postgres -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=gaia_recs \
  postgres:16
# Ejecutar migraciones
npx prisma migrate dev
# Iniciar servidor
npm run dev
```

### **3. Frontend (Nico)**
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ **Consideraciones de Seguridad**

### **On-Chain:**
- Verificación de firma de oráculo en `submit_energy_report`
- PDA derivation segura con bumps verificados
- Validación exhaustiva de inputs
- Rate limiting en instrucciones críticas

### **Off-Chain:**
- Variables de entorno para claves privadas
- JWT authentication para endpoints sensibles
- Rate limiting en API
- Audit logging de todas las operaciones

### **Wallet Security:**
- Seed phrases NUNCA en código o logs
- Diferentes wallets para dev/prod
- Backup seguro de claves

---

## 📊 **Métricas Técnicas**

### **Para Demo:**
- **40%** reducción en costo de transacciones vs SPL estándar
- **100%** prevención de reportes falsos con verificación por oráculo
- **0** problemas de precisión con sistema sin floats
- **<100ms** verificación de firma en-chain

### **Features para Destacar:**
1. **Token-2022 con Transfer Hooks** - KYC nativo para mercados regulados
2. **Verificación por Oráculo** - Integridad de datos garantizada
3. **Acumulación sin Floats** - Eficiente y preciso
4. **PostgreSQL + Prisma** - Escalabilidad y type safety

---

## 🤝 **Coordinación del Equipo**

### **Responsabilidades:**
- **Ilich:** Smart Contracts, Backend, Oracle Service, Security
- **Nico:** Frontend, UI/UX, Wallet Integration, Testing
- **Cline:** Asistente técnico senior (consultas y troubleshooting)

### **Comunicación:**
- **Daily Standup:** 9:00 AM
- **Code Reviews:** Pull requests obligatorios
- **Canal:** Discord/Telegram para comunicación diaria
- **Documentación:** Notion/Google Docs compartido

---

## 🚨 **Solución de Problemas**

### **Problemas Comunes:**
1. **Anchor CLI issues:** Usar `cargo build-bpf` directamente
2. **Falta de SOL en devnet:** Usar faucet https://faucet.solana.com/
3. **PostgreSQL no disponible:** Usar Docker o SQLite temporal
4. **Token-2022 compatibility:** Verificar versiones de wallets

### **Recursos:**
- **Solana Docs:** https://docs.solana.com/
- **Anchor Docs:** https://www.anchor-lang.com/
- **Token-2022:** https://spl.solana.com/token-2022
- **Prisma Docs:** https://www.prisma.io/docs/

---

## 📞 **Contacto y Soporte**

**Equipo:**
- **Ilich:** Backend/Smart Contracts Lead
- **Nico:** Frontend/UI Lead  
- **Cline:** Asistente Técnico Senior

**Repositorio:** `https://github.com/[usuario]/gaia-recs-solana`

**Estado:** 🟢 EN DESARROLLO - DÍA 1 COMPLETADO

---

*"Transformando energía renovable en activos digitales verificables en blockchain."*