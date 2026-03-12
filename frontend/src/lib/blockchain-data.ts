export interface SolanaNetworkData {
  network: "Devnet" | "Mainnet";
  connectionStatus: "connected" | "disconnected" | "connecting";
  rpcEndpoint: string;
  currentSlot: number;
  tps: number;
  blockHeight: number;
}

export interface TokenMintData {
  totalMinted: number;
  tokenSymbol: string;
  latestTransaction: string;
  tokenMintAddress: string;
  programId: string;
  mintAuthority: string;
  decimals: number;
}

export interface BlockchainTransaction {
  id: string;
  signature: string;
  type: "mint" | "transfer" | "energy_record" | "verify";
  amount: number;
  token: string;
  timestamp: string;
  status: "confirmed" | "pending" | "failed";
}

export const mockSolanaNetwork: SolanaNetworkData = {
  network: "Devnet",
  connectionStatus: "connected",
  rpcEndpoint: "https://api.devnet.solana.com",
  currentSlot: 284729384,
  tps: 3427,
  blockHeight: 284729350,
};

export const mockTokenMint: TokenMintData = {
  totalMinted: 30636,
  tokenSymbol: "GAI",
  latestTransaction: "5sdfh83sdfh83df834hfd7834hfd7834hfd7834hf",
  tokenMintAddress: "GA1AaSFrT7BHvTq7vYVv7dJvP3kF5GxMqNsR8LwZ9HkC",
  programId: "GA1AGaiaProgram1111111111111111111111111111111",
  mintAuthority: "GA1AAuthority11111111111111111111111111111",
  decimals: 6,
};

export const mockBlockchainTransactions: BlockchainTransaction[] = [
  {
    id: "1",
    signature: "5sdfh83sdfh83df834hfd7834hfd7834hfd7834hf",
    type: "mint",
    amount: 125,
    token: "GAI",
    timestamp: "2 min ago",
    status: "confirmed",
  },
  {
    id: "2",
    signature: "3kjd9sdfh83df834hfd7834hfd7834hfd7834hf",
    type: "energy_record",
    amount: 125,
    token: "kWh",
    timestamp: "2 min ago",
    status: "confirmed",
  },
  {
    id: "3",
    signature: "7xkP2mNqR5sT8vW3yZ6aB9cD1eF4gH7jK0lM3nO6pQr",
    type: "mint",
    amount: 89,
    token: "GAI",
    timestamp: "5 min ago",
    status: "confirmed",
  },
  {
    id: "4",
    signature: "2mNqR5sT8vW3yZ6aB9cD1eF4gH7jK0lM3nO6pQrStU",
    type: "transfer",
    amount: 50,
    token: "GAI",
    timestamp: "8 min ago",
    status: "confirmed",
  },
  {
    id: "5",
    signature: "9vW3yZ6aB9cD1eF4gH7jK0lM3nO6pQrStUvX2yZ5aB",
    type: "verify",
    amount: 1,
    token: "Device",
    timestamp: "12 min ago",
    status: "confirmed",
  },
  {
    id: "6",
    signature: "1cD1eF4gH7jK0lM3nO6pQrStUvX2yZ5aB8cD1eF4gH",
    type: "mint",
    amount: 234,
    token: "GAI",
    timestamp: "15 min ago",
    status: "confirmed",
  },
  {
    id: "7",
    signature: "4gH7jK0lM3nO6pQrStUvX2yZ5aB8cD1eF4gH7jK0lM",
    type: "energy_record",
    amount: 234,
    token: "kWh",
    timestamp: "15 min ago",
    status: "confirmed",
  },
];

export const flowSteps = [
  {
    id: 1,
    title: "IoT Energy Device",
    subtitle: "Solar Panel / Meter",
    description: "Generates renewable energy and records kWh production",
    icon: "solar",
  },
  {
    id: 2,
    title: "Gaia Backend API",
    subtitle: "Data Processing",
    description: "Validates and processes energy data from devices",
    icon: "server",
  },
  {
    id: 3,
    title: "Gaia Dashboard",
    subtitle: "Frontend Interface",
    description: "Displays real-time energy and token information",
    icon: "dashboard",
  },
  {
    id: 4,
    title: "Solana Program",
    subtitle: "Smart Contract",
    description: "Executes token minting on Solana blockchain",
    icon: "blockchain",
  },
  {
    id: 5,
    title: "Gaia Tokens",
    subtitle: "Minted & Stored",
    description: "1 kWh = 1 GAI token stored on Solana",
    icon: "token",
  },
];
