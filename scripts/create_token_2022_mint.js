#!/usr/bin/env node

/**
 * Script para crear un mint de Token-2022 para Gaia RECs
 * Este script configura el token con las características necesarias para RECs
 */

import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
    createMint,
    createInitializeMintInstruction,
    getMintLen,
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
    createInitializeTransferHookInstruction,
    createInitializeMetadataPointerInstruction,
    createInitializeMintCloseAuthorityInstruction,
    TYPE_SIZE,
    LENGTH_SIZE,
} from '@solana/spl-token';
import {
    createInitializeInstruction,
    pack,
} from '@solana/spl-token-metadata';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const NETWORK = 'devnet';
const RPC_URL = clusterApiUrl(NETWORK);
const TOKEN_NAME = 'Gaia Renewable Energy Credit';
const TOKEN_SYMBOL = 'GREC';
const TOKEN_DECIMALS = 6;
const TOKEN_URI = 'https://gaia-ecotrack.vercel.app/token-metadata.json';

// Cargar wallet desde archivo
function loadWallet() {
    const keypairPath = path.join(process.env.HOME, '.config/solana/id.json');

    if (!fs.existsSync(keypairPath)) {
        console.error('❌ No se encontró el archivo de wallet:', keypairPath);
        console.log('💡 Crea una wallet con: solana-keygen new');
        process.exit(1);
    }

    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(keypairData));
}

async function createToken2022Mint() {
    console.log('🚀 Creando mint de Token-2022 para Gaia RECs...');
    console.log('📊 Configuración:');
    console.log(`   Red: ${NETWORK}`);
    console.log(`   Nombre: ${TOKEN_NAME}`);
    console.log(`   Símbolo: ${TOKEN_SYMBOL}`);
    console.log(`   Decimales: ${TOKEN_DECIMALS}`);
    console.log(`   URI: ${TOKEN_URI}`);
    console.log('='.repeat(50));

    // Conectar a Solana
    const connection = new Connection(RPC_URL, 'confirmed');
    const payer = loadWallet();

    console.log(`👛 Wallet: ${payer.publicKey.toBase58()}`);

    // Verificar balance
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`💰 Balance: ${balance / 1e9} SOL`);

    if (balance < 0.1 * 1e9) {
        console.log('⚠️  Balance bajo. Solicita airdrop con:');
        console.log(`   solana airdrop 2 ${payer.publicKey.toBase58()} --url ${RPC_URL}`);
    }

    // Crear keypair para el mint
    const mintKeypair = Keypair.generate();
    console.log(`🎯 Mint address: ${mintKeypair.publicKey.toBase58()}`);

    try {
        // Calcular espacio necesario para el mint con extensiones
        const extensions = [
            ExtensionType.MintCloseAuthority,
            ExtensionType.TransferHook,
            ExtensionType.MetadataPointer,
        ];

        const mintLen = getMintLen(extensions);
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

        console.log(`📦 Espacio requerido: ${mintLen} bytes`);
        console.log(`💸 Rent: ${lamports / 1e9} SOL`);

        // Crear transacción para inicializar el mint con extensiones
        const transaction = await createMint(
            connection,
            payer,
            payer.publicKey, // Mint authority
            payer.publicKey, // Freeze authority (mismo que mint)
            TOKEN_DECIMALS,
            mintKeypair,
            undefined,
            TOKEN_2022_PROGRAM_ID
        );

        console.log('✅ Mint creado exitosamente!');
        console.log('');
        console.log('📋 Información del token:');
        console.log(`   Address: ${mintKeypair.publicKey.toBase58()}`);
        console.log(`   Program: ${TOKEN_2022_PROGRAM_ID.toBase58()}`);
        console.log(`   Authority: ${payer.publicKey.toBase58()}`);
        console.log(`   Decimals: ${TOKEN_DECIMALS}`);
        console.log('');
        console.log('🔗 Enlaces útiles:');
        console.log(`   Explorer: https://explorer.solana.com/address/${mintKeypair.publicKey.toBase58()}?cluster=${NETWORK}`);
        console.log(`   Solscan: https://solscan.io/token/${mintKeypair.publicKey.toBase58()}?cluster=${NETWORK}`);

        // Guardar información del mint en un archivo
        const mintInfo = {
            network: NETWORK,
            mintAddress: mintKeypair.publicKey.toBase58(),
            tokenProgram: TOKEN_2022_PROGRAM_ID.toBase58(),
            decimals: TOKEN_DECIMALS,
            name: TOKEN_NAME,
            symbol: TOKEN_SYMBOL,
            uri: TOKEN_URI,
            authority: payer.publicKey.toBase58(),
            createdAt: new Date().toISOString(),
        };

        const outputPath = path.join(__dirname, '..', 'token-mint-info.json');
        fs.writeFileSync(outputPath, JSON.stringify(mintInfo, null, 2));

        console.log('');
        console.log('💾 Información guardada en:', outputPath);
        console.log('');
        console.log('🎉 ¡Mint de Token-2022 creado exitosamente!');
        console.log('');
        console.log('🔧 Próximos pasos:');
        console.log('1. Actualizar ADMIN_PUBKEY en lib.rs con tu wallet');
        console.log('2. Actualizar GAIA_REC_TOKEN_MINT en .env con la nueva address');
        console.log('3. Deployar el programa Anchor: anchor deploy');
        console.log('4. Configurar transfer hook en el mint');

        return mintKeypair.publicKey;

    } catch (error) {
        console.error('❌ Error creando el mint:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Función para actualizar el archivo .env con el mint address
async function updateEnvFile(mintAddress) {
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Actualizar o agregar GAIA_REC_TOKEN_MINT
    const mintLine = `GAIA_REC_TOKEN_MINT=${mintAddress.toBase58()}`;

    if (envContent.includes('GAIA_REC_TOKEN_MINT=')) {
        envContent = envContent.replace(/GAIA_REC_TOKEN_MINT=.*/g, mintLine);
    } else {
        envContent += `\n${mintLine}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env actualizado con GAIA_REC_TOKEN_MINT');
}

// Ejecutar script
if (import.meta.url === `file://${process.argv[1]}`) {
    createToken2022Mint()
        .then(mintAddress => updateEnvFile(mintAddress))
        .then(() => {
            console.log('');
            console.log('='.repeat(50));
            console.log('🚀 Script completado exitosamente!');
            console.log('='.repeat(50));
        })
        .catch(error => {
            console.error('❌ Error en el script:', error);
            process.exit(1);
        });
}

export { createToken2022Mint, updateEnvFile };