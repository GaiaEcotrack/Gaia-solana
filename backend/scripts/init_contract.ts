import * as anchor from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

// --- CONFIGURACIÓN ---
// URL de la red de Solana (Devnet típicamente para pruebas)
const RPC_URL = 'https://api.devnet.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

// IMPORTANTE: Asegúrate de tener tu Keypair del deployer guardada localmente
// Esto usualmente está en ~/.config/solana/id.json o en el root de tu proyecto
const KEYPAIR_PATH = '\\\\wsl$\\Ubuntu\\home\\nicov\\.config\\solana\\temp-keypair.json';
// O si quieres apuntar al keypair dentro del proyecto:
// const KEYPAIR_PATH = path.resolve(__dirname, '../../gaia_solana/target/deploy/gaia_solana-keypair.json');

// Reemplaza esto con tu Program ID y VFT Mint (están en tu .env)
const PROGRAM_ID = new PublicKey('3h66uneMsNnnByaSTSFBhz6S69ZATHbRhriFq8KaWDwP');
const VFT_MINT_PUBKEY = new PublicKey('EVrNjUkZCKvouQ16Qi6hVhYZwgGaYQ4sZTkTWtScVZdF');

async function main() {
  console.log('--- Iniciando Configuración del Smart Contract Gaia ---');

  // 1. Cargar la Wallet Administradora (debe tener SOL en Devnet)
  if (!fs.existsSync(KEYPAIR_PATH)) {
    throw new Error(`No se encontró un Keypair en la ruta: ${KEYPAIR_PATH}`);
  }
  const secretKeyString = fs.readFileSync(KEYPAIR_PATH, 'utf8');
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const adminWallet = Keypair.fromSecretKey(secretKey);
  console.log(`✅ Admin Wallet cargada: ${adminWallet.publicKey.toBase58()}`);

  // Configurar Provider de Anchor
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(adminWallet),
    { preflightCommitment: 'confirmed' }
  );
  anchor.setProvider(provider);

  // Intentamos cargar el IDL local (asegúrate de que existe gaia_solana.json al lado de este script)
  let idlStr: string;
  try {
    idlStr = fs.readFileSync(path.join(__dirname, '..', 'src', 'solana', 'gaia_solana.json'), 'utf8');
  } catch (error) {
    console.error('❌ Error: No se encontró el archivo IDL (gaia_solana.json) en backend/src/solana/');
    process.exit(1);
  }

  const idl = JSON.parse(idlStr);
  const program = new anchor.Program(idl as anchor.Idl, provider);

  // 2. Determinar PDAs necesarios
  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    PROGRAM_ID
  );
  console.log(`🔧 PDA Config calculado: ${configPda.toBase58()}`);

  try {
    // Verificamos si ya está inicializado
    const accountInfo = await connection.getAccountInfo(configPda);

    if (!accountInfo) {
      console.log('\n🚀 Paso 1: Ejecutando "initialize"...');
      const initTx = await program.methods
        .initialize()
        .accounts({
          config: configPda,
          payer: adminWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log(`✅ Contrato inicializado. Tx: ${initTx}`);
    } else {
      console.log('\n✅ Paso 1: El contrato ya estaba inicializado.');
    }

    // 3. Setear el contrato VFT
    console.log('\n🚀 Paso 2: Ejecutando "set_vft_contract"...');
    const setVftTx = await program.methods
      .setVftContract(VFT_MINT_PUBKEY)
      .accounts({
        config: configPda,
        owner: adminWallet.publicKey,
        vftMint: VFT_MINT_PUBKEY, // Agregado en caso de usar Anchor 0.29+
      })
      .rpc();
    console.log(`✅ VFT Contract configurado exitosamente. Tx: ${setVftTx}`);

    console.log('\n🎉 ¡Smart Contract totalmente configurado y listo para mintear tokens!');
  } catch (err) {
    console.error('\n❌ Ocurrió un error en la transacción:', err);
    if (err.logs) {
      console.error('\nLogs del contrato:', err.logs);
    }
  }
}

main().catch((err) => {
  console.error('Error fatal:', err);
});
