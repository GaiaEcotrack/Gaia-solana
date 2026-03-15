import { useState, useEffect } from "react";
import { useAccount } from "@gear-js/react-hooks";
import { useDispatch } from "react-redux";
import axios from "axios";

/**
 * Formatea un número de manera escalable con notación compacta (K, M, B)
 * Ejemplos: 9,999,999.999 -> "9,999,999.999", 150000000 -> "150M"
 */
const formatScalableNumber = (value: number): string => {
  const absValue = Math.abs(value);
  
  // Si es 0, retornar directamente
  if (absValue === 0) {
    return '0.000';
  }
  
  // Números muy pequeños (menores a 0.01)
  if (absValue < 0.01 && absValue > 0) {
    return value.toFixed(4);
  }
  
  // Números menores a 100 millones: usar separadores de miles con precisión (3 decimales para tokens)
  if (absValue < 100000000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 3,
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

function LocalBalanceToken() {
  const { account } = useAccount();
  const dispatch = useDispatch();

  const [balance, setBalance] = useState<number | null>(null);
  const api = import.meta.env.VITE_APP_API_EXPRESS;

  const DECIMALS = 3; // Ajustar según los decimales de tu token

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
          `${api}/service/query/GaiaService/TotalTokensEnergy`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.ok !== undefined) {
          const rawBalance = response.ok;
          const adjustedBalance = rawBalance / Math.pow(10, DECIMALS);

          setBalance(adjustedBalance);

          dispatch({
            type: "SET_VALUE_GAIA",
            payload: adjustedBalance,
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
  const formattedBalance = balance === 0 || !balance 
    ? '0.000' 
    : formatScalableNumber(balance);

  return (
    <div>
      <h2 className="text-3xl text-slate-800">{formattedBalance}</h2>
    </div>
  );
}

export { LocalBalanceToken };
