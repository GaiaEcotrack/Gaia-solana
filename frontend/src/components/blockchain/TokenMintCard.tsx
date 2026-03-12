"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Hash, FileCode, ExternalLink, Copy, Check } from "lucide-react";
import { mockTokenMint } from "@/lib/blockchain-data";
import { useState } from "react";

export function TokenMintCard() {
  const [copied, setCopied] = useState<string | null>(null);
  const tokenMint = mockTokenMint;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const truncateSignature = (sig: string) => {
    return `${sig.slice(0, 8)}...${sig.slice(-8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-[#F49136]/5 to-white border-[#e5e0d8] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#6b6b6b] flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F49136] to-[#e07d20] rounded-lg flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              Gaia Token Mint
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Minted */}
          <div className="bg-[#F6F3EC] rounded-xl p-4 text-center">
            <p className="text-xs text-[#6b6b6b] mb-1">Total Tokens Minted</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-[#F49136]">
                {tokenMint.totalMinted.toLocaleString()}
              </span>
              <span className="text-xl font-semibold text-[#904907]">
                {tokenMint.tokenSymbol}
              </span>
            </div>
          </div>

          {/* Latest Transaction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6b6b6b]">Latest Mint TX</span>
              <button
                onClick={() => copyToClipboard(tokenMint.latestTransaction, "tx")}
                className="flex items-center gap-1 text-xs text-[#066EB5] hover:text-[#055a9a]"
              >
                {copied === "tx" ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <code className="block bg-[#066EB5]/5 px-3 py-2 rounded-lg text-xs font-mono text-[#066EB5] truncate">
              {truncateSignature(tokenMint.latestTransaction)}
            </code>
          </div>

          {/* Token Mint Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6b6b6b] flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Token Mint Address
              </span>
              <button
                onClick={() => copyToClipboard(tokenMint.tokenMintAddress, "mint")}
                className="flex items-center gap-1 text-xs text-[#066EB5] hover:text-[#055a9a]"
              >
                {copied === "mint" ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <code className="block bg-[#F6F3EC] px-3 py-2 rounded-lg text-xs font-mono text-[#904907] truncate">
              {tokenMint.tokenMintAddress}
            </code>
          </div>

          {/* Program ID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6b6b6b] flex items-center gap-1">
                <FileCode className="w-3 h-3" />
                Program ID
              </span>
              <button
                onClick={() => copyToClipboard(tokenMint.programId, "program")}
                className="flex items-center gap-1 text-xs text-[#066EB5] hover:text-[#055a9a]"
              >
                {copied === "program" ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <code className="block bg-[#F6F3EC] px-3 py-2 rounded-lg text-xs font-mono text-[#904907] truncate">
              {tokenMint.programId}
            </code>
          </div>

          {/* Explorer Button */}
          <Button
            asChild
            className="w-full bg-[#066EB5] hover:bg-[#055a9a] text-white"
          >
            <a
              href={`https://explorer.solana.com/address/${tokenMint.tokenMintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Solana Explorer
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
