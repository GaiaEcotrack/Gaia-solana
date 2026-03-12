# 🚀 Guía de Deployment - Gaia Renewable Energy Credits

## 📋 Resumen del Proyecto

Gaia RECs es un sistema de certificados de energía renovable (RECs) construido sobre Solana usando Token-2022. El proyecto permite:

1. **Registro de dispositivos** de energía renovable
2. **Reportes de energía** verificados por oráculo
3. **Mint de RECs** como tokens Token-2022
4. **Transferencia de RECs** con transfer hooks
5. **Retiro/consumo** de RECs para cumplimiento

## 🏗️ Arquitectura Técnica

### Smart Contracts (Anchor)
```
programs/gaia-recs/
├── src/
│   ├── instructions/           # 5 instrucciones
│   │   ├── register_device.rs  # Registro dispositivo
│   │   ├── submit_report.rs    # Reporte energía
│   │   ├── mint_recs.rs        # Mint RECs (Token-2022)
│   │   ├── transfer_rec.rs     # Transferencia
│   │   └── retire_rec.rs       # Retiro/consumo
│   ├── state/                  # Structs de datos
│   ├── events.rs               # Sistema de eventos
│   └── lib.rs                  # Programa principal
```

### Backend (Node.js/TypeScript)
```
backend/
├── src/
│   ├── config/solana.ts       # Configuración Solana
│   ├── services/oracle.ts     # Servicio de firma
│   ├── controllers/           # Controladores API
│   └── routes/                # Rutas REST
```

### Frontend (React/Vite)
```
frontend/
├── src/                       # Código fuente React
├── public/                    # Assets estáticos
└── package.json              # Dependencias
```

## 🔧 Prerrequisitos

### 1. Instalar Dependencias del Sistema
```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.17/install)"

# Rust y Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Node.js 18+
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
```

### 2. Configurar Wallet
```bash
# Generar nueva wallet
solana-keygen new

# Configurar red devnet
solana config set --url https://api.devnet.solana.com

# Solicitar airdrop (si es necesario)
solana airdrop 2
```

## 🚀 Deployment Paso a Paso

### Paso 1: Crear Mint de Token-2022
```bash
# Instalar dependencias del script
cd ~/gaia-solana-migration
npm install @solana/web3.js @solana/spl-token

# Ejecutar script para crear mint
node scripts/create_token_2022_mint.js
```

El script creará:
- Mint de Token-2022 con extensiones
- Archivo `token-mint-info.json` con detalles
- Actualización automática de `.env`

### Paso 2: Compilar Programa Anchor
```bash
# Navegar al directorio del proyecto
cd ~/gaia-solana-migration

# Compilar programa
anchor build

# Verificar compilación exitosa
ls -la target/deploy/gaia_recs.so
```

### Paso 3: Obtener Program ID
```bash
# Obtener el nuevo program ID
solana address -k target/deploy/gaia_recs-keypair.json

# Actualizar declare_id! en lib.rs
# Reemplazar "GAIA_RECS_PROGRAM_ID" con la nueva address
```

### Paso 4: Actualizar Configuración
```bash
# Actualizar Anchor.toml
# Reemplazar "GAIA_RECS_PROGRAM_ID" con la address real

# Actualizar ADMIN_PUBKEY en lib.rs
# Usar tu wallet address como administrador
```

### Paso 5: Deployar a Devnet
```bash
# Deployar programa
anchor deploy

# Verificar deployment
solana program show <PROGRAM_ID>
```

### Paso 6: Configurar Backend
```bash
# Instalar dependencias
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

### Paso 7: Configurar Frontend
```bash
# Instalar dependencias
cd frontend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con PROGRAM_ID y RPC_URL

# Iniciar servidor de desarrollo
npm run dev
```

## 🔗 Endpoints del Backend

### Oracle Service
```
POST   /api/oracle/sign           # Firmar reporte de energía
POST   /api/oracle/verify         # Verificar firma
POST   /api/oracle/generate-report-id  # Generar ID único
GET    /api/oracle/info           # Información del oráculo
GET    /api/oracle/health         # Salud del servicio
```

### Health Check
```
GET    /health                    # Salud general
```

## 📊 Testing

### Smart Contracts
```bash
# Ejecutar tests de integración
cd programs/gaia-recs
cargo test

# Ejecutar tests específicos
cargo test test_register_device
cargo test test_submit_energy_report
```

### Backend
```bash
# Ejecutar tests del oráculo
cd backend
node test-oracle.js

# Verificar endpoints manualmente
curl http://localhost:3001/health
curl http://localhost:3001/api/oracle/info
```

### Frontend
```bash
# Ejecutar tests (cuando estén implementados)
cd frontend
npm test
```

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Build y tests
anchor build
anchor test

# Linting y formato
cargo fmt --all
cargo clippy --all-targets --all-features -- -D warnings

# Limpiar build
anchor clean
```

