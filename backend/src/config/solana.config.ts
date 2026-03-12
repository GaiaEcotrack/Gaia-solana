import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SolanaConfig {
  constructor(private configService: ConfigService) {}

  get connection(): Connection {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL', 'https://api.devnet.solana.com');
    return new Connection(rpcUrl, 'confirmed');
  }

  get adminKeypair(): Keypair {
    const walletPath = this.configService.get<string>('ADMIN_WALLET_PATH');
    
    if (walletPath) {
      const keypairData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
      return Keypair.fromSecretKey(new Uint8Array(keypairData));
    }
    
    // Fallback to environment variable
    const privateKey = this.configService.get<string>('ADMIN_PRIVATE_KEY');
    if (privateKey) {
      return Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
    }
    
    throw new Error('No admin wallet configured');
  }

  get adminPublicKey(): PublicKey {
    return this.adminKeypair.publicKey;
  }

  get programId(): PublicKey {
    const programId = this.configService.get<string>('PROGRAM_ID');
    if (!programId) {
      throw new Error('PROGRAM_ID not configured');
    }
    return new PublicKey(programId);
  }

  get tokenMint(): PublicKey {
    const tokenMint = this.configService.get<string>('GAIA_REC_TOKEN_MINT');
    if (!tokenMint) {
      throw new Error('GAIA_REC_TOKEN_MINT not configured');
    }
    return new PublicKey(tokenMint);
  }

  get oraclePrivateKey(): string {
    return this.configService.get<string>('ORACLE_PRIVATE_KEY', 'default_oracle_key');
  }

  get oraclePublicKey(): string {
    return this.configService.get<string>('ORACLE_PUBLIC_KEY', 'default_oracle_public_key');
  }
}
