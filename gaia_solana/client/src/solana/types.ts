import type { PublicKey } from '@solana/web3.js';

export type Address = string | PublicKey;

export interface Admin {
  address: PublicKey;
}

export interface CarbonCredit {
  tokenId: number;
  owner: PublicKey;
  projectId: string;
  co2Tonnes: number;
  certificateHash: string;
  verifierName: string;
  gpsCoords: string;
  startDate: bigint;
  endDate: bigint;
}

export interface Config {
  owner: PublicKey;
  vftMint: PublicKey;
  companyMint: PublicKey;
  carbonMint: PublicKey;
  gaiaEToGaiaRate: bigint;
  minConversionAmount: bigint;
  maxDailyConversion: bigint;
  minGaiaETransfer: bigint;
  maxGaiaEPerKwh: bigint;
  conversionCooldown: bigint;
  kwhPerToken: bigint;
  tokensPerSol: bigint;
  conversionRateVftToCompany: bigint;
  totalVftSwapped: bigint;
  totalCompanyTokensSent: bigint;
  nextTokenId: number;
  bump: number;
}

export interface Device {
  owner: PublicKey;
  serialNumber: string;
  location: string;
  deviceType: string;
  deviceBrand: string;
}

export interface EnergyProduction {
  producer: PublicKey;
  timestamp: bigint;
  kwhGenerated: bigint;
  gaiaEMinted: bigint;
}

export interface TransferRecord {
  from: PublicKey;
  to: PublicKey;
  amount: bigint;
  timestamp: bigint;
  tokenType: string;
}

export interface UsedHash {
  hash: string;
}

export type GaiaSolanaAccount =
  | Admin
  | CarbonCredit
  | Config
  | Device
  | EnergyProduction
  | TransferRecord
  | UsedHash;

export interface AddDeviceArgs {
  owner: PublicKey;
  serialNumber: string;
  location: string;
  deviceType: string;
  deviceBrand: string;
}

export interface MintTokensToUserArgs {
  amount: bigint;
}

export interface SetVftContractArgs {
  vftMint: PublicKey;
}

export interface TokenizeCarbonCreditArgs {
  projectId: string;
  co2Tonnes: number;
  certificateHash: string;
  verifierName: string;
  gpsCoords: string;
  recipient: PublicKey;
  startDate: bigint;
  endDate: bigint;
}

export interface TransferGaiaETokensArgs {
  amount: bigint;
}

export type GaiaSolanaInstructionArgs =
  | AddDeviceArgs
  | MintTokensToUserArgs
  | SetVftContractArgs
  | TokenizeCarbonCreditArgs
  | TransferGaiaETokensArgs;
