import { useState, useEffect } from "react";
import { useAccount } from "@gear-js/react-hooks";
import { useDispatch } from "react-redux";
import axios from "axios";

/**
 * Formatea un número de manera escalable con separadores de miles y notación compacta solo para números extremadamente grandes
 * Ejemplos: 999,700,000,019.999 -> "999,700,000,019.999", 1500000000000 -> "1.5T"
 */
const formatScalableNumber = (value: string | number): string => {
  // Convertir string a número si es necesario
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Validar que el valor sea un número válido
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return '0.000';
  }
  
  const absValue = Math.abs(numValue);
  
  // Si es 0, retornar directamente
  if (absValue === 0) {
    return '0.000';
  }
  
  // Números muy pequeños (menores a 0.01)
  if (absValue < 0.01 && absValue > 0) {
    return numValue.toFixed(4);
  }
  
  // Números menores a 1 trillón (1,000,000,000,000): usar separadores de miles con precisión (3 decimales para tokens)
  // Esto incluye números como 999,700,000,019.999
  if (absValue < 1000000000000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(numValue);
  }
  
  // Números mayores o iguales a 1 trillón: usar notación compacta
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  }).format(numValue);
};

const DECIMALS = 18n; // 👈 usamos BigInt para evitar errores

function BalanceTokenCompany() {
  const { account } = useAccount();
  const dispatch = useDispatch();

  const [balance, setBalance] = useState<string | null>(null);
  const api = import.meta.env.VITE_APP_API_EXPRESS;

  useEffect(() => {
    if (!account?.decodedAddress) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found in localStorage");
          return;
        }

        const data = [account.decodedAddress];

        const { data: response } = await axios.post(
          `${api}/service/query/GaiaService/TotalTokensCompany`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.ok !== undefined) {
          const rawBalance = BigInt(response.ok); // asegúrate que response.ok es string o número entero

          // Convertimos a string con decimales
          const divisor = 10n ** DECIMALS;
          const integerPart = rawBalance / divisor;
          const decimalPart = (rawBalance % divisor).toString().padStart(Number(DECIMALS), "0").slice(0, 3); // solo 3 decimales visibles

          const formattedBalance = `${integerPart}.${decimalPart}`;

          setBalance(formattedBalance);

          dispatch({
            type: "SET_VALUE_GAIA",
            payload: formattedBalance,
          });
        } else {
          console.warn("Respuesta inesperada:", response);
        }
      } catch (error) {
        console.error("Error al obtener el balance:", error);
      }
    };

    fetchData();
  }, [account?.decodedAddress, api, dispatch]);

  if (balance === null) return <div className="text-black">Cargando balance...</div>;

  // Formatear el balance de manera escalable
  const formattedBalance = balance === '0.000' || !balance || parseFloat(balance) === 0
    ? '0.000'
    : formatScalableNumber(balance);

  return (
    <div>
      <h2 className="text-3xl text-slate-800">{formattedBalance}</h2>
    </div>
  );
}

export { BalanceTokenCompany };
