import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { GaiaSolana } from '../../target/types/gaia_solana';

export class GaiaClient {
  constructor(
    private program: Program<GaiaSolana>,
    private provider: AnchorProvider
  ) {}

  async initialize() {
    const [configPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    );

    return this.program.methods
      .initialize()
      .accounts({
        config: configPda,
        payer: this.provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

  async addDevice(
    owner: web3.PublicKey,
    serialNumber: string,
    location: string,
    deviceType: string,
    deviceBrand: string
  ) {
    const [configPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    );

    const [devicePda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('device'), owner.toBuffer(), Buffer.from(serialNumber)],
      this.program.programId
    );

    return this.program.methods
      .addDevice(owner, serialNumber, location, deviceType, deviceBrand)
      .accounts({
        config: configPda,
        authority: this.provider.wallet.publicKey,
        device: devicePda,
        owner: owner,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

  async mintTokensToUser(recipient: web3.PublicKey, amount: number) {
    const [configPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    );

    const config = await this.program.account.config.fetch(configPda);
    
    const recipientAta = await getAssociatedTokenAddress(
      config.vftMint,
      recipient
    );

    const timestamp = Math.floor(Date.now() / 1000);
    const [energyProductionPda] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('energy_production'),
        recipient.toBuffer(),
        new web3.BN(timestamp).toArrayLike(Buffer, 'le', 8)
      ],
      this.program.programId
    );

    return this.program.methods
      .mintTokensToUser(new web3.BN(amount))
      .accounts({
        config: configPda,
        authority: this.provider.wallet.publicKey,
        vftMint: config.vftMint,
        recipient: recipient,
        recipientTokenAccount: recipientAta,
        energyProduction: energyProductionPda,
        tokenProgram: web3.TOKEN_PROGRAM_ID,
        associatedTokenProgram: web3.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

  async transferGaiaETokens(
    from: web3.PublicKey,
    to: web3.PublicKey,
    amount: number
  ) {
    const [configPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    );

    const config = await this.program.account.config.fetch(configPda);

    const fromAta = await getAssociatedTokenAddress(config.vftMint, from);
    const toAta = await getAssociatedTokenAddress(config.vftMint, to);

    const timestamp = Math.floor(Date.now() / 1000);
    const [transferRecordPda] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('transfer_record'),
        new web3.BN(timestamp).toArrayLike(Buffer, 'le', 8)
      ],
      this.program.programId
    );

    return this.program.methods
      .transferGaiaETokens(new web3.BN(amount))
      .accounts({
        config: configPda,
        authority: this.provider.wallet.publicKey,
        vftMint: config.vftMint,
        fromTokenAccount: fromAta,
        toTokenAccount: toAta,
        from: from,
        to: to,
        transferRecord: transferRecordPda,
        tokenProgram: web3.TOKEN_PROGRAM_ID,
        associatedTokenProgram: web3.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

  async tokenizeCarbonCredit(
    projectId: string,
    co2Tonnes: number,
    certificateHash: string,
    verifierName: string,
    gpsCoords: string,
    recipient: web3.PublicKey,
    startDate: number,
    endDate: number
  ) {
    const [configPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    );

    const config = await this.program.account.config.fetch(configPda);

    const recipientAta = await getAssociatedTokenAddress(
      config.carbonMint,
      recipient
    );

    const [carbonCreditPda] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('carbon_credit'),
        new web3.BN(config.nextTokenId).toArrayLike(Buffer, 'le', 4)
      ],
      this.program.programId
    );

    const [usedHashPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('used_hash'), Buffer.from(certificateHash)],
      this.program.programId
    );

    return this.program.methods
      .tokenizeCarbonCredit(
        projectId,
        co2Tonnes,
        certificateHash,
        verifierName,
        gpsCoords,
        recipient,
        new web3.BN(startDate),
        new web3.BN(endDate)
      )
      .accounts({
        config: configPda,
        authority: this.provider.wallet.publicKey,
        carbonMint: config.carbonMint,
        recipient: recipient,
        recipientTokenAccount: recipientAta,
        carbonCredit: carbonCreditPda,
        usedHash: usedHashPda,
        tokenProgram: web3.TOKEN_PROGRAM_ID,
        associatedTokenProgram: web3.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

  async getDevice(owner: web3.PublicKey, serialNumber: string) {
    const [devicePda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('device'), owner.toBuffer(), Buffer.from(serialNumber)],
      this.program.programId
    );

    return this.program.account.device.fetch(devicePda);
  }

  async getConfig() {
    const [configPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    );

    return this.program.account.config.fetch(configPda);
  }

  async getCarbonCredit(tokenId: number) {
    const [carbonCreditPda] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('carbon_credit'),
        new web3.BN(tokenId).toArrayLike(Buffer, 'le', 4)
      ],
      this.program.programId
    );

    return this.program.account.carbonCredit.fetch(carbonCreditPda);
  }
}