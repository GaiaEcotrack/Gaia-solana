"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ColombiaMapProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
}

const deviceColors = {
  solar: {
    fill: "#F49136",
  },
  wind: {
    fill: "#066EB5",
  },
  hydro: {
    fill: "#904907",
  },
};

export function ColombiaMap({ projects, selectedProject, onSelectProject }: ColombiaMapProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-[#066EB5]/5 via-white to-[#F49136]/5 rounded-2xl overflow-hidden border border-[#e5e0d8]">
      {/* Map Container */}
      <div className="relative w-full h-full p-4">
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full"
          style={{ maxHeight: "500px" }}
        >
          {/* Colombia SVG Path - Simplified outline */}
          <path
            d="M25 35 
               L30 20 L40 12 L55 8 L70 10 L80 15 L85 22 L82 30 
               L78 28 L72 32 L68 40 L72 48 L68 55 L62 52 L58 58 
               L52 62 L48 70 L42 75 L38 82 L32 88 L28 95 L22 98 
               L18 92 L15 85 L12 78 L15 70 L20 62 L22 55 L25 48 
               L22 42 L25 35 Z"
            fill="#F6F3EC"
            stroke="#e5e0d8"
            strokeWidth="0.8"
            className="drop-shadow-sm"
          />

          {/* Department divisions - simplified */}
          <g stroke="#e5e0d8" strokeWidth="0.3" fill="none" opacity="0.5">
            <path d="M35 30 L55 45" />
            <path d="M50 25 L45 55" />
            <path d="M60 35 L55 65" />
            <path d="M30 50 L70 50" />
            <path d="M25 70 L65 70" />
            <path d="M40 40 L40 85" />
            <path d="M55 55 L55 90" />
          </g>

          {/* Project Markers */}
          {projects.map((project) => {
            const colors = deviceColors[project.deviceType];
            const isSelected = selectedProject?.id === project.id;

            return (
              <g
                key={project.id}
                className="cursor-pointer"
                onClick={() => onSelectProject(project)}
              >
                {/* Outer glow ring */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.circle
                      cx={project.coordinates.x}
                      cy={project.coordinates.y}
                      initial={{ r: 3, opacity: 0 }}
                      animate={{ r: 8, opacity: 0.3 }}
                      exit={{ r: 3, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      fill={colors.fill}
                    />
                  )}
                </AnimatePresence>

                {/* Main marker */}
                <motion.circle
                  cx={project.coordinates.x}
                  cy={project.coordinates.y}
                  r={isSelected ? 4 : 3}
                  fill={colors.fill}
                  stroke="white"
                  strokeWidth="1"
                  className={cn(
                    "transition-all duration-300",
                    isSelected && "drop-shadow-lg"
                  )}
                  whileHover={{ r: 5 }}
                />

                {/* Status indicator dot */}
                <circle
                  cx={project.coordinates.x + 2}
                  cy={project.coordinates.y - 2}
                  r={1.2}
                  fill={project.status === "online" ? "#22c55e" : project.status === "maintenance" ? "#eab308" : "#ef4444"}
                  stroke="white"
                  strokeWidth="0.5"
                />

                {/* Project label on hover/select */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.text
                      x={project.coordinates.x}
                      y={project.coordinates.y - 8}
                      textAnchor="middle"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-[3px] font-semibold fill-[#1a1a1a]"
                    >
                      {project.name.split(" ").slice(0, 2).join(" ")}
                    </motion.text>
                  )}
                </AnimatePresence>
              </g>
            );
          })}

          {/* City Labels */}
          <g className="text-[2.5px] fill-[#6b6b6b] font-medium">
            <text x="72" y="10" className="text-[2px]">La Guajira</text>
            <text x="50" y="46">Bogotá</text>
            <text x="35" y="60">Cali</text>
            <text x="46" y="36">Medellín</text>
            <text x="60" y="23">Barranquilla</text>
            <text x="55" y="30">Cartagena</text>
          </g>

          {/* Compass */}
          <g transform="translate(85, 115)">
            <circle r="6" fill="white" stroke="#e5e0d8" strokeWidth="0.3" />
            <text y="0.5" textAnchor="middle" className="text-[3px] font-bold fill-[#066EB5]">N</text>
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-[#e5e0d8]">
          <p className="text-xs font-semibold text-[#1a1a1a] mb-2">Tipo de Proyecto</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F49136]" />
              <span className="text-xs text-[#6b6b6b]">Solar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#066EB5]" />
              <span className="text-xs text-[#6b6b6b]">Eólico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#904907]" />
              <span className="text-xs text-[#6b6b6b]">Hidroeléctrico</span>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-[#e5e0d8]">
          <p className="text-xs font-semibold text-[#1a1a1a] mb-2">Estado</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-[#6b6b6b]">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs text-[#6b6b6b]">Mantenimiento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-[#6b6b6b]">Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
