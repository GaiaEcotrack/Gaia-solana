import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { LocalBalanceToken } from '@/pages/home/MyBalanceToken';


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

/**
 * Hook mejorado para simular precios de criptomonedas usando movimiento browniano
 * con suavizado y límites para un comportamiento más realista
 */
const useCryptoSimulator = (
  initialValues: CryptoValues,
  options: {
    updateInterval?: number; // Intervalo en ms (default: 3000)
    volatility?: number; // Volatilidad en % (default: 0.5)
    smoothingFactor?: number; // Factor de suavizado 0-1 (default: 0.7)
    minPercentage?: number; // Porcentaje mínimo de cambio (default: -2%)
    maxPercentage?: number; // Porcentaje máximo de cambio (default: 2%)
  } = {}
) => {
  const {
    updateInterval = 3000,
    volatility = 0.5,
    smoothingFactor = 0.7,
    minPercentage = -2,
    maxPercentage = 2,
  } = options;

  const [valoresCrypto, setValoresCrypto] = useState<CryptoValues>(initialValues);
  const [porcentajesCambio, setPorcentajesCambio] = useState<PercentageChanges>({ gaia: 0, vara: 0 });
  
  // Memoria para suavizado (promedio móvil exponencial)
  const previousPercentageRef = useRef<PercentageChanges>({ gaia: 0, vara: 0 });

  useEffect(() => {
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

      setPorcentajesCambio(nuevosPorcentajes);

      // Actualizar precios con suavizado adicional en el cambio de precio
      setValoresCrypto((prev) => {
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
  }, [updateInterval, volatility, smoothingFactor, minPercentage, maxPercentage]);

  return { valoresCrypto, porcentajesCambio };
};

const DashboardCard01: React.FC<Props> = ({ onClick }) => {
  // Estos vienen del store, pero para el simulador puedes inicializar con valores fijos
  const gaia = useSelector((state: RootState) => state.app.valueGaia);
  const vara = useSelector((state: RootState) => state.app.valueVara);

  

  const [cantidad, setCantidad] = useState({ gaia, vara });

  useEffect(() => {
    setCantidad({ gaia, vara });
  }, [gaia, vara]);

  // Simulación mejorada con parámetros configurados
  const { valoresCrypto, porcentajesCambio } = useCryptoSimulator(
    { gaia: 0.126, vara: 50.5 },
    {
      updateInterval: 3000, // Actualizar cada 3 segundos
      volatility: 0.5, // Volatilidad moderada (0.5%)
      smoothingFactor: 0.7, // Suavizado medio-alto
      minPercentage: -2, // Máximo -2% de caída
      maxPercentage: 2, // Máximo +2% de subida
    }
  );

  const calcularValorTotal = (cantidad: number, valor: number) => cantidad * valor;

  // Si no hay tokens, el balance es 0
  const totalGaia = cantidad.gaia === 0 || !cantidad.gaia 
    ? 0 
    : calcularValorTotal(cantidad.gaia, valoresCrypto.gaia);

  // Si no hay tokens, no mostrar porcentaje de cambio
  const hasTokens = cantidad.gaia > 0;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <img src="/LogoGaia.svg" width="32" height="32" alt="Gaia" />
        </header>

        <h2 className="text-lg font-semibold text-slate-800 mb-2">Gaia Energy</h2>
        <h1 className="text-lg font-semibold text-slate-800 mb-2">Tokens</h1>

        <LocalBalanceToken />

        <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Balance</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2">
            {totalGaia === 0 ? '$0.00' : `$${formatScalableNumber(totalGaia)}`}
          </div>
          {hasTokens && (
            <div className={`text-sm font-semibold text-white px-1.5 rounded-full ${
              porcentajesCambio.gaia >= 0 ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              {porcentajesCambio.gaia >= 0 ? '+' : ''}{porcentajesCambio.gaia.toFixed(2)}%
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default DashboardCard01;
