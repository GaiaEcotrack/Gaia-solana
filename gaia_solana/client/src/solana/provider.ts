import { PublicKey, Connection, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import * as anchor from '@coral-xyz/anchor';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const PROGRAM_ID = new PublicKey('3h66uneMsNnnByaSTSFBhz6S69ZATHbRhriFq8KaWDwP');
export const CLUSTER_URL = process.env.CLUSTER_URL ?? 'https://api.devnet.solana.com';
export const CLUSTER = process.env.CLUSTER ?? 'devnet';

function getWalletKeypair() {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  const defaultPath = path.join(homeDir, '.config', 'solana', 'id.json');
  
  // Check for local keypair: client/src/solana -> client/src -> client -> gaia_solana -> target/deploy
  const projectRoot = path.resolve(__dirname, '../../..');
  const localPath = path.join(projectRoot, 'target/deploy/gaia_solana-keypair.json');
  const walletPath = process.env.WALLET_PATH ?? (fs.existsSync(localPath) ? localPath : defaultPath);
  
  console.log(`Looking for wallet at: ${walletPath}`);
  console.log(`File exists: ${fs.existsSync(walletPath)}`);
  
  if (!fs.existsSync(walletPath)) {
    throw new Error(`Wallet not found at ${walletPath}. Run 'solana-keygen new' to create one.`);
  }
  
  const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  return anchor.web3.Keypair.fromSecretKey(new Uint8Array(walletData));
}

export function createProvider() {
  const connection = new Connection(CLUSTER_URL, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
  });
  
  const walletKeypair = getWalletKeypair();
  const wallet = new anchor.Wallet(walletKeypair);
  
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    skipPreflight: false,
    maxRetries: 5,
  });
  
  return provider;
}

export function getExplorerUrl(signature, cluster = CLUSTER) {
  const clusterSuffix = cluster === 'devnet' ? 'devnet' : cluster === 'testnet' ? 'testnet' : '';
  return `https://explorer.solana.com/tx/${signature}${clusterSuffix ? `?cluster=${clusterSuffix}` : ''}`;
}

export function logTransaction(signature, description = 'Transaction') {
  console.log(`\n✅ ${description}`);
  console.log(`   Signature: ${signature}`);
  console.log(`   Explorer: ${getExplorerUrl(signature)}\n`);
}

export function logError(error, context = 'Error') {
  console.error(`\n❌ ${context}`);
  if (error instanceof Error) {
    console.error(`   Message: ${error.message}`);
    if ('logs' in error && Array.isArray(error.logs)) {
      console.error('   Program logs:');
      error.logs.forEach((log) => console.error(`     ${log}`));
    }
  }
  console.error('');
}

export async function confirmTransaction(connection, signature, commitment = 'confirmed') {
  const start = Date.now();
  while (Date.now() - start < 60000) {
    const status = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    });
    
    if (status.value) {
      if (status.value.confirmationStatus === commitment || status.value.confirmationStatus === 'finalized') {
        return true;
      }
      if (status.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Transaction confirmation timeout');
}
