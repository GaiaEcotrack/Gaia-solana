import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/index';

// Utils
import { BalanceTokenCompany } from '@/pages/home/BalanceTokenCompany';

interface Props {
  onClick?: () => void;
}

interface CryptoValues {
  gaia: number;
  vara: number;
}

interface PercentageChanges {
  gaia: number;
  vara: number;
}

/**
 * Formatea un número de manera escalable con notación compacta (K, M, B)
 * Ejemplos: 9,999,999.999 -> "9,999,999.999", 150000000 -> "150M"
 */
const formatScalableNumber = (value: number): string => {
  const absValue = Math.abs(value);
  
  // Si es 0, retornar directamente
  if (absValue === 0) {
    return '0.00';
  }
  
  // Números muy pequeños (menores a 0.01)
  if (absValue < 0.01 && absValue > 0) {
    return value.toFixed(4);
  }
  
  // Números menores a 100 millones: usar separadores de miles con precisión
  if (absValue < 100000000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(value);
  }
  
  // Números mayores a 100 millones: usar notación compacta
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
};

const DashboardCard02: React.FC<Props> = ({ onClick }) => {
  // Valores iniciales del store (pueden ser 0 o valores reales)
  const gaiaFromStore = useSelector((state: RootState) => state.app.valueGaia);
  const varaFromStore = useSelector((state: RootState) => state.app.valueVara);

  // Cantidades (pueden actualizarse cuando cambia el store)
  const [quantities, setQuantities] = useState<CryptoValues>({ gaia: gaiaFromStore, vara: varaFromStore });

  // Valores simulados actuales de cada cripto
  const [cryptoValues, setCryptoValues] = useState<CryptoValues>({ gaia: 0.126, vara: 50.5 });

  // Porcentajes de cambio simulados
  const [percentageChanges, setPercentageChanges] = useState<PercentageChanges>({ gaia: 0, vara: 0 });

  // Referencia para suavizado (promedio móvil exponencial)
  const previousPercentageRef = useRef<PercentageChanges>({ gaia: 0, vara: 0 });

  // Actualizar cantidades si cambian en el store
  useEffect(() => {
    setQuantities({ gaia: gaiaFromStore, vara: varaFromStore });
  }, [gaiaFromStore, varaFromStore]);

  // Simulación mejorada de cambio con movimiento browniano y suavizado
  useEffect(() => {
    const updateInterval = 3000; // Intervalo en ms
    const volatility = 0.5; // Volatilidad en %
    const smoothingFactor = 0.7; // Factor de suavizado (0-1)
    const minPercentage = -2; // Porcentaje mínimo de cambio
    const maxPercentage = 2; // Porcentaje máximo de cambio

    const intervalId = setInterval(() => {
      // Generar cambio aleatorio usando distribución normal aproximada
      // (suma de varios random para aproximar curva de campana)
      const generateNormalRandom = () => {
        let sum = 0;
        for (let i = 0; i < 6; i++) {
          sum += Math.random();
        }
        return (sum - 3) / 3; // Normalizado a [-1, 1]
      };

      // Calcular nuevo cambio con volatilidad
      const rawChangeGaia = generateNormalRandom() * volatility;
      const rawChangeVara = generateNormalRandom() * volatility;

      // Aplicar límites
      const boundedChangeGaia = Math.max(
        minPercentage,
        Math.min(maxPercentage, rawChangeGaia)
      );
      const boundedChangeVara = Math.max(
        minPercentage,
        Math.min(maxPercentage, rawChangeVara)
      );

      // Aplicar suavizado (exponential moving average)
      const smoothedChangeGaia =
        smoothingFactor * boundedChangeGaia +
        (1 - smoothingFactor) * previousPercentageRef.current.gaia;
      
      const smoothedChangeVara =
        smoothingFactor * boundedChangeVara +
        (1 - smoothingFactor) * previousPercentageRef.current.vara;

      const nuevosPorcentajes: PercentageChanges = {
        gaia: smoothedChangeGaia,
        vara: smoothedChangeVara,
      };

      // Guardar para el próximo ciclo
      previousPercentageRef.current = nuevosPorcentajes;

      setPercentageChanges(nuevosPorcentajes);

      // Actualizar precios con suavizado adicional en el cambio de precio
      setCryptoValues((prev) => {
        // Calcular nuevo precio con cambio suavizado
        const newGaia = prev.gaia * (1 + nuevosPorcentajes.gaia / 100);
        const newVara = prev.vara * (1 + nuevosPorcentajes.vara / 100);

        // Aplicar suavizado al precio mismo (mezcla entre precio anterior y nuevo)
        const priceSmoothingFactor = 0.9; // Cuánto del precio anterior mantener
        return {
          gaia: priceSmoothingFactor * prev.gaia + (1 - priceSmoothingFactor) * newGaia,
          vara: priceSmoothingFactor * prev.vara + (1 - priceSmoothingFactor) * newVara,
        };
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, []);

  // Calcular valores totales con memoización para evitar cálculos innecesarios
  const totalGaia = useMemo(() => {
    // Si no hay tokens, el balance es 0
    if (quantities.gaia === 0 || !quantities.gaia) {
      return 0;
    }
    return quantities.gaia * cryptoValues.gaia;
  }, [quantities.gaia, cryptoValues.gaia]);

  // Si no hay tokens, no mostrar porcentaje de cambio
  const hasTokens = quantities.gaia > 0;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <img src="/LogoGaia.svg" width={32} height={32} alt="Gaia Logo" />
          {/* Puedes habilitar botón si quieres */}
          {/* <button
            onClick={onClick}
            className="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white"
          >
            Send
          </button> */}
        </header>

        <h2 className="text-lg font-semibold text-slate-800 mb-2">Gaia</h2>
        <h1 className="text-lg font-semibold text-slate-800 mb-2">Tokens</h1>

        <BalanceTokenCompany />

        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Balance</div>

        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2">
            {totalGaia === 0 ? '$0.00' : `$${formatScalableNumber(totalGaia)}`}
          </div>
          {hasTokens && (
            <div className={`text-sm font-semibold text-white px-1.5 rounded-full ${
              percentageChanges.gaia >= 0 ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              {percentageChanges.gaia >= 0 ? '+' : ''}{percentageChanges.gaia.toFixed(2)}%
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default DashboardCard02;
