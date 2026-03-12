"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Server, Activity, Layers, Zap } from "lucide-react";
import { mockSolanaNetwork } from "@/lib/blockchain-data";

export function SolanaNetworkCard() {
  const network = mockSolanaNetwork;
  const isConnected = network.connectionStatus === "connected";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-[#066EB5]/5 to-white border-[#e5e0d8] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#6b6b6b] flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#066EB5] to-[#055a9a] rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              Solana Network
            </CardTitle>
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className={`${isConnected ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}
            >
              <div className={`w-2 h-2 rounded-full mr-1.5 ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Network Info */}
          <div className="flex items-center justify-between py-2 border-b border-[#e5e0d8]">
            <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              <Wifi className="w-4 h-4" />
              <span>Network</span>
            </div>
            <Badge className="bg-[#066EB5]/10 text-[#066EB5] border-0 font-medium">
              {network.network}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#e5e0d8]">
            <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              <Server className="w-4 h-4" />
              <span>RPC Endpoint</span>
            </div>
            <code className="text-xs bg-[#F6F3EC] px-2 py-1 rounded text-[#066EB5] font-mono">
              api.devnet.solana.com
            </code>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#e5e0d8]">
            <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              <Activity className="w-4 h-4" />
              <span>Current Slot</span>
            </div>
            <span className="text-sm font-semibold text-[#1a1a1a]">
              {network.currentSlot.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              <Zap className="w-4 h-4" />
              <span>TPS</span>
            </div>
            <span className="text-sm font-semibold text-[#F49136]">
              {network.tps.toLocaleString()}
            </span>
          </div>

          {/* Solana Logo */}
          <div className="absolute top-4 right-4 opacity-10">
            <svg width="60" height="60" viewBox="0 0 128 128" fill="#066EB5">
              <defs>
                <linearGradient id="solanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00FFA3" />
                  <stop offset="50%" stopColor="#03E1FF" />
                  <stop offset="100%" stopColor="#DC1FFF" />
                </linearGradient>
              </defs>
              <path d="M25 98L45 78H115L95 98H25Z" fill="url(#solanaGradient)" />
              <path d="M25 30L45 50H115L95 30H25Z" fill="url(#solanaGradient)" />
              <path d="M25 64L45 44H115L95 64H25Z" fill="url(#solanaGradient)" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
