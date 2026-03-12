import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { SignReportDto, SignedReportResponseDto } from './dto/sign-report.dto';

@Injectable()
export class OracleService {
    private readonly logger = new Logger(OracleService.name);
    private oraclePrivateKey: string;
    private oraclePublicKey: string;

    constructor(private configService: ConfigService) {
        this.oraclePrivateKey = this.configService.get<string>('ORACLE_PRIVATE_KEY', 'default_oracle_key');
        this.oraclePublicKey = this.configService.get<string>('ORACLE_PUBLIC_KEY', 'default_oracle_public_key');

        this.logger.log('Oracle service initialized');
    }

    /**
     * Generate a unique report ID
     */
    generateReportId(deviceId: string, timestamp: string): string {
        const data = `${deviceId}_${timestamp}_${Date.now()}`;
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        return `report_${hash.substring(0, 16)}`;
    }

    /**
     * Sign an energy report with oracle signature
     */
    async signEnergyReport(reportData: SignReportDto): Promise<SignedReportResponseDto> {
        this.logger.log(`Signing energy report for device: ${reportData.deviceId}`);

        // Validate report data
        this.validateReportData(reportData);

        // Generate unique report ID
        const reportId = this.generateReportId(reportData.deviceId, reportData.timestamp);

        // Create signature
        const signature = this.createSignature(reportData, reportId);

        // Create response
        const response: SignedReportResponseDto = {
            reportId,
            signature,
            oraclePublicKey: this.oraclePublicKey,
            signedAt: new Date().toISOString(),
            reportData,
        };

        this.logger.log(`Report signed successfully: ${reportId}`);
        return response;
    }

    /**
     * Verify a signature
     */
    async verifySignature(
        reportData: SignReportDto,
        reportId: string,
        signature: string,
        oraclePublicKey: string,
    ): Promise<boolean> {
        try {
            // Recreate the signed data
            const dataToVerify = this.createDataToSign(reportData, reportId);

            // Verify signature (simplified - in production use proper cryptographic verification)
            const expectedSignature = this.createSignature(reportData, reportId);

            return signature === expectedSignature && oraclePublicKey === this.oraclePublicKey;
        } catch (error) {
            this.logger.error(`Signature verification failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Get oracle information
     */
    getOracleInfo() {
        return {
            oraclePublicKey: this.oraclePublicKey,
            serviceName: 'Gaia Renewable Energy Oracle',
            version: '1.0.0',
            supportedEnergyTypes: ['solar', 'wind', 'hydro', 'geothermal'],
            maxEnergyPerReport: 10000, // kWh
            minEnergyPerReport: 0.1, // kWh
            active: true,
            lastHealthCheck: new Date().toISOString(),
        };
    }

    /**
     * Health check for oracle service
     */
    healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'oracle',
            version: '1.0.0',
            uptime: process.uptime(),
        };
    }

    /**
     * Validate report data
     */
    private validateReportData(reportData: SignReportDto): void {
        // Check energy generated
        if (reportData.energyGenerated <= 0) {
            throw new Error('Energy generated must be greater than 0');
        }

        if (reportData.energyGenerated > 10000) {
            throw new Error('Energy generated exceeds maximum limit of 10,000 kWh');
        }

        // Check timestamp
        const reportDate = new Date(reportData.timestamp);
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

        if (reportDate > now) {
            throw new Error('Report timestamp cannot be in the future');
        }

        if (reportDate < oneYearAgo) {
            throw new Error('Report timestamp is too old (more than 1 year)');
        }

        // Check device ID format
        if (!reportData.deviceId || reportData.deviceId.length < 5) {
            throw new Error('Invalid device ID');
        }
    }

    /**
     * Create data string for signing
     */
    private createDataToSign(reportData: SignReportDto, reportId: string): string {
        return JSON.stringify({
            reportId,
            deviceId: reportData.deviceId,
            energyGenerated: reportData.energyGenerated,
            timestamp: reportData.timestamp,
            location: reportData.location || 'unknown',
            energyType: reportData.energyType || 'solar',
        });
    }

    /**
     * Create signature for data
     */
    private createSignature(reportData: SignReportDto, reportId: string): string {
        const dataToSign = this.createDataToSign(reportData, reportId);

        // In production, use proper cryptographic signing
        // For now, create a deterministic hash-based signature
        const hmac = crypto.createHmac('sha256', this.oraclePrivateKey);
        hmac.update(dataToSign);

        return `0x${hmac.digest('hex')}`;
    }
}