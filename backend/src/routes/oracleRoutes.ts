import { Router } from 'express';
import OracleController from '../controllers/oracleController';

const router = Router();

// Rutas del servicio de oráculo
router.post('/sign', OracleController.signEnergyReport);
router.post('/verify', OracleController.verifySignature);
router.post('/generate-report-id', OracleController.generateReportId);
router.get('/info', OracleController.getOracleInfo);
router.get('/health', OracleController.healthCheck);

export default router;