"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConnectedProjectCard } from "@/components/cards/ConnectedProjectCard";
import { EnergyCard } from "@/components/cards/EnergyCard";
import { TokenCard } from "@/components/cards/TokenCard";
import { ProjectsMapSection } from "@/components/sections/ProjectsMapSection";
import { DeviceInfo } from "@/components/sections/DeviceInfo";
import { SolanaIntegration } from "@/components/sections/SolanaIntegration";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

function StatBadge({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-[#e5e0d8]"
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <span className="text-sm text-[#6b6b6b]">{label}:</span>
      <span className="text-sm font-semibold text-[#1a1a1a]">{value}</span>
    </motion.div>
  );
}

export default function Dashboard() {
  const { getTotalKwh, getTotalTokens, projects } = useProjects();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-2">
                Dashboard de Energía
              </h1>
              <p className="text-[#6b6b6b]">
                Monitorea tu generación de energía renovable y activos tokenizados en tiempo real
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatBadge
                icon={TrendingUp}
                label="Total kWh"
                value={getTotalKwh().toLocaleString()}
                color="bg-[#F49136]"
              />
              <StatBadge
                icon={Sparkles}
                label="Tokens"
                value={`${getTotalTokens().toLocaleString()} GAI`}
                color="bg-[#066EB5]"
              />
              <StatBadge
                icon={Users}
                label="Proyectos"
                value={`${projects.length} Activos`}
                color="bg-[#904907]"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConnectedProjectCard />
          <EnergyCard />
          <TokenCard />
        </div>

        {/* Projects Map Section */}
        <ProjectsMapSection />

        {/* Device Info Section */}
        <DeviceInfo />

        {/* Solana Integration Section */}
        <SolanaIntegration />

        {/* Network Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 bg-gradient-to-r from-[#F49136] via-[#F6B07D] to-[#066EB5] rounded-2xl p-6 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🇨🇴</span>
              </div>
              <div className="text-white">
                <h3 className="text-lg font-semibold">Red Gaia Colombia</h3>
                <p className="text-white/80 text-sm">Métricas de blockchain en tiempo real</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="text-center">
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-white/70">Validadores</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden md:block" />
              <div className="text-center">
                <p className="text-2xl font-bold">{getTotalKwh().toLocaleString()}</p>
                <p className="text-xs text-white/70">Total kWh</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden md:block" />
              <div className="text-center">
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-xs text-white/70">Proyectos</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden md:block" />
              <div className="text-center">
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-xs text-white/70">Uptime</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
