"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Sparkles, ArrowUpRight } from "lucide-react";
import { useEnergyData } from "@/hooks/useEnergyData";

export function TokenCard() {
  const { data, isLoading } = useEnergyData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-[#066EB5]/5 to-white border-[#e5e0d8] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-[#6b6b6b] flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#066EB5] to-[#055a9a] rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            Gaia Tokens Minted
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-16 bg-[#f0ebe3] rounded animate-pulse" />
              <div className="h-4 bg-[#f0ebe3] rounded animate-pulse w-2/3" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-[#066EB5]">
                  {data.tokensMinted.toLocaleString()}
                </span>
                <span className="text-2xl font-semibold text-[#F49136]">GAI</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-[#F49136]" />
                <span className="text-[#6b6b6b]">
                  1 kWh = 1 Gaia Token
                </span>
              </div>
              <div className="mt-2 px-3 py-2 bg-[#066EB5]/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#066EB5]">Token Value</span>
                  <span className="text-sm font-semibold text-[#066EB5]">$0.85 GAI</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#F49136]/20 rounded-full blur-xl" />
        <motion.div
          className="absolute top-3 right-3"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-5 h-5 text-[#F49136]" />
        </motion.div>
      </Card>
    </motion.div>
  );
}
