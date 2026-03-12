"use client";

import { useState, useEffect } from "react";
import { mockProjects, type Project } from "@/lib/mock-data";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getProjectById = (id: string): Project | undefined => {
    return projects.find((p) => p.id === id);
  };

  const getOnlineProjects = (): Project[] => {
    return projects.filter((p) => p.status === "online");
  };

  const getTotalKwh = (): number => {
    return projects.reduce((sum, p) => sum + p.kwhGenerated, 0);
  };

  const getTotalTokens = (): number => {
    return projects.reduce((sum, p) => sum + p.tokensMinted, 0);
  };

  return {
    projects,
    isLoading,
    getProjectById,
    getOnlineProjects,
    getTotalKwh,
    getTotalTokens,
  };
}
