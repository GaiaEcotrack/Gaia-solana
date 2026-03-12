"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Server, LayoutDashboard, Link2, Coins, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const flowSteps = [
  {
    id: 1,
    title: "IoT Energy Device",
    subtitle: "Solar Panel / Meter",
    description: "Generates renewable energy and records kWh production",
    icon: Sun,
    color: {
      bg: "bg-[#F49136]",
      light: "bg-[#F49136]/10",
      text: "text-[#F49136]",
      border: "border-[#F49136]/30",
    },
  },
  {
    id: 2,
    title: "Gaia Backend API",
    subtitle: "Data Processing",
    description: "Validates and processes energy data from devices",
    icon: Server,
    color: {
      bg: "bg-[#066EB5]",
      light: "bg-[#066EB5]/10",
      text: "text-[#066EB5]",
      border: "border-[#066EB5]/30",
    },
  },
  {
    id: 3,
    title: "Gaia Dashboard",
    subtitle: "Frontend Interface",
    description: "Displays real-time energy and token information",
    icon: LayoutDashboard,
    color: {
      bg: "bg-[#904907]",
      light: "bg-[#904907]/10",
      text: "text-[#904907]",
      border: "border-[#904907]/30",
    },
  },
  {
    id: 4,
    title: "Solana Program",
    subtitle: "Smart Contract",
    description: "Executes token minting on Solana blockchain",
    icon: Link2,
    color: {
      bg: "bg-gradient-to-br from-[#00FFA3] to-[#03E1FF]",
      light: "bg-[#066EB5]/10",
      text: "text-[#066EB5]",
      border: "border-[#066EB5]/30",
    },
  },
  {
    id: 5,
    title: "Gaia Tokens",
    subtitle: "Minted & Stored",
    description: "1 kWh = 1 GAI token stored on Solana",
    icon: Coins,
    color: {
      bg: "bg-gradient-to-br from-[#F49136] to-[#F6B07D]",
      light: "bg-[#F49136]/10",
      text: "text-[#F49136]",
      border: "border-[#F49136]/30",
    },
  },
];

function AnimatedArrow({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="hidden lg:flex items-center justify-center flex-shrink-0"
    >
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight className="w-6 h-6 text-[#F49136]" />
      </motion.div>
    </motion.div>
  );
}

function AnimatedArrowDown({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex lg:hidden items-center justify-center py-2"
    >
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight className="w-5 h-5 text-[#F49136] rotate-90" />
      </motion.div>
    </motion.div>
  );
}

export function EnergyFlowDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-white border-[#e5e0d8] shadow-lg overflow-hidden">
        <CardHeader className="pb-4 border-b border-[#e5e0d8]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F49136] to-[#066EB5] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Energy Tokenization Flow
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Pipeline</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Desktop Flow - Horizontal */}
          <div className="hidden lg:flex items-start justify-between gap-4">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="flex-1"
                  >
                    <div
                      className={cn(
                        "relative bg-white rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg",
                        step.color.border,
                        "hover:border-opacity-100"
                      )}
                    >
                      {/* Step Number */}
                      <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {step.id}
                      </div>

                      {/* Icon */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto",
                          step.color.bg
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-[#1a1a1a] text-center mb-1">
                        {step.title}
                      </h4>
                      <p className={cn("text-xs text-center mb-2", step.color.text)}>
                        {step.subtitle}
                      </p>
                      <p className="text-[10px] text-[#6b6b6b] text-center leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {index < flowSteps.length - 1 && <AnimatedArrow delay={index * 0.1 + 0.3} />}
                </div>
              );
            })}
          </div>

          {/* Mobile Flow - Vertical */}
          <div className="lg:hidden">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={cn(
                      "relative bg-white rounded-xl border-2 p-4",
                      step.color.border
                    )}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {step.id}
                    </div>

                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          step.color.bg
                        )}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#1a1a1a] mb-0.5">
                          {step.title}
                        </h4>
                        <p className={cn("text-xs mb-1", step.color.text)}>
                          {step.subtitle}
                        </p>
                        <p className="text-[11px] text-[#6b6b6b]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {index < flowSteps.length - 1 && <AnimatedArrowDown delay={index * 0.1 + 0.3} />}
                </div>
              );
            })}
          </div>

          {/* Conversion Note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center justify-center gap-4 py-3 px-4 bg-[#F6F3EC] rounded-xl"
          >
            <Zap className="w-5 h-5 text-[#F49136]" />
            <span className="text-sm text-[#6b6b6b]">
              <span className="font-semibold text-[#1a1a1a]">1 kWh</span> of renewable energy ={" "}
              <span className="font-semibold text-[#F49136]">1 GAI</span> token minted on Solana
            </span>
            <Coins className="w-5 h-5 text-[#066EB5]" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
