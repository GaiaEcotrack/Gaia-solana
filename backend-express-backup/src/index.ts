import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import oracleRoutes from './routes/oracleRoutes';

// Cargar variables de entorno
dotenv.config();

// Configuración
const PORT = process.env.PORT || 3001;
const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Gaia RECs Backend',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ruta de información del proyecto
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Gaia Renewable Energy Credits',
        description: 'Tokenization of renewable energy generation on Solana',
        version: '1.0.0',
        features: [
            'Token-2022 with Transfer Hooks',
            'Oracle-verified energy reports',
            'PostgreSQL + Prisma backend',
            'REST API for device management'
        ],
        team: ['Ilich (Backend/Smart Contracts)', 'Nico (Frontend)'],
        timeline: '11-14 March 2026 (Hackathon MVP)'
    });
});

// Rutas del oráculo
app.use('/api/oracle', oracleRoutes);

// Manejo de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
  🚀 Gaia RECs Backend iniciado
  📍 Puerto: ${PORT}
  🌍 Entorno: ${process.env.NODE_ENV || 'development'}
  🗓️  Fecha: ${new Date().toLocaleString()}
  
  📊 Endpoints disponibles:
  - GET /health → Estado del servicio
  - GET /api/info → Información del proyecto
  - POST /api/oracle/sign → Firmar reporte de energía
  - POST /api/oracle/verify → Verificar firma
  - GET /api/oracle/health → Salud del oráculo
  
  🔗 Próximos pasos:
  1. Configurar PostgreSQL: docker run -d --name gaia-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=gaia_recs postgres:16
  2. Ejecutar migraciones: npx prisma migrate dev
  3. Implementar servicios de oráculo y blockchain
  `);
});

export default app;