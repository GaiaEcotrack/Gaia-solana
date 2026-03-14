import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import * as fs from 'fs';
import * as path from 'path';
// import { IdlGaiaContrato } from './gaia_solana.json';

@Injectable()
export class SolanaService implements OnModuleInit {
  private readonly logger = new Logger(SolanaService.name);
  private connection: Connection;
  
  // Variables estáticas o desde ConfigService
  private readonly PROGRAM_ID = new PublicKey(process.env.SOLANA_PROGRAM_ID || '11111111111111111111111111111111');
  private readonly RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

  onModuleInit() {
    this.logger.log(`Conectando a Solana RPC: ${this.RPC_URL}`);
    this.connection = new Connection(this.RPC_URL, 'confirmed');
  }

  /**
   * Consulta información de una cuenta
   * @param pubkey Base58 string de la public key
   */
  async getAccountInfo(pubkey: string) {
    try {
      const publicKey = new PublicKey(pubkey);
      const accountInfo = await this.connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      this.logger.error(`Error obteniendo la cuenta ${pubkey}:`, error);
      throw new Error('No se pudo obtener la información de la cuenta');
    }
  }

  /**
   * Construye una transacción para ejecutar mint_tokens_to_user
   * @param userPublicKeyStr PublicKey del usuario conectado
   * @param amount Cantidad de tokens a mintear
   * @returns Transacción serializada en base64
   */
  async buildMintTransaction(userPublicKeyStr: string, amount: number): Promise<string> {
    const userPublicKey = new PublicKey(userPublicKeyStr);

    try {
      // 1. Obtener el blockhash más reciente
      const { blockhash } = await this.connection.getLatestBlockhash('confirmed');

      // 2. Crear la transacción
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: userPublicKey,
      });

      // 3. Crear instrucción simulando Anchor (o usando `@coral-xyz/anchor` si lo importamos completamente)
      // Discriminador para mint_tokens_to_user: [85, 150, 103, 133, 240, 87, 44, 73]
      const discriminator = Buffer.from([85, 150, 103, 133, 240, 87, 44, 73]);
      
      // Argumentos: amount (u64)
      const dataLayout = Buffer.alloc(8);
      dataLayout.writeBigUInt64LE(BigInt(amount));
      const ixData = Buffer.concat([discriminator, dataLayout]);

      // IMPORTANTE: De tu IDL, estas son las cuentas necesarias
      const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        this.PROGRAM_ID
      );

      const VFT_MINT_PUBKEY = new PublicKey(process.env.VFT_MINT_PUBKEY || 'EVrNjUkZCKvouQ16Qi6hVhYZwgGaYQ4sZTkTWtScVZdF'); 

      const [energyProductionPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('energy_production'), userPublicKey.toBuffer()],
        this.PROGRAM_ID
      );

      const { getAssociatedTokenAddress } = require('@solana/spl-token');
      const recipientAta = await getAssociatedTokenAddress(VFT_MINT_PUBKEY, userPublicKey);
      
      const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

      // 3. Revisar si la cuenta de energyProductionPda ya existe
      const energyInfo = await this.connection.getAccountInfo(energyProductionPda);
      const isEnergyInitialized = energyInfo !== null;

      // Importar IDL para generar la build nativamente
      // NestJS copia los archivos .json a dist/ si están bien configurados, 
      // pero para asegurar la ruta absoluta en dev usamos path.resolve temporalmente o el require directo correcto:
      const idlPath = path.join(__dirname, 'gaia_solana.json');
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
      const provider = new anchor.AnchorProvider(this.connection, {} as anchor.Wallet, {});
      const program = new anchor.Program(idl, provider);

      // Usar el builder nativo de Anchor para generar la instrucción
      // Al pasar la instruction generada con Anchor, manejamos la existencia de las dependencias
      const mintIx = await program.methods
        .mintTokensToUser(new anchor.BN(amount))
        .accounts({
           config: configPda,
           authority: userPublicKey,
           vftMint: VFT_MINT_PUBKEY,
           recipient: userPublicKey,
           recipientTokenAccount: recipientAta,
           energyProduction: energyProductionPda,
           tokenProgram: TOKEN_PROGRAM_ID,
           associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
           // System program es requerido SI Y SOLO SI no existía antes, Anchor lo pide por el Decorator init:
           systemProgram: SystemProgram.programId,
        })
        .instruction();

      // NOTA CLAVE PARA DEPURACIÓN EN MINTEOS MÚLTIPLES:
       // Si Anchor (vía IDL) forza que el systemProgram cree la cuenta con `init`,
       // Fallará al emitir si usamos un Account normal con init en Rust que ya existe. 
       // En caso estricto en el que el Smart Contract exige init en lugar de init_if_needed,
       // remover la key systemProgram aquí no detendrá el error porque Rust (el backend de la blockchain) rebotará el init internamente.
       // De momento lo dejamos normal en el builder, si el IDL rebota `init`, en este commit lo construiremos dinámicamente:
      
      transaction.add(mintIx);

      // 4. Serializar transacción (requireAllSignatures en false para que el frontend la firme)
      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      return serializedTx.toString('base64');
    } catch (error) {
      this.logger.error('Error construyendo la transacción de minteo:', error);
      throw new Error(`No se pudo construir la transacción: ${error.message}`);
    }
  }

  /**
   * Retransmite en la red la transacción firmada por el frontend
   * @param signedTxBase64 Transacción firmada en base64
   */
  async sendAndConfirmTransaction(signedTxBase64: string): Promise<string> {
    try {
      const txBuffer = Buffer.from(signedTxBase64, 'base64');
      
      this.logger.log('Enviando transacción a la red...');
      const signature = await this.connection.sendRawTransaction(txBuffer, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

      this.logger.log(`Transacción enviada: ${signature}. Esperando confirmación...`);
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
      
      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      this.logger.log(`Transacción confirmada exitosamente: ${signature}`);
      return signature;
    } catch (error) {
      this.logger.error('Error al enviar la transacción firmada:', error);
      throw new Error(`Fallo en el envío: ${error.message}`);
    }
  }
}
