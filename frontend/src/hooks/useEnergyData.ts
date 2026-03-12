"use client";

import { useState, useEffect } from "react";
import { mockEnergyData, generateMockLiveData, type EnergyData } from "@/lib/mock-data";

export function useEnergyData() {
  const [data, setData] = useState<EnergyData>(mockEnergyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setData(mockEnergyData);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    const liveData = generateMockLiveData();
    setData((prev) => ({
      ...prev,
      kwhGenerated: liveData.kwh,
      tokensMinted: liveData.kwh,
    }));
  };

  return { data, isLoading, refreshData };
}
