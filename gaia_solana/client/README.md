# Gaia Solana Client

Production-grade TypeScript client for interacting with the Gaia Solana Protocol program.

## Overview

This client provides a clean API to interact with the Gaia Solana program deployed on Devnet.

- **Program ID**: `3h66uneMsNnnByaSTSFBhz6S69ZATHbRhriFq8KaWDwP`
- **Network**: Solana Devnet

## Installation

```bash
cd gaia_solana/client
npm install
```

## Quick Start

```bash
npm run interact
```

## Configuration

Create a `.env` file in the `client/` directory:

```env
CLUSTER=devnet
CLUSTER_URL=https://api.devnet.solana.com
# WALLET_PATH=~/.config/solana/id.json  (optional, auto-detects)
```

## Usage

### Initialize Client

```typescript
import { createProvider, GaiaClient } from './src/solana/index.js';

const provider = createProvider();
const client = new GaiaClient(provider);
```

### Instructions

```typescript
// Add a device
await client.addDevice(
  owner,           // Device owner PublicKey
  'SERIAL-001',   // Serial number
  'Madrid, Spain', // Location
  'Solar Panel',  // Device type
  'SunPower'      // Device brand
);

// Set VFT Contract (energy token mint)
await client.setVftContract(vftMintPublicKey);

// Mint tokens to user (requires CPI - use spl-token CLI or JS SDK)
await client.mintTokensToUser(recipient, BigInt(1000));

// Tokenize carbon credit (requires CPI)
await client.tokenizeCarbonCredit(
  'PROJ-001',     // Project ID
  100,            // CO2 tonnes
  'cert-hash-123', // Certificate hash
  'Verra',        // Verifier name
  '40.7128,-74.0060', // GPS
  recipient,      // Recipient
  BigInt(startDate), 
  BigInt(endDate)
);

// Transfer GaiaE tokens
await client.transferGaiaETokens(from, to, BigInt(100));
```

### Fetch Accounts

```typescript
// Fetch single account
const config = await client.fetchConfig();
const device = await client.fetchDevice(owner, serialNumber);
const carbonCredit = await client.fetchCarbonCredit(tokenId);

// Fetch all accounts
const allDevices = await client.fetchAllDevices();
const allCarbonCredits = await client.fetchAllCarbonCredits();
```

### PDA Derivation

```typescript
const [configPda] = client.deriveConfigPda();
const [devicePda] = client.deriveDevicePda(owner, serialNumber);
const [adminPda] = client.deriveAdminPda(adminPublicKey);
```

### Utilities

```typescript
// Get wallet balance
const balance = await client.getWalletBalance();

// Get ATA balance
const tokenBalance = await client.getAtaBalance(mint, owner);

// Print transaction explorer link
const explorerUrl = getExplorerUrl(signature);
```

## Project Structure

```
client/
├── src/
│   └── solana/
│       ├── client.ts      # Main client with all methods
│       ├── index.ts       # Exports
│       └── types.ts       # TypeScript types
├── scripts/
│   └── interact.ts        # Demo script
├── idl/
│   └── gaia_solana.json   # Program IDL
├── package.json
└── tsconfig.json
```

## Notes

- The client uses RPC directly for account fetching due to Anchor 0.32 IDL format compatibility
- Some complex instructions (mint_tokens_to_user, tokenize_carbon_credit, transfer_gaia_e_tokens) require CPI to token program - use spl-token CLI or implement full SDK for those
- Wallet is auto-detected from `target/deploy/gaia_solana-keypair.json` or `~/.config/solana/id.json`

## Commands

```bash
npm run interact    # Run demo script with tsx
npm run lint        # Format code
```
