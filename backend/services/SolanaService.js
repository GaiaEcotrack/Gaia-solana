const { Connection, PublicKey, Keypair, clusterApiUrl } = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

class SolanaService {
    constructor() {
        this.connection = new Connection(process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'), 'confirmed');
        this.programId = new PublicKey(process.env.SOLANA_PROGRAM_ID || 'DMqC61YxtCRF2ixUrRcqahVEN3TcGDWV212xy1prGbTw');
        
        // Cargar autoridad del sistema
        const idPath = process.env.SOLANA_KEYPAIR_PATH || path.join(process.env.HOME, '.config/solana/id.json');
        const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(idPath, 'utf8')));
        this.authority = Keypair.fromSecretKey(secretKey);

        // Cargar IDL (asumiendo que está en el mismo lugar que en el frontend para consistencia)
        const idlPath = path.join(__dirname, '../../anchor-program/target/idl/gaia_recs.json');
        
        try {
            console.log('LOADING IDL FROM:', idlPath);
            const idlRaw = fs.readFileSync(idlPath, 'utf8');
            if (!idlRaw || idlRaw.trim() === "") {
                throw new Error(`El archivo IDL en ${idlPath} está vacío. Por favor, ejecuta 'anchor build' en la carpeta anchor-program.`);
            }
            this.idl = JSON.parse(idlRaw);
            // console.log('IDL CONTENT PREVIEW:', JSON.stringify(this.idl).substring(0, 200));
        } catch (error) {
            console.error('CRITICAL: No se pudo cargar el IDL de Solana:', error.message);
            process.exit(1); // Salida controlada con mensaje claro
        }

        const wallet = new anchor.Wallet(this.authority);
        const provider = new anchor.AnchorProvider(this.connection, wallet, { preflightCommitment: 'confirmed' });
        this.program = new anchor.Program(this.idl, this.programId, provider);
    }

    /**
     * Emite RECs para un dispositivo
     */
    async issueRec(certificateId, amount, deviceId) {
        try {
            const [recPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("certificate"), Buffer.from(certificateId)],
                this.programId
            );

            const tx = await this.program.methods
                .issueRec(certificateId, new anchor.BN(amount), deviceId)
                .accounts({
                    owner: this.authority.publicKey,
                    recCertificate: recPda,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();

            console.log('REC emitido exitosamente. TX:', tx);
            return tx;
        } catch (error) {
            console.error('Error emitiendo REC en Solana:', error);
            throw error;
        }
    }

    /**
     * Registra un reporte de energía
     */
    async submitEnergyReport(deviceId, reportId, periodStart, periodEnd, energyWh) {
        try {
            // Asumiendo que deviceId es el string ID del dispositivo
            const [devicePda] = PublicKey.findProgramAddressSync(
                [Buffer.from("device"), this.authority.publicKey.toBuffer(), Buffer.from(deviceId)],
                this.programId
            );

            const [reportPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("report"), devicePda.toBuffer(), Buffer.from(reportId)],
                this.programId
            );

            const tx = await this.program.methods
                .submitEnergyReport(reportId, new anchor.BN(periodStart), new anchor.BN(periodEnd), new anchor.BN(energyWh))
                .accounts({
                    owner: this.authority.publicKey,
                    device: devicePda,
                    energyReport: reportPda,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();

            console.log('Reporte de energía enviado a Solana. TX:', tx);
            return tx;
        } catch (error) {
            console.error('Error enviando reporte a Solana:', error);
            throw error;
        }
    }
}

module.exports = new SolanaService();
