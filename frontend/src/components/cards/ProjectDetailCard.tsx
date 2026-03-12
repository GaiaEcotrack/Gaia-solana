"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Wind, Droplets, MapPin, Zap, Coins, Clock, Cpu, ExternalLink, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProjectDetailCardProps {
  project: Project;
  expanded?: boolean;
}

const deviceIcons = {
  solar: Sun,
  wind: Wind,
  hydro: Droplets,
};

const deviceColors = {
  solar: {
    bg: "bg-[#F49136]",
    light: "bg-[#F49136]/10",
    text: "text-[#F49136]",
    gradient: "from-[#F49136] to-[#F6B07D]",
  },
  wind: {
    bg: "bg-[#066EB5]",
    light: "bg-[#066EB5]/10",
    text: "text-[#066EB5]",
    gradient: "from-[#066EB5] to-[#088fd4]",
  },
  hydro: {
    bg: "bg-[#904907]",
    light: "bg-[#904907]/10",
    text: "text-[#904907]",
    gradient: "from-[#904907] to-[#b5690a]",
  },
};

const deviceTypeNames = {
  solar: "Energía Solar",
  wind: "Energía Eólica",
  hydro: "Hidroeléctrica",
};

export function ProjectDetailCard({ project, expanded = false }: ProjectDetailCardProps) {
  const Icon = deviceIcons[project.deviceType];
  const colors = deviceColors[project.deviceType];

  if (expanded) {
    return (
      <Card className="bg-white border-[#e5e0d8] shadow-xl overflow-hidden">
        <div className={cn("h-2 bg-gradient-to-r", colors.gradient)} />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Header Section */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", colors.bg)}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-[#1a1a1a]">{project.name}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        project.status === "online"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : project.status === "maintenance"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {project.status === "online" ? "Online" : project.status === "maintenance" ? "Mantenimiento" : "Offline"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[#6b6b6b]">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={cn(colors.light, colors.text, "border-0")}>
                      {deviceTypeNames[project.deviceType]}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-[#6b6b6b]">
                      <Cpu className="w-3 h-3" />
                      <code className="text-xs">{project.deviceId}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F6F3EC] rounded-xl p-4 text-center">
                <Zap className="w-5 h-5 text-[#F49136] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#1a1a1a]">{project.kwhGenerated.toLocaleString()}</p>
                <p className="text-xs text-[#6b6b6b]">kWh Generados</p>
              </div>
              <div className="bg-[#066EB5]/5 rounded-xl p-4 text-center">
                <Coins className="w-5 h-5 text-[#066EB5] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#066EB5]">{project.tokensMinted.toLocaleString()}</p>
                <p className="text-xs text-[#6b6b6b]">Tokens GAI</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-3">
              <Button className={cn("w-full", colors.bg, "hover:opacity-90")}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver en Blockchain
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-[#6b6b6b]">
                <Clock className="w-4 h-4" />
                <span>Actualizado: {project.lastUpdate}</span>
              </div>
            </div>
          </div>

          {/* Power Output Bar */}
          {project.status === "online" && (
            <div className="mt-6 pt-6 border-t border-[#e5e0d8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#6b6b6b]">Producción Actual</span>
                <span className="text-lg font-bold text-[#F49136]">{project.currentOutput} kW</span>
              </div>
              <div className="h-3 bg-[#F6F3EC] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((project.currentOutput / 500) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn("h-full rounded-full bg-gradient-to-r", colors.gradient)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Compact card version
  return (
    <Card className="bg-white border-[#e5e0d8] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className={cn("h-1 bg-gradient-to-r", colors.gradient)} />
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.bg)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1a1a1a] group-hover:text-[#F49136] transition-colors truncate">
                {project.name}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "ml-2",
                  project.status === "online"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : project.status === "maintenance"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
                )}
              >
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#6b6b6b]">
              <MapPin className="w-3 h-3" />
              <span>{project.location}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-[#F6F3EC] rounded-lg p-2 text-center">
                <p className="text-sm font-bold text-[#1a1a1a]">{project.kwhGenerated.toLocaleString()}</p>
                <p className="text-[10px] text-[#6b6b6b]">kWh</p>
              </div>
              <div className="bg-[#066EB5]/5 rounded-lg p-2 text-center">
                <p className="text-sm font-bold text-[#066EB5]">{project.tokensMinted.toLocaleString()}</p>
                <p className="text-[10px] text-[#6b6b6b]">GAI</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
