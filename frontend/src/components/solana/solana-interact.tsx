"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { Transaction } from "@solana/web3.js";

// Suponiendo que tu NestJS corre en el puerto 3001
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function SolanaInteract() {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInteract = async () => {
    if (!publicKey || !signTransaction) {
      setError("Por favor conecta tu wallet primero.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const rewardAmount = 100; // Aquí simularíamos los tokens a mintear, puedes reemplazarlo con prop.

      // 1. Pedir al Backend (NestJS) que construya la transacción
      const buildResponse = await fetch(`${BACKEND_URL}/solana/execute/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userPublicKey: publicKey.toBase58(),
          amount: rewardAmount
        }),
      });

      if (!buildResponse.ok) {
        throw new Error("Error al construir la transacción de minteo en el backend");
      }

      const { transactionBase64 } = await buildResponse.json();

      // 2. Deserializar la transacción en el Frontend
      const transactionBuffer = Buffer.from(transactionBase64, "base64");
      const transaction = Transaction.from(transactionBuffer);

      // 3. Solicitar al usuario (Phantom) que firme la transacción
      const signedTransaction = await signTransaction(transaction);

      // Serializamos de nuevo para enviarla al backend
      const signedTxBase64 = signedTransaction
        .serialize({ requireAllSignatures: false })
        .toString("base64");

      // 4. Enviar la transacción firmada al Backend para que la retransmita (broadcast)
      const sendResponse = await fetch(`${BACKEND_URL}/solana/execute/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedTxBase64 }),
      });

      if (!sendResponse.ok) {
        throw new Error("Error al enviar la transacción al backend");
      }

      const sendResult = await sendResponse.json();
      setResult(`¡Éxito! Firma de la transacción: ${sendResult.signature}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 rounded-xl shadow-md flex flex-col items-center space-y-4 text-white">
      <h2 className="text-xl font-bold">Interacción con Smart Contract</h2>

      {/* Botón oficial de Solana para conectar Phantom */}
      <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 transition" />

      {publicKey && (
        <div className="w-full">
          <p className="text-sm text-gray-400 mb-4 break-all">
            Conectado: {publicKey.toBase58()}
          </p>

          <button
            onClick={handleInteract}
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-semibold text-white transition ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Procesando..." : "Ejecutar Transacción"}
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm w-full mt-2 break-words">{error}</p>}
      {result && (
        <div className="mt-4 p-3 bg-green-900 bg-opacity-50 border border-green-500 rounded w-full">
          <p className="text-sm text-green-400 break-words">{result}</p>
        </div>
      )}
    </div>
  );
}
