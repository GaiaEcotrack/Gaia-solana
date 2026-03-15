import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

async function main() {
    // Configurar el proveedor desde las variables de entorno
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const programId = new PublicKey("DMqC61YxtCRF2ixUrRcqahVEN3TcGDWV212xy1prGbTw");
    
    console.log("🚀 Conectando al programa Gaia RECs...");
    console.log("📍 Program ID:", programId.toBase58());
    console.log("👤 Wallet:", provider.wallet.publicKey.toBase58());

    const deviceId = "DEV-PROTOTYPE-001";
    
    // Derivar la PDA
    const [devicePda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("device"),
            provider.wallet.publicKey.toBuffer(),
            Buffer.from(deviceId)
        ],
        programId
    );

    console.log("🛡️ PDA generada:", devicePda.toBase58());

    const accountInfo = await provider.connection.getAccountInfo(devicePda);
    
    if (accountInfo) {
        console.log("✅ Estado: El dispositivo YA existe en la blockchain.");
    } else {
        console.log("⏳ Estado: El dispositivo está listo para ser registrado.");
    }
}

main().catch(err => {
    console.error("❌ Error:", err);
});
