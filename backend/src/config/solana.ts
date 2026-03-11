import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Solana
export const SOLANA_CONFIG = {
    // URLs de RPC
    rpcUrl: process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
    wsUrl: process.env.SOLANA_WS_URL || 'wss://api.devnet.solana.com',

    // Network
    network: process.env.SOLANA_NETWORK || 'devnet',

    // Program IDs (actualizar después del deployment)
    programId: new PublicKey(process.env.GAIA_RECS_PROGRAM_ID || '11111111111111111111111111111111'),
    tokenMint: new PublicKey(process.env.GAIA_REC_TOKEN_MINT || '11111111111111111111111111111111'),

    // Wallet del administrador/oráculo
    adminPublicKey: new PublicKey(process.env.ADMIN_WALLET_PUBLIC_KEY || '4ojkYoX1uzf12i5qiX4gJs4hYkSBp2oAahCV3rrxy4fS'),
    oraclePublicKey: new PublicKey(process.env.ORACLE_PUBLIC_KEY || '4ojkYoX1uzf12i5qiX4gJs4hYkSBp2oAahCV3rrxy4fS'),

    // Constantes del programa
    recConversionFactor: 1_000_000, // 1 REC = 1,000,000 Wh (1 MWh)
    recDecimals: 6,
    recExpiryDays: 365, // 1 año
};

// Inicializar conexión a Solana
export function getSolanaConnection(): Connection {
    return new Connection(SOLANA_CONFIG.rpcUrl, {
        commitment: 'confirmed',
        wsEndpoint: SOLANA_CONFIG.wsUrl,
    });
}

// Cargar wallet desde variable de entorno o archivo
export function getAdminWallet(): Keypair {
    const privateKey = process.env.ADMIN_WALLET_PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('ADMIN_WALLET_PRIVATE_KEY no está configurada en .env');
    }

    try {
        // Intentar parsear como array JSON
        const privateKeyArray = JSON.parse(privateKey);
        return Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
    } catch (error) {
        // Si no es JSON, intentar como base58
        try {
            return Keypair.fromSecretKey(
                new Uint8Array(Buffer.from(privateKey, 'base64'))
            );
        } catch (e) {
            throw new Error('Formato de clave privada inválido. Usa JSON array o base64.');
        }
    }
}

// Cargar wallet del oráculo
export function getOracleWallet(): Keypair {
    const privateKey = process.env.ORACLE_PRIVATE_KEY;

    if (!privateKey) {
        // Si no hay clave específica de oráculo, usar la del admin
        return getAdminWallet();
    }

    try {
        const privateKeyArray = JSON.parse(privateKey);
        return Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
    } catch (error) {
        try {
            return Keypair.fromSecretKey(
                new Uint8Array(Buffer.from(privateKey, 'base64'))
            );
        } catch (e) {
            throw new Error('Formato de clave privada de oráculo inválido.');
        }
    }
}

// Crear provider de Anchor
export function getAnchorProvider(): AnchorProvider {
    const connection = getSolanaConnection();
    const wallet = getAdminWallet();

    return new AnchorProvider(connection, wallet as any, {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
    });
}

// Helper para calcular PDAs
export async function findPDA(
    seeds: Buffer[],
    programId: PublicKey = SOLANA_CONFIG.programId
): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(seeds, programId);
}

// Helper para calcular PDA de dispositivo
export async function findDevicePDA(
    owner: PublicKey,
    deviceId: string
): Promise<[PublicKey, number]> {
    return findPDA([
        Buffer.from('device'),
        owner.toBuffer(),
        Buffer.from(deviceId),
    ]);
}

// Helper para calcular PDA de reporte de energía
export async function findEnergyReportPDA(
    device: PublicKey,
    reportId: string
): Promise<[PublicKey, number]> {
    return findPDA([
        Buffer.from('energy_report'),
        device.toBuffer(),
        Buffer.from(reportId),
    ]);
}

// Helper para calcular PDA de certificado REC
export async function findRECertificatePDA(
    certificateId: string
): Promise<[PublicKey, number]> {
    return findPDA([
        Buffer.from('rec_certificate'),
        Buffer.from(certificateId),
    ]);
}

// Validar address de Solana
export function isValidSolanaAddress(address: string): boolean {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
}

// Convertir Wh a RECs
export function whToRECs(wh: number): number {
    return Math.floor(wh / SOLANA_CONFIG.recConversionFactor);
}

// Convertir RECs a Wh
export function recsToWh(recs: number): number {
    return recs * SOLANA_CONFIG.recConversionFactor;
}

// Calcular fecha de expiración (timestamp Unix)
export function calculateExpiryDate(generationDate?: number): number {
    const now = generationDate || Math.floor(Date.now() / 1000);
    return now + (SOLANA_CONFIG.recExpiryDays * 24 * 60 * 60);
}

export default {
    SOLANA_CONFIG,
    getSolanaConnection,
    getAdminWallet,
    getOracleWallet,
    getAnchorProvider,
    findPDA,
    findDevicePDA,
    findEnergyReportPDA,
    findRECertificatePDA,
    isValidSolanaAddress,
    whToRECs,
    recsToWh,
    calculateExpiryDate,
};