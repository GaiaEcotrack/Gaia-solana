"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Wind, Droplets, MapPin, Zap, Coins, Clock } from "lucide-react";
import type { Project } from "@/lib/mock-data";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const deviceIcons = {
  solar: Sun,
  wind: Wind,
  hydro: Droplets,
};

const deviceColors = {
  solar: "text-[#F49136] bg-[#F49136]/10",
  wind: "text-[#066EB5] bg-[#066EB5]/10",
  hydro: "text-[#904907] bg-[#904907]/10",
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const DeviceIcon = deviceIcons[project.deviceType];
  const colorClass = deviceColors[project.deviceType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full bg-white border-[#e5e0d8] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                <DeviceIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] group-hover:text-[#F49136] transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-[#6b6b6b]">
                  <MapPin className="w-3 h-3" />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>
            <Badge
              variant={project.status === "online" ? "default" : "secondary"}
              className={`${
                project.status === "online"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : project.status === "maintenance"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              {project.status}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#F6F3EC] rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-1">
                <Zap className="w-4 h-4 text-[#F49136]" />
                <span>kWh Generated</span>
              </div>
              <p className="text-xl font-bold text-[#1a1a1a]">
                {project.kwhGenerated.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#066EB5]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-1">
                <Coins className="w-4 h-4 text-[#066EB5]" />
                <span>Tokens Minted</span>
              </div>
              <p className="text-xl font-bold text-[#066EB5]">
                {project.tokensMinted.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-[#6b6b6b]">
              <Clock className="w-3 h-3" />
              <span>{project.lastUpdate}</span>
            </div>
            <code className="bg-[#F6F3EC] px-2 py-1 rounded text-xs font-mono text-[#904907]">
              {project.deviceId}
            </code>
          </div>
        </CardContent>

        {/* Hover accent line */}
        <div className="h-1 bg-gradient-to-r from-[#F49136] via-[#F6B07D] to-[#066EB5] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Card>
    </motion.div>
  );
}
