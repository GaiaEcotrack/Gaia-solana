import { PublicKey } from '@solana/web3.js';
import { createProvider, GaiaClient } from '../src/solana/index.js';

async function main() {
  console.log('\n🚀 Gaia Solana Client - Demo\n');
  console.log('='.repeat(50));
  
  console.log('📡 Connecting to Solana Devnet...');
  const provider = createProvider();
  console.log(`   Wallet: ${provider.wallet.publicKey.toBase58()}`);
  
  const balance = await provider.connection.getBalance(provider.wallet.publicKey);
  console.log(`   Balance: ${(balance / 1e9).toFixed(4)} SOL\n`);
  
  const client = new GaiaClient(provider);
  
  console.log('─'.repeat(50));
  console.log('📋 Fetching Config...\n');
  
  try {
    const config = await client.fetchConfig();
    client.printAccountData('Config', config);
  } catch (error) {
    console.log('⚠️  Config not initialized\n');
  }
  
  console.log('─'.repeat(50));
  console.log('📱 Adding Device...\n');
  
  const deviceOwner = provider.wallet.publicKey;
  const serialNumber = `DEVICE-${Date.now()}`;
  
  try {
    await client.addDevice(
      deviceOwner,
      serialNumber,
      'Madrid, Spain',
      'Solar Panel',
      'SunPower'
    );
    console.log(`✅ Device added: ${serialNumber}\n`);
  } catch (error) {
    console.log(`ℹ️  ${error instanceof Error ? error.message : 'Error'}\n`);
  }
  
  console.log('─'.repeat(50));
  console.log('✨ Demo Complete!\n');
  
  console.log('📚 Usage:');
  console.log('   const provider = createProvider();');
  console.log('   const client = new GaiaClient(provider);');
  console.log('   await client.addDevice(owner, serial, location, type, brand);');
  console.log('   await client.fetchConfig();');
  console.log('');
}

main().catch((error) => {
  console.error('\n❌ Failed:', error);
  process.exit(1);
});
