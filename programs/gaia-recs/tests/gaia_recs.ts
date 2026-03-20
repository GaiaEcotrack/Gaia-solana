import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { GaiaRecs } from "../target/types/gaia_recs";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("gaia_recs", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GaiaRecs as Program<GaiaRecs>;

  const admin = provider.wallet;
  const deviceOwner = Keypair.generate();

  const deviceId = "test_device_001";
  const reportId = "report_001";

  let devicePda: PublicKey;
  let reportPda: PublicKey;

  before(async () => {
    // Airdrop al device owner
    const sig = await provider.connection.requestAirdrop(
      deviceOwner.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    // PDA device
    [devicePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("device"),
        deviceOwner.publicKey.toBuffer(),
        Buffer.from(deviceId),
      ],
      program.programId
    );

    // PDA report
    [reportPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("energy_report"),
        devicePda.toBuffer(),
        Buffer.from(reportId),
      ],
      program.programId
    );
  });

  // =========================================================
  // ✅ REGISTER DEVICE
  // =========================================================
  it("Register device", async () => {
    await program.methods
      .registerDevice(
        deviceId,
        "solar_panel",
        new anchor.BN(5000),
        "Argentina"
      )
      .accounts({
        device: devicePda,
        owner: deviceOwner.publicKey,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([deviceOwner])
      .rpc();

    const deviceAccount = await program.account.device.fetch(devicePda);

    expect(deviceAccount.deviceId).to.equal(deviceId);
    expect(deviceAccount.owner.toString()).to.equal(
      deviceOwner.publicKey.toString()
    );
    expect(deviceAccount.deviceType).to.equal("solar_panel");
    expect(deviceAccount.capacityKw.toNumber()).to.equal(5000);
    expect(deviceAccount.isVerified).to.equal(false);
  });

  // =========================================================
  // ✅ SUBMIT ENERGY REPORT
  // =========================================================
  it("Submit energy report", async () => {
    const periodStart = new anchor.BN(1700000000);
    const periodEnd = new anchor.BN(1700086400);
    const energyWh = new anchor.BN(1_500_000);

    await program.methods
      .submitEnergyReport(
        reportId,
        periodStart,
        periodEnd,
        energyWh,
        "hash_123",
        Array(64).fill(0)
      )
      .accounts({
        device: devicePda,
        report: reportPda,
        owner: deviceOwner.publicKey,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([deviceOwner])
      .rpc();

    const reportAccount = await program.account.energyReport.fetch(reportPda);

    expect(reportAccount.reportId).to.equal(reportId);
    expect(reportAccount.energyWh.toNumber()).to.equal(1_500_000);

    const expectedRecs = Math.floor(1_500_000 / 1_000_000);
    expect(reportAccount.recsIssued.toNumber()).to.equal(expectedRecs);
  });
});