"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp } from "lucide-react";
import { useEnergyData } from "@/hooks/useEnergyData";

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => Math.floor(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      setDisplayValue(v);
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <span className="text-5xl font-bold bg-gradient-to-r from-[#F49136] to-[#F6B07D] bg-clip-text text-transparent">
      {displayValue.toLocaleString()}
    </span>
  );
}

export function EnergyCard() {
  const { data, isLoading } = useEnergyData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-white to-[#F6F3EC] border-[#e5e0d8] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-[#6b6b6b] flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F49136] to-[#e07d20] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            Energy Generated
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
                <AnimatedCounter value={data.kwhGenerated} />
                <span className="text-2xl font-semibold text-[#904907]">kWh</span>
              </div>
              <p className="text-sm text-[#6b6b6b]">
                Total renewable energy generated
              </p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% from last week</span>
              </div>
            </div>
          )}
        </CardContent>
        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#F49136]/10 rounded-full blur-xl" />
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#F49136] rounded-full animate-ping" />
      </Card>
    </motion.div>
  );
}
