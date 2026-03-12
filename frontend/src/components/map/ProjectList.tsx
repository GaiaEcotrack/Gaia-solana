"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sun, Wind, Droplets, MapPin, Zap, Coins, Clock, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
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
    border: "border-[#F49136]/30",
  },
  wind: {
    bg: "bg-[#066EB5]",
    light: "bg-[#066EB5]/10",
    text: "text-[#066EB5]",
    border: "border-[#066EB5]/30",
  },
  hydro: {
    bg: "bg-[#904907]",
    light: "bg-[#904907]/10",
    text: "text-[#904907]",
    border: "border-[#904907]/30",
  },
};

export function ProjectList({ projects, selectedProject, onSelectProject }: ProjectListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1a1a1a]">Proyectos</h3>
        <Badge variant="secondary" className="bg-[#F6F3EC] text-[#6b6b6b]">
          {projects.length} activos
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-[500px] custom-scrollbar">
        {projects.map((project, index) => {
          const Icon = deviceIcons[project.deviceType];
          const colors = deviceColors[project.deviceType];
          const isSelected = selectedProject?.id === project.id;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectProject(project)}
              className={cn(
                "relative p-3 rounded-xl cursor-pointer transition-all duration-300 border-2",
                isSelected
                  ? `${colors.light} ${colors.border} shadow-lg`
                  : "bg-white border-transparent hover:bg-[#F6F3EC] hover:border-[#e5e0d8]"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    isSelected ? colors.bg : colors.light
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isSelected ? "text-white" : colors.text
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={cn(
                        "font-semibold text-sm truncate",
                        isSelected ? colors.text : "text-[#1a1a1a]"
                      )}
                    >
                      {project.name}
                    </h4>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 flex-shrink-0 transition-transform",
                        isSelected ? `${colors.text} rotate-90` : "text-[#6b6b6b]"
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-xs text-[#6b6b6b]">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{project.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#F49136]" />
                      <span className="text-xs font-medium text-[#1a1a1a]">
                        {project.kwhGenerated.toLocaleString()} kWh
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-[#066EB5]" />
                      <span className="text-xs font-medium text-[#066EB5]">
                        {project.tokensMinted.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status & Time */}
                  <div className="flex items-center justify-between mt-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0.5",
                        project.status === "online"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : project.status === "maintenance"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {project.status === "online" ? "Online" : project.status === "maintenance" ? "Mantenimiento" : "Offline"}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-[#6b6b6b]">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{project.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="project-selector"
                  className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                  style={{ borderColor: deviceColors[project.deviceType].bg.replace("bg-", "") }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex gap-1">
          <div className="w-6 h-1 bg-[#F49136] rounded-full" />
          <div className="w-1 h-1 bg-[#e5e0d8] rounded-full" />
          <div className="w-1 h-1 bg-[#e5e0d8] rounded-full" />
        </div>
      </div>
    </div>
  );
}
