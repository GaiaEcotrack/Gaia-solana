import { Program, Idl } from '@coral-xyz/anchor';
import type { AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, Keypair, Transaction } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const PROGRAM_ID = new PublicKey('3h66uneMsNnnByaSTSFBhz6S69ZATHbRhriFq8KaWDwP');

function loadIdl(): any {
  const idlPath = path.resolve(__dirname, '../../idl/gaia_solana.json');
  
  if (!fs.existsSync(idlPath)) {
    throw new Error(`IDL not found at ${idlPath}. Run 'anchor build' or copy the IDL manually.`);
  }
  
  const idlData = fs.readFileSync(idlPath, 'utf-8');
  const parsed = JSON.parse(idlData);
  
  // Map account names to their sizes (8 bytes for discriminator + actual data)
  const sizes: Record<string, number> = {
    Admin: 32 + 8,
    CarbonCredit: 4 + 32 + 4 + 256 + 256 + 256 + 256 + 8 + 8 + 8,
    Config: 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 4 + 1 + 8,
    Device: 32 + 4 + 256 + 4 + 256 + 4 + 256 + 4 + 256 + 8,
    EnergyProduction: 32 + 8 + 8 + 8 + 8,
    TransferRecord: 32 + 32 + 8 + 8 + 4 + 256 + 8,
    UsedHash: 4 + 256 + 8,
  };
  
  return {
    version: parsed.metadata?.version || parsed.version || '0.0.0',
    name: parsed.metadata?.name || parsed.name,
    address: parsed.address,
    instructions: parsed.instructions.map((ix: any) => ({
      name: ix.name,
      discriminator: ix.discriminator,
      accounts: ix.accounts.map((acc: any) => {
        const accObj: any = {
          name: acc.name,
          isMut: acc.writable,
          isSigner: acc.signer,
        };
        if (acc.pda) {
          accObj.pda = acc.pda;
        }
        if (acc.address) {
          accObj.pubkey = acc.address;
        }
        return accObj;
      }),
      args: (ix.args || []).map((arg: any) => ({
        name: arg.name,
        type: arg.type,
      })),
    })),
    accounts: (parsed.accounts || []).map((acc: any) => {
      const size = sizes[acc.name] || 1000;
      return {
        name: acc.name,
        discriminator: acc.discriminator,
        size: size,
      };
    }),
  };
}

export function createProgram(provider: AnchorProvider): Program {
  const idl = loadIdl();
  
  // Create program with explicit IDL type
  const program = new Program(
    idl as any, 
    PROGRAM_ID, 
    provider
  );
  
  console.log(`📦 Program loaded: ${PROGRAM_ID.toBase58()}`);
  console.log(`   Network: ${provider.connection.rpcEndpoint}`);
  console.log(`   Instructions: ${idl.instructions?.length || 0}`);
  console.log(`   Accounts: ${idl.accounts?.length || 0}\n`);
  
  return program;
}
