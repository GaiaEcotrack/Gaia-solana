"use client";

import { useState, useEffect, useMemo } from "react";
import { mockProjects, type Project } from "@/lib/mock-data";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const totalKwh = useMemo(() => {
    return projects.reduce((sum, p) => sum + p.kwhGenerated, 0);
  }, [projects]);

  const totalTokens = useMemo(() => {
    return projects.reduce((sum, p) => sum + p.tokensMinted, 0);
  }, [projects]);

  return {
    projects,
    isLoading,
    getProjectById: (id: string) => projects.find((p) => p.id === id),
    getOnlineProjects: () => projects.filter((p) => p.status === "online"),
    getTotalKwh: () => totalKwh,
    getTotalTokens: () => totalTokens,
    totalKwh,
    totalTokens,
  };
}
