"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { type EnergyData } from "@/lib/mock-data";

const PROGRAM_ID = new PublicKey(
  "3h66uneMsNnnByaSTSFBhz6S69ZATHbRhriFq8KaWDwP"
);
// Este es el Mint address que tienes en tu config
const VFT_MINT_PUBKEY = new PublicKey(
  "EVrNjUkZCKvouQ16Qi6hVhYZwgGaYQ4sZTkTWtScVZdF"
);

export function useEnergyData() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [data, setData] = useState<EnergyData>({
    kwhGenerated: 0,
    tokensMinted: 0,
    deviceId: "GAIA-001",
    project: "Parque Solar La Guajira",
    location: "La Guajira, Colombia",
    status: "online",
  });
  
  const [isLoading, setIsLoading] = useState(true);

  const fetchRealData = async () => {
    if (!publicKey) {
      // Si no hay wallet cargamos datos en 0
      setData((prev) => ({ ...prev, kwhGenerated: 0, tokensMinted: 0 }));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Obtener los kWh totales generados leyendo el PDA del Smart Contract
      let kwh = 0;
      const [energyProductionPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("energy_production"), publicKey.toBuffer()],
        PROGRAM_ID
      );

      const pdaInfo = await connection.getAccountInfo(energyProductionPda);
      
      if (pdaInfo) {
        // En Anchor, los primeros 8 bytes son el discriminador. 
        // Luego vienen los datos (producer=32 bytes, timestamp=8 bytes, kwh_generated=8 bytes)
        // Offset: 8 + 32 + 8 = 48 -> a partir de ese byte leemos `kwh_generated`
        const buffer = pdaInfo.data;
        if (buffer.length >= 56) {
          const kwhBigInt = buffer.readBigUInt64LE(48);
          // Dividimos en caso de que manejes el valor con decimales o lo dejamos entero
          kwh = Number(kwhBigInt);
        }
      }

      // 2. Obtener la cantidad de tokens GAI ya transferidos/minteados a la wallet
      let userBalance = 0;
      const ata = await getAssociatedTokenAddress(VFT_MINT_PUBKEY, publicKey);
      const tokenAccountInfo = await connection.getAccountInfo(ata);
      
      if (tokenAccountInfo) {
        // En un ATA normal estándar, el balance (raw u64) está en el offset 64
        const balanceBigInt = tokenAccountInfo.data.readBigUInt64LE(64);
        
        // Asumiendo que tu token tiene 9 decimales (común en Solana) o 0 decimales
        // Si tiene decimales: userBalance = Number(balanceBigInt) / Math.pow(10, 9);
        // Si no tiene decimales los mostramos tal cual:
        userBalance = Number(balanceBigInt); 
      }

      // 3. Calculamos la energía "pendiente" por mintear = Generada - Minteada
      // Simulamos que el dispositivo IoT (ej: en background) reporta 15 kWh extras
      const extraKwhPendientes = 15; 
      
      setData((prev) => ({
        ...prev,
        // Mostramos el histórico real + un dummy reportado por IoT para poder darle a Claim
        kwhGenerated: kwh + extraKwhPendientes,
        // Tokens ya reclamados
        tokensMinted: userBalance, 
      }));

    } catch (error) {
      console.error("Error obteniendo datos reales de Solana:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection]);

  return { data, isLoading, refreshData: fetchRealData };
}
