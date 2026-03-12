"use client";

import { motion } from "framer-motion";
import { SolanaNetworkCard } from "@/components/blockchain/SolanaNetworkCard";
import { TokenMintCard } from "@/components/blockchain/TokenMintCard";
import { BlockchainActivityCard } from "@/components/blockchain/BlockchainActivityCard";
import { EnergyFlowDiagram } from "@/components/blockchain/EnergyFlowDiagram";
import { Link2, Shield, Zap } from "lucide-react";

export function SolanaIntegration() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      id="blockchain"
      className="mt-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#066EB5] to-[#055a9a] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">
            Solana Integration & Energy Data Flow
          </h2>
          <p className="text-sm text-[#6b6b6b]">
            Blockchain-powered renewable energy tokenization
          </p>
        </div>
      </div>

      {/* Part 1: Solana Blockchain Status - 3 Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SolanaNetworkCard />
        <TokenMintCard />
        <BlockchainActivityCard />
      </div>

      {/* Part 2: Energy Flow Diagram */}
      <EnergyFlowDiagram />

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-6 py-4"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#e5e0d8]">
          <Shield className="w-4 h-4 text-[#066EB5]" />
          <span className="text-sm text-[#6b6b6b]">On-chain Verification</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#e5e0d8]">
          <Zap className="w-4 h-4 text-[#F49136]" />
          <span className="text-sm text-[#6b6b6b]">Real-time Minting</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#e5e0d8]">
          <Link2 className="w-4 h-4 text-[#904907]" />
          <span className="text-sm text-[#6b6b6b]">Solana Devnet</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
