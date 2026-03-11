import { PublicKey, Connection, SystemProgram, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

function toLEBytes(num: number, bytes: number): Uint8Array {
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    arr[i] = num & 0xff;
    num = num >>> 8;
  }
  return arr;
}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const PROGRAM_ID = new PublicKey('3h66uneMsNnnByaSTSFBhz6S69ZATHbRhriFq8KaWDwP');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export const CLUSTER_URL = process.env.CLUSTER_URL ?? 'https://api.devnet.solana.com';
export const CLUSTER = process.env.CLUSTER ?? 'devnet';

function getWalletKeypair() {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  const defaultPath = path.join(homeDir, '.config', 'solana', 'id.json');
  
  const projectRoot = path.resolve(__dirname, '../../..');
  const localPath = path.join(projectRoot, 'target/deploy/gaia_solana-keypair.json');
  const walletPath = process.env.WALLET_PATH ?? (fs.existsSync(localPath) ? localPath : defaultPath);
  
  if (!fs.existsSync(walletPath)) {
    throw new Error(`Wallet not found at ${walletPath}`);
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

export function getExplorerUrl(signature: string, cluster = CLUSTER) {
  const clusterSuffix = cluster === 'devnet' ? 'devnet' : cluster === 'testnet' ? 'testnet' : '';
  return `https://explorer.solana.com/tx/${signature}${clusterSuffix ? `?cluster=${clusterSuffix}` : ''}`;
}

export function logTransaction(signature: string, description = 'Transaction') {
  console.log(`\n✅ ${description}`);
  console.log(`   Signature: ${signature}`);
  console.log(`   Explorer: ${getExplorerUrl(signature)}\n`);
}

export function logError(error: unknown, context = 'Error') {
  console.error(`\n❌ ${context}`);
  if (error instanceof Error) {
    console.error(`   Message: ${error.message}`);
  }
  console.error('');
}

export class GaiaClient {
  private provider: anchor.AnchorProvider;
  private connection: Connection;
  
  constructor(provider: anchor.AnchorProvider) {
    this.provider = provider;
    this.connection = provider.connection;
  }
  
  get wallet() {
    return this.provider.wallet;
  }
  
  get programId() {
    return PROGRAM_ID;
  }

  deriveConfigPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from('config')], PROGRAM_ID);
  }
  
  deriveAdminPda(admin: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from('admin'), admin.toBuffer()], PROGRAM_ID);
  }
  
  deriveDevicePda(owner: PublicKey, serialNumber: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from('device'), owner.toBuffer(), Buffer.from(serialNumber)], PROGRAM_ID);
  }
  
  deriveCarbonCreditPda(tokenId: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from('carbon_credit'), Buffer.from([tokenId])], PROGRAM_ID);
  }
  
  deriveEnergyProductionPda(recipient: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from('energy_production'), recipient.toBuffer()], PROGRAM_ID);
  }
  
  deriveTransferRecordPda(from: PublicKey, to: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from('transfer_record'), from.toBuffer(), to.toBuffer()], PROGRAM_ID);
  }
  
  deriveUsedHashPda(certificateHash: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from('used_hash'), Buffer.from(certificateHash)], PROGRAM_ID);
  }
  
  async getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
    return PublicKey.findProgramAddressSync(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];
  }

  // Using methods builder via RPC
  async initialize(): Promise<string> {
    const [configPda] = this.deriveConfigPda();
    const ix = anchor.web3.SystemProgram.createAccount({
      fromPubkey: this.wallet.publicKey,
      newAccountPubkey: configPda,
      space: 400,
      programId: PROGRAM_ID,
    });
    
    const tx = new Transaction().add(ix);
    tx.feePayer = this.wallet.publicKey;
    
    const sig = await this.provider.sendAndConfirm(tx);
    logTransaction(sig, 'Initialize');
    return sig;
  }
  
  async addAdmin(newAdmin: PublicKey): Promise<string> {
    const [configPda] = this.deriveConfigPda();
    const [adminPda] = this.deriveAdminPda(newAdmin);
    
    const data = Buffer.from([177, 236, 33, 205, 124, 152, 55, 186]);
    
    const ix = new anchor.web3.TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: configPda, isWritable: true, isSigner: false },
        { pubkey: this.wallet.publicKey, isWritable: true, isSigner: true },
        { pubkey: adminPda, isWritable: true, isSigner: false },
        { pubkey: newAdmin, isWritable: false, isSigner: false },
        { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
      ],
      data: data,
    });
    
    const tx = new Transaction().add(ix);
    const sig = await this.provider.sendAndConfirm(tx);
    logTransaction(sig, 'Add Admin');
    return sig;
  }
  
  async addDevice(owner: PublicKey, serialNumber: string, location: string, deviceType: string, deviceBrand: string): Promise<string> {
    const [configPda] = this.deriveConfigPda();
    const [devicePda] = this.deriveDevicePda(owner, serialNumber);
    
    const data = Buffer.from([21, 27, 66, 42, 18, 30, 14, 18]);
    
    const args = Buffer.alloc(8 + serialNumber.length + location.length + deviceType.length + deviceBrand.length + 40);
    args.set(toLEBytes(serialNumber.length, 4), 0);
    args.set(Buffer.from(serialNumber), 4);
    const locOffset = 4 + serialNumber.length;
    args.set(toLEBytes(location.length, 4), locOffset);
    args.set(Buffer.from(location), locOffset + 4);
    
    const ix = new anchor.web3.TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: configPda, isWritable: false, isSigner: false },
        { pubkey: this.wallet.publicKey, isWritable: true, isSigner: true },
        { pubkey: devicePda, isWritable: true, isSigner: false },
        { pubkey: owner, isWritable: false, isSigner: false },
        { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
      ],
      data: Buffer.concat([data, args]),
    });
    
    const tx = new Transaction().add(ix);
    const sig = await this.provider.sendAndConfirm(tx);
    logTransaction(sig, 'Add Device');
    return sig;
  }
  
  async setVftContract(vftMint: PublicKey): Promise<string> {
    const [configPda] = this.deriveConfigPda();
    
    const data = Buffer.from([80, 78, 4, 1, 84, 246, 31, 209]);
    const args = vftMint.toBuffer();
    
    const ix = new anchor.web3.TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: configPda, isWritable: true, isSigner: false },
        { pubkey: this.wallet.publicKey, isWritable: false, isSigner: true },
        { pubkey: vftMint, isWritable: false, isSigner: false },
      ],
      data: Buffer.concat([data, args]),
    });
    
    const tx = new Transaction().add(ix);
    const sig = await this.provider.sendAndConfirm(tx);
    logTransaction(sig, 'Set VFT Contract');
    return sig;
  }
  
  async mintTokensToUser(recipient: PublicKey, amount: bigint): Promise<string> {
    logError(new Error('mint_tokens_to_user requires complex CPI - use JS SDK'), 'Minting');
    throw new Error('Use spl-token CLI or JS SDK for minting');
  }
  
  async tokenizeCarbonCredit(
    projectId: string,
    co2Tonnes: number,
    certificateHash: string,
    verifierName: string,
    gpsCoords: string,
    recipient: PublicKey,
    startDate: bigint,
    endDate: bigint
  ): Promise<string> {
    logError(new Error('tokenize_carbon_credit requires complex CPI - use JS SDK'), 'Tokenizing');
    throw new Error('Use JS SDK with tokenization logic');
  }
  
  async transferGaiaETokens(from: PublicKey, to: PublicKey, amount: bigint): Promise<string> {
    logError(new Error('transfer_gaia_e_tokens requires token transfer CPI'), 'Transfer');
    throw new Error('Use spl-token CLI or JS SDK for transfers');
  }

  async fetchConfig() {
    const [configPda] = this.deriveConfigPda();
    const accountInfo = await this.connection.getAccountInfo(configPda);
    if (!accountInfo) throw new Error('Config not found');
    return this.decodeConfig(accountInfo.data);
  }
  
  async fetchDevice(owner: PublicKey, serialNumber: string) {
    const [devicePda] = this.deriveDevicePda(owner, serialNumber);
    const accountInfo = await this.connection.getAccountInfo(devicePda);
    if (!accountInfo) throw new Error('Device not found');
    return this.decodeDevice(accountInfo.data);
  }
  
  async fetchCarbonCredit(tokenId: number) {
    const [pda] = this.deriveCarbonCreditPda(tokenId);
    const accountInfo = await this.connection.getAccountInfo(pda);
    if (!accountInfo) throw new Error('Carbon credit not found');
    return this.decodeCarbonCredit(accountInfo.data);
  }

  decodeConfig(data: Buffer) {
    let offset = 8;
    return {
      owner: new PublicKey(data.slice(offset, offset + 32)),
      vftMint: new PublicKey(data.slice(offset + 32, offset + 64)),
      carbonMint: new PublicKey(data.slice(offset + 64, offset + 96)),
    };
  }
  
  decodeDevice(data: Buffer) {
    let offset = 8;
    return {
      owner: new PublicKey(data.slice(offset, offset + 32)),
      serialNumber: '',
      location: '',
      deviceType: '',
      deviceBrand: '',
    };
  }
  
  decodeCarbonCredit(data: Buffer) {
    return { data: data.slice(0, 100) };
  }

  async fetchAllDevices() {
    const accounts = await this.connection.getProgramAccounts(PROGRAM_ID, {
      filters: [{ memcmp: { bytes: '', offset: 0 } }],
    });
    return accounts;
  }
  
  async fetchAllCarbonCredits() {
    return [];
  }

  printAccountData(name: string, data: any) {
    console.log(`\n📋 ${name}:`);
    console.log('─'.repeat(40));
    console.log(data);
    console.log('');
  }
  
  async getWalletBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.wallet.publicKey);
    return balance / 1e9;
  }
}

export function createProgram(provider: anchor.AnchorProvider) {
  console.log(`📦 Program: ${PROGRAM_ID.toBase58()}`);
  console.log(`   Network: ${provider.connection.rpcEndpoint}\n`);
  return provider;
}
