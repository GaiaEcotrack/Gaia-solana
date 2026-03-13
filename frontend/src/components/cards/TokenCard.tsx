"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Sparkles, ArrowDownToLine, CheckCircle2 } from "lucide-react";
import { useEnergyData } from "@/hooks/useEnergyData";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function TokenCard() {
  const { data, isLoading: dataLoading } = useEnergyData();
  const { publicKey, signTransaction } = useWallet();

  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<"idle" | "success" | "error">("idle");
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // Cantidad de tokens a reclamar basada en la data o estática para la demo
  const claimableAmount = data?.kwhGenerated ? data.kwhGenerated : 100;

  const handleClaimReward = async () => {
    if (!publicKey || !signTransaction) return;

    setIsMinting(true);
    setMintStatus("idle");
    setTxSignature(null);

    try {
      // 1. Pedir a NestJS Transaction sin firmar
      const buildRes = await fetch(`${BACKEND_URL}/solana/execute/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPublicKey: publicKey.toBase58(),
          amount: claimableAmount
        }),
      });

      if (!buildRes.ok) throw new Error("Error en Backend al construir Tx");
      const { transactionBase64 } = await buildRes.json();

      // 2. Firmar localmente
      const transaction = Transaction.from(Buffer.from(transactionBase64, "base64"));
      const signedTransaction = await signTransaction(transaction);
      const signedTxBase64 = signedTransaction
        .serialize({ requireAllSignatures: false })
        .toString("base64");

      // 3. Enviar a NestJS
      const sendRes = await fetch(`${BACKEND_URL}/solana/execute/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedTxBase64 }),
      });

      if (!sendRes.ok) throw new Error("Error en Broadcast");

      const { signature } = await sendRes.json();
      setTxSignature(signature);
      setMintStatus("success");
    } catch (err) {
      console.error(err);
      setMintStatus("error");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-[#066EB5]/5 to-white border-[#e5e0d8] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-[#6b6b6b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#066EB5] to-[#055a9a] rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              Gaia Tokens Minted
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          {dataLoading ? (
            <div className="space-y-4">
              <div className="h-16 bg-[#f0ebe3] rounded animate-pulse" />
              <div className="h-4 bg-[#f0ebe3] rounded animate-pulse w-2/3" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#066EB5]">
                    {data.tokensMinted.toLocaleString()}
                  </span>
                  <span className="text-2xl font-semibold text-[#F49136]">GAI</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Sparkles className="w-4 h-4 text-[#F49136]" />
                  <span className="text-[#6b6b6b]">1 kWh = 1 Gaia Token</span>
                </div>
              </div>

              <div className="px-3 py-2 bg-[#066EB5]/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#066EB5]">Token Value</span>
                  <span className="text-sm font-semibold text-[#066EB5]">$0.85 GAI</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2 relative z-10">
                {!publicKey ? (
                  <WalletMultiButton className="!w-full !bg-purple-600 hover:!bg-purple-700 !h-10 !rounded-lg !flex !justify-center !text-sm" />
                ) : (
                  <button
                    onClick={handleClaimReward}
                    disabled={isMinting || mintStatus === "success"}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${mintStatus === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : isMinting
                        ? "bg-gray-100 text-gray-400 cursor-wait"
                        : "bg-gradient-to-r from-[#F49136] to-[orange] text-white hover:shadow-md"
                      }`}
                  >
                    {mintStatus === "success" ? (
                      <><CheckCircle2 className="w-4 h-4" /> ¡{claimableAmount} GAI Reclamados!</>
                    ) : isMinting ? (
                      "Procesando Firma..."
                    ) : (
                      <><ArrowDownToLine className="w-4 h-4" /> Claim Reward ({claimableAmount} GAI)</>
                    )}
                  </button>
                )}

                {mintStatus === "error" && (
                  <span className="text-xs text-red-500 text-center">Falló el minteo. Intenta recargar.</span>
                )}
                {txSignature && (
                  <a href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 text-center hover:underline truncate">
                    Tx: {txSignature}
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#F49136]/20 rounded-full blur-xl pointer-events-none" />
        <motion.div
          className="absolute top-3 right-3 pointer-events-none"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-5 h-5 text-[#F49136]" />
        </motion.div>
      </Card>
    </motion.div>
  );
}
