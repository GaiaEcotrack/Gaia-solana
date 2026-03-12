export interface EnergyData {
  deviceId: string;
  project: string;
  location: string;
  kwhGenerated: number;
  tokensMinted: number;
  status: "online" | "offline" | "maintenance";
}

export interface Project {
  id: string;
  name: string;
  location: string;
  department: string;
  deviceType: "solar" | "wind" | "hydro";
  deviceId: string;
  kwhGenerated: number;
  tokensMinted: number;
  status: "online" | "offline" | "maintenance";
  currentOutput: number; // in kW
  lastUpdate: string;
  coordinates: {
    x: number; // percentage position on map (0-100)
    y: number;
  };
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: string;
  manufacturer: string;
  currentPowerOutput: number;
  totalLifetimeKwh: number;
  lastDataUpdate: string;
  solanaAddress: string;
  firmwareVersion: string;
  installationDate: string;
}

export const mockEnergyData: EnergyData = {
  deviceId: "GAIA-001",
  project: "Parque Solar La Guajira",
  location: "La Guajira, Colombia",
  kwhGenerated: 1250,
  tokensMinted: 1250,
  status: "online",
};

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Parque Solar La Guajira",
    location: "Uribia, La Guajira",
    department: "La Guajira",
    deviceType: "solar",
    deviceId: "GAIA-001",
    kwhGenerated: 2450,
    tokensMinted: 2450,
    status: "online",
    currentOutput: 145.8,
    lastUpdate: "2 min ago",
    coordinates: { x: 72, y: 12 }, // La Guajira
  },
  {
    id: "2",
    name: "Parque Eólico Jepírachi",
    location: "Puerto Bolívar, La Guajira",
    department: "La Guajira",
    deviceType: "wind",
    deviceId: "GAIA-002",
    kwhGenerated: 3420,
    tokensMinted: 3420,
    status: "online",
    currentOutput: 198.3,
    lastUpdate: "1 min ago",
    coordinates: { x: 75, y: 15 }, // Puerto Bolívar
  },
  {
    id: "3",
    name: "Solar Cundinamarca",
    location: "Bogotá, Cundinamarca",
    department: "Cundinamarca",
    deviceType: "solar",
    deviceId: "GAIA-003",
    kwhGenerated: 856,
    tokensMinted: 856,
    status: "online",
    currentOutput: 42.1,
    lastUpdate: "3 min ago",
    coordinates: { x: 50, y: 48 }, // Bogotá
  },
  {
    id: "4",
    name: "Hidroeléctrica Guatapé",
    location: "Guatapé, Antioquia",
    department: "Antioquia",
    deviceType: "hydro",
    deviceId: "GAIA-004",
    kwhGenerated: 5100,
    tokensMinted: 5100,
    status: "online",
    currentOutput: 320.5,
    lastUpdate: "1 min ago",
    coordinates: { x: 46, y: 38 }, // Antioquia
  },
  {
    id: "5",
    name: "Parque Solar Tolima",
    location: "Ibagué, Tolima",
    department: "Tolima",
    deviceType: "solar",
    deviceId: "GAIA-005",
    kwhGenerated: 1680,
    tokensMinted: 1680,
    status: "maintenance",
    currentOutput: 0,
    lastUpdate: "15 min ago",
    coordinates: { x: 44, y: 52 }, // Tolima
  },
  {
    id: "6",
    name: "Central Hidroeléctrica Chivor",
    location: "Boyacá",
    department: "Boyacá",
    deviceType: "hydro",
    deviceId: "GAIA-006",
    kwhGenerated: 6230,
    tokensMinted: 6230,
    status: "online",
    currentOutput: 412.7,
    lastUpdate: "30 sec ago",
    coordinates: { x: 52, y: 42 }, // Boyacá
  },
  {
    id: "7",
    name: "Eólico Atlántico",
    location: "Barranquilla, Atlántico",
    department: "Atlántico",
    deviceType: "wind",
    deviceId: "GAIA-007",
    kwhGenerated: 2890,
    tokensMinted: 2890,
    status: "online",
    currentOutput: 156.2,
    lastUpdate: "5 min ago",
    coordinates: { x: 60, y: 25 }, // Atlántico
  },
  {
    id: "8",
    name: "Solar Valle del Cauca",
    location: "Cali, Valle del Cauca",
    department: "Valle del Cauca",
    deviceType: "solar",
    deviceId: "GAIA-008",
    kwhGenerated: 1920,
    tokensMinted: 1920,
    status: "online",
    currentOutput: 89.4,
    lastUpdate: "2 min ago",
    coordinates: { x: 35, y: 62 }, // Valle del Cauca
  },
  {
    id: "9",
    name: "Hidroeléctrica Betania",
    location: "Huila",
    department: "Huila",
    deviceType: "hydro",
    deviceId: "GAIA-009",
    kwhGenerated: 4750,
    tokensMinted: 4750,
    status: "online",
    currentOutput: 285.3,
    lastUpdate: "1 min ago",
    coordinates: { x: 48, y: 60 }, // Huila
  },
  {
    id: "10",
    name: "Solar Meta",
    location: "Villavicencio, Meta",
    department: "Meta",
    deviceType: "solar",
    deviceId: "GAIA-010",
    kwhGenerated: 1340,
    tokensMinted: 1340,
    status: "online",
    currentOutput: 67.8,
    lastUpdate: "4 min ago",
    coordinates: { x: 55, y: 52 }, // Meta
  },
];

export const mockDeviceInfo: DeviceInfo = {
  deviceId: "GAIA-001",
  deviceType: "Solar Panel Array - Monocrystalline",
  manufacturer: "Gaia Energy Systems",
  currentPowerOutput: 145.8,
  totalLifetimeKwh: 2450,
  lastDataUpdate: "2024-01-15 14:32:45 UTC",
  solanaAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  firmwareVersion: "v2.4.1",
  installationDate: "2023-06-15",
};

export const generateMockLiveData = (): { kwh: number; output: number } => {
  const kwh = Math.floor(2450 + Math.random() * 10);
  const output = parseFloat((145 + Math.random() * 5).toFixed(1));
  return { kwh, output };
};
