import { Keypair, PublicKey } from '@solana/web3.js';
import { createHash } from 'crypto';
import * as solanaConfig from '../config/solana';

// Interfaz para datos del reporte de energía
export interface EnergyReportData {
    deviceId: string;
    deviceOwner: string;
    periodStart: number; // timestamp Unix
    periodEnd: number;   // timestamp Unix
    energyWh: number;
    reportId: string;
    additionalData?: Record<string, any>;
}

// Interfaz para firma verificada
export interface VerifiedSignature {
    signature: number[]; // Array de 64 bytes
    publicKey: string;
    timestamp: number;
    reportHash: string;
}

// Servicio de oráculo para firmar reportes de energía
export class OracleService {
    private oracleWallet: Keypair;

    constructor() {
        this.oracleWallet = solanaConfig.getOracleWallet();
    }

    // Obtener la clave pública del oráculo
    getPublicKey(): PublicKey {
        return this.oracleWallet.publicKey;
    }

    // Generar hash único para un reporte de energía
    generateReportHash(data: EnergyReportData): string {
        const reportString = JSON.stringify({
            deviceId: data.deviceId,
            deviceOwner: data.deviceOwner,
            periodStart: data.periodStart,
            periodEnd: data.periodEnd,
            energyWh: data.energyWh,
            reportId: data.reportId,
            additionalData: data.additionalData || {},
        });

        return createHash('sha256')
            .update(reportString)
            .digest('hex');
    }

    // Firmar un reporte de energía
    async signEnergyReport(data: EnergyReportData): Promise<VerifiedSignature> {
        try {
            // Generar hash del reporte
            const reportHash = this.generateReportHash(data);

            // En un entorno real, aquí firmaríamos con la clave privada del oráculo
            // Por ahora, simulamos una firma para desarrollo
            const timestamp = Math.floor(Date.now() / 1000);

            // Crear una firma simulada (en producción usaríamos crypto.sign)
            const simulatedSignature = this.createSimulatedSignature(reportHash, timestamp);

            return {
                signature: Array.from(simulatedSignature),
                publicKey: this.oracleWallet.publicKey.toBase58(),
                timestamp,
                reportHash,
            };
        } catch (error: any) {
            console.error('Error firmando reporte de energía:', error);
            throw new Error(`No se pudo firmar el reporte: ${error.message}`);
        }
    }

    // Verificar una firma (para testing)
    verifySignature(
        reportHash: string,
        signature: number[],
        publicKey: string
    ): boolean {
        try {
            // En producción, verificaríamos la firma criptográficamente
            // Por ahora, solo verificamos que la clave pública sea la del oráculo
            const oraclePubKey = this.oracleWallet.publicKey.toBase58();
            return publicKey === oraclePubKey;
        } catch (error) {
            console.error('Error verificando firma:', error);
            return false;
        }
    }

    // Crear firma simulada para desarrollo
    private createSimulatedSignature(reportHash: string, timestamp: number): Uint8Array {
        // En desarrollo, creamos una firma simulada
        // En producción, usaríamos: this.oracleWallet.secretKey para firmar
        const signature = new Uint8Array(64);

        // Llenar con valores derivados del hash (simulación)
        const hashBuffer = Buffer.from(reportHash, 'hex');
        for (let i = 0; i < 64 && i < hashBuffer.length; i++) {
            signature[i] = hashBuffer[i] ^ (timestamp & 0xFF);
        }

        return signature;
    }

    // Validar datos del reporte
    validateReportData(data: EnergyReportData): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Validar campos requeridos
        if (!data.deviceId || data.deviceId.length > 50) {
            errors.push('deviceId es requerido y máximo 50 caracteres');
        }

        if (!data.deviceOwner || !solanaConfig.isValidSolanaAddress(data.deviceOwner)) {
            errors.push('deviceOwner es requerido y debe ser una address de Solana válida');
        }

        if (!data.periodStart || !data.periodEnd) {
            errors.push('periodStart y periodEnd son requeridos');
        } else if (data.periodEnd <= data.periodStart) {
            errors.push('periodEnd debe ser mayor que periodStart');
        }

        if (!data.energyWh || data.energyWh <= 0) {
            errors.push('energyWh debe ser un número positivo');
        } else if (data.energyWh > 1_000_000_000) { // 1 GWh máximo
            errors.push('energyWh no puede exceder 1,000,000,000 Wh (1 GWh)');
        }

        if (!data.reportId || data.reportId.length > 50) {
            errors.push('reportId es requerido y máximo 50 caracteres');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    // Calcular RECs basados en energía
    calculateRECs(energyWh: number): number {
        return solanaConfig.whToRECs(energyWh);
    }

    // Generar ID de reporte único
    generateReportId(deviceId: string, periodStart: number): string {
        const timestamp = Math.floor(Date.now() / 1000);
        const random = Math.random().toString(36).substring(2, 8);
        return `report_${deviceId}_${periodStart}_${timestamp}_${random}`;
    }
}

// Instancia singleton del servicio de oráculo
let oracleServiceInstance: OracleService | null = null;

export function getOracleService(): OracleService {
    if (!oracleServiceInstance) {
        oracleServiceInstance = new OracleService();
    }
    return oracleServiceInstance;
}

export default {
    OracleService,
    getOracleService,
    type EnergyReportData,
    type VerifiedSignature,
};