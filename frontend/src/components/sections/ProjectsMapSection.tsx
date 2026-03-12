"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ColombiaMap } from "@/components/map/ColombiaMap";
import { ProjectList } from "@/components/map/ProjectList";
import { ProjectDetailCard } from "@/components/cards/ProjectDetailCard";
import { useProjects } from "@/hooks/useProjects";
import { Map, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/mock-data";

type ViewMode = "map" | "grid";

export function ProjectsMapSection() {
  const { projects, isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("map");

  const handleSelectProject = (project: Project) => {
    setSelectedProject((prev) => (prev?.id === project.id ? null : project));
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      id="projects"
      className="mt-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#F49136] to-[#F6B07D] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">
              Proyectos de Energía en Colombia
            </h2>
            <p className="text-sm text-[#6b6b6b]">
              Proyectos de energía renovable conectados a la red Gaia
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
            className={viewMode === "map" ? "bg-[#F49136] hover:bg-[#e07d20]" : ""}
          >
            <Map className="w-4 h-4 mr-2" />
            Mapa
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-[#F49136] hover:bg-[#e07d20]" : ""}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Cuadrícula
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[500px] bg-white rounded-2xl animate-pulse border border-[#e5e0d8]" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-[#e5e0d8]" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === "map" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ColombiaMap
                    projects={projects}
                    selectedProject={selectedProject}
                    onSelectProject={handleSelectProject}
                  />
                </motion.div>
              </div>

              {/* Project List */}
              <div className="bg-white rounded-2xl border border-[#e5e0d8] p-4 shadow-lg">
                <ProjectList
                  projects={projects}
                  selectedProject={selectedProject}
                  onSelectProject={handleSelectProject}
                />
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer"
                >
                  <ProjectDetailCard project={project} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Selected Project Detail */}
          {selectedProject && viewMode === "map" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <ProjectDetailCard project={selectedProject} expanded />
            </motion.div>
          )}
        </div>
      )}
    </motion.section>
  );
}