### Blockchain
```bash
# Verificar balance
solana balance

# Verificar programa deployado
solana program show <PROGRAM_ID>

# Verificar cuenta
solana account <ACCOUNT_ADDRESS>

# Verificar logs
solana logs <PROGRAM_ID>
```

### Debugging
```bash
# Verificar transacciones fallidas
solana confirm <SIGNATURE> --verbose

# Explorar en Solana Explorer
https://explorer.solana.com/address/<ADDRESS>?cluster=devnet

# Explorar en Solscan
https://solscan.io/token/<TOKEN_ADDRESS>?cluster=devnet
```

## 🔐 Seguridad y Configuración

### Variables de Entorno Críticas
```env
# Backend (.env)
SOLANA_RPC_URL=https://api.devnet.solana.com
ADMIN_WALLET_PATH=/home/ilich/.config/solana/id.json
GAIA_REC_TOKEN_MINT=<TOKEN_MINT_ADDRESS>
PROGRAM_ID=<PROGRAM_ADDRESS>

# Frontend (.env)
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROGRAM_ID=<PROGRAM_ADDRESS>
VITE_TOKEN_MINT=<TOKEN_MINT_ADDRESS>
```

### Configuración de Transfer Hooks
```bash
# Configurar transfer hook en el mint
# Esto requiere interacción con el programa Token-2022
# Consultar documentación de @solana/spl-token
```

## 🚨 Solución de Problemas

### Error: "Insufficient Balance"
```bash
# Solicitar airdrop
solana airdrop 2

# Verificar balance
solana balance
```

### Error: "Program Failed to Deploy"
```bash
# Verificar espacio de rent
solana rent <BYTES_REQUIRED>

# Verificar compilación
anchor build --verbose

# Verificar logs de deployment
anchor deploy --verbose
```

### Error: "Anchor.toml Not Found"
```bash
# Crear Anchor.toml si no existe
cp Anchor.toml.example Anchor.toml
# Editar con tu configuración
```

### Error: "Dependencies Missing"
```bash
# Actualizar dependencias Rust
cargo update

# Reinstalar Anchor
avm install latest
avm use latest

# Reinstalar dependencias Node.js
rm -rf node_modules package-lock.json
npm install
```

## 📈 Monitoreo y Mantenimiento

### Verificar Estado del Programa
```bash
# Verificar programa deployado
solana program show <PROGRAM_ID>

# Verificar cuentas del programa
solana program accounts <PROGRAM_ID>

# Verificar logs recientes
solana logs <PROGRAM_ID> --num 10
```

### Verificar Estado del Token
```bash
# Verificar mint
solana account <TOKEN_MINT_ADDRESS>

# Verificar supply
spl-token supply <TOKEN_MINT_ADDRESS>

# Verificar holders
spl-token accounts <TOKEN_MINT_ADDRESS>
```

### Backup y Recuperación
```bash
# Backup de keypairs
cp -r ~/.config/solana/ ~/backup-solana-keys/

# Backup de configuración
cp Anchor.toml Anchor.toml.backup
cp .env .env.backup

# Restaurar desde backup
cp ~/backup-solana-keys/id.json ~/.config/solana/
```

## 🎯 Próximos Pasos

### 1. Production Deployment
- Migrar de devnet a mainnet-beta
- Configurar RPC endpoints de producción
- Implementar monitoreo y alertas
- Configurar backup automático

### 2. Mejoras de Seguridad
- Implementar multisig para administración
- Configurar transfer hooks completos
- Auditoría de seguridad del código
- Implementar rate limiting

### 3. Escalabilidad
- Optimizar espacio de cuentas
- Implementar paginación de queries
- Configurar CDN para frontend
- Implementar caching

### 4. Integraciones
- Integrar con exchanges de RECs
- Conectar con APIs de energía renovable
- Implementar KYC/AML para transferencias
- Integrar con sistemas de reporting

## 📞 Soporte y Contacto

### Recursos
- [Documentación de Solana](https://docs.solana.com/)
- [Documentación de Anchor](https://www.anchor-lang.com/)
- [Token-2022 Documentation](https://spl.solana.com/token-2022)
- [GitHub del Proyecto](https://github.com/tu-usuario/gaia-recs)

### Comunidad
- Discord: #gaia-recs
- Twitter: @GaiaRECs
- Email: soporte@gaia-ecotrack.com

---

**Última actualización:** 11 Marzo 2026  
**Versión:** 1.0.0  
**Estado:** 🟢 Listo para Deployment