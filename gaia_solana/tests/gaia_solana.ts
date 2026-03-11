import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { GaiaSolana } from '../target/types/gaia_solana';
import { expect } from 'chai';
import { createMint } from '@solana/spl-token';

describe('gaia-solana', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GaiaSolana as Program<GaiaSolana>;
  let vftMint: anchor.web3.PublicKey;

  before(async () => {
    // Crear mint para pruebas
    vftMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      provider.wallet.publicKey,
      null,
      3 // decimals
    );
  });

  it('Initializes the contract', async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        payer: provider.wallet.publicKey,
      })
      .rpc();

    console.log('Initialize tx:', tx);

    const [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      program.programId
    );

    const config = await program.account.config.fetch(configPda);
    expect(config.owner.toString()).to.equal(provider.wallet.publicKey.toString());
  });

  it('Sets VFT contract', async () => {
    const [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      program.programId
    );

    await program.methods
      .setVftContract(vftMint)
      .accounts({
        config: configPda,
        owner: provider.wallet.publicKey,
        vftMint: vftMint,
      })
      .rpc();

    const config = await program.account.config.fetch(configPda);
    expect(config.vftMint.toString()).to.equal(vftMint.toString());
  });

  it('Adds a device', async () => {
    const deviceOwner = provider.wallet.publicKey;
    const serialNumber = 'SN123456';

    const tx = await program.methods
      .addDevice(
        deviceOwner,
        serialNumber,
        'Madrid, Spain',
        'Solar Panel',
        'SunPower'
      )
      .accounts({
        authority: provider.wallet.publicKey,
        owner: deviceOwner,
      })
      .rpc();

    console.log('Add device tx:', tx);

    const [devicePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('device'), deviceOwner.toBuffer(), Buffer.from(serialNumber)],
      program.programId
    );

    const device = await program.account.device.fetch(devicePda);
    expect(device.serialNumber).to.equal(serialNumber);
    expect(device.location).to.equal('Madrid, Spain');
  });
});