import { Request, Response } from 'express';
import { getOracleService, EnergyReportData } from '../services/oracle';

// Controlador para el servicio de oráculo
export class OracleController {
    // Endpoint para firmar un reporte de energía
    static async signEnergyReport(req: Request, res: Response) {
        try {
            const reportData: EnergyReportData = req.body;

            // Validar datos del reporte
            const oracleService = getOracleService();
            const validation = oracleService.validateReportData(reportData);

            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors,
                });
            }

            // Firmar el reporte
            const signature = await oracleService.signEnergyReport(reportData);

            // Calcular RECs generados
            const recsGenerated = oracleService.calculateRECs(reportData.energyWh);

            return res.status(200).json({
                success: true,
                data: {
                    signature,
                    reportData,
                    recsGenerated,
                    oraclePublicKey: oracleService.getPublicKey().toBase58(),
                    timestamp: Math.floor(Date.now() / 1000),
                },
            });
        } catch (error: any) {
            console.error('Error en signEnergyReport:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: error.message,
            });
        }
    }

    // Endpoint para verificar una firma
    static async verifySignature(req: Request, res: Response) {
        try {
            const { reportHash, signature, publicKey } = req.body;

            if (!reportHash || !signature || !publicKey) {
                return res.status(400).json({
                    success: false,
                    error: 'Faltan parámetros requeridos: reportHash, signature, publicKey',
                });
            }

            const oracleService = getOracleService();
            const isValid = oracleService.verifySignature(reportHash, signature, publicKey);

            return res.status(200).json({
                success: true,
                data: {
                    isValid,
                    verifiedBy: oracleService.getPublicKey().toBase58(),
                    timestamp: Math.floor(Date.now() / 1000),
                },
            });
        } catch (error: any) {
            console.error('Error en verifySignature:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: error.message,
            });
        }
    }

    // Endpoint para obtener información del oráculo
    static async getOracleInfo(req: Request, res: Response) {
        try {
            const oracleService = getOracleService();

            return res.status(200).json({
                success: true,
                data: {
                    oraclePublicKey: oracleService.getPublicKey().toBase58(),
                    network: process.env.SOLANA_NETWORK || 'devnet',
                    service: 'Gaia RECs Oracle Service',
                    version: '1.0.0',
                    endpoints: {
                        signEnergyReport: 'POST /api/oracle/sign',
                        verifySignature: 'POST /api/oracle/verify',
                        getInfo: 'GET /api/oracle/info',
                    },
                    timestamp: Math.floor(Date.now() / 1000),
                },
            });
        } catch (error: any) {
            console.error('Error en getOracleInfo:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: error.message,
            });
        }
    }

    // Endpoint para generar un ID de reporte
    static async generateReportId(req: Request, res: Response) {
        try {
            const { deviceId, periodStart } = req.body;

            if (!deviceId || !periodStart) {
                return res.status(400).json({
                    success: false,
                    error: 'Faltan parámetros requeridos: deviceId, periodStart',
                });
            }

            const oracleService = getOracleService();
            const reportId = oracleService.generateReportId(deviceId, periodStart);

            return res.status(200).json({
                success: true,
                data: {
                    reportId,
                    deviceId,
                    periodStart,
                    generatedAt: Math.floor(Date.now() / 1000),
                },
            });
        } catch (error: any) {
            console.error('Error en generateReportId:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: error.message,
            });
        }
    }

    // Endpoint de salud del oráculo
    static async healthCheck(req: Request, res: Response) {
        try {
            const oracleService = getOracleService();

            return res.status(200).json({
                success: true,
                data: {
                    status: 'healthy',
                    service: 'Gaia RECs Oracle',
                    oraclePublicKey: oracleService.getPublicKey().toBase58(),
                    timestamp: Math.floor(Date.now() / 1000),
                    uptime: process.uptime(),
                },
            });
        } catch (error: any) {
            console.error('Error en healthCheck:', error);
            return res.status(500).json({
                success: false,
                status: 'unhealthy',
                error: error.message,
                timestamp: Math.floor(Date.now() / 1000),
            });
        }
    }
}

export default OracleController;