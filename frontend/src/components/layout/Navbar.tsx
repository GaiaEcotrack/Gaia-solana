"use client";

import { motion } from "framer-motion";
import { Sun, Leaf, Zap } from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#e5e0d8] shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F49136] to-[#F6B07D] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-[#F49136] to-[#904907] bg-clip-text text-transparent">
                Gaia Ecotrack
              </span>
              <span className="text-xs text-[#6b6b6b] -mt-0.5">
                Powered by Solana
              </span>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <motion.a
              href="/"
              className="flex items-center gap-2 text-[#1a1a1a] font-medium hover:text-[#F49136] transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-[#F49136]" />
              Dashboard
            </motion.a>
            <motion.a
              href="#projects"
              className="flex items-center gap-2 text-[#6b6b6b] font-medium hover:text-[#066EB5] transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Sun className="w-4 h-4" />
              Projects
            </motion.a>
          </div>

          {/* Wallet Connect */}
          <WalletConnectButton />
        </div>
      </div>
    </motion.nav>
  );
}
