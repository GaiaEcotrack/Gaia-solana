import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as crypto from "crypto";

async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const programId = new PublicKey("DMqC61YxtCRF2ixUrRcqahVEN3TcGDWV212xy1prGbTw");

    // Generamos el discriminador usando el módulo nativo de Node.js
    const hash = crypto.createHash('sha256').update('global:register_device').digest();
    const discriminator = Array.from(hash.slice(0, 8));

    const idl: any = {
        "address": programId.toBase58(),
        "metadata": { "name": "gaia_recs" },
        "instructions": [
            {
                "name": "register_device",
                "discriminator": discriminator,
                "accounts": [
                    {"name": "owner", "writable": true, "signer": true},
                    {"name": "device", "writable": true, "signer": false},
                    {"name": "system_program", "address": "11111111111111111111111111111111"}
                ],
                "args": [
                    {"name": "device_id", "type": "string"},
                    {"name": "device_type", "type": "string"},
                    {"name": "capacity_kw", "type": "u64"},
                    {"name": "location", "type": "string"}
                ]
            }
        ]
    };

    const program = new anchor.Program(idl, provider);

    const deviceId = "DEV-PROTOTYPE-001";
    const [devicePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("device"), provider.wallet.publicKey.toBuffer(), Buffer.from(deviceId)],
        programId
    );

    console.log("📝 Registrando dispositivo en Gaia...");

    try {
        const tx = await program.methods
            .registerDevice(
                deviceId,
                "Solar Panel",
                new anchor.BN(5000),
                "Antigravity Lab - Medellín"
            )
            .accounts({
                owner: provider.wallet.publicKey,
                device: devicePda,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        console.log("✅ ¡REGISTRO EXITOSO!");
        console.log("🔗 Firma:", tx);
        console.log("🌍 Ver en Explorer: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");
    } catch (err) {
        console.error("❌ Error en la transacción:");
        console.error(err);
    }
}

main();
