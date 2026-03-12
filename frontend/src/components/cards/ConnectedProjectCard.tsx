"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, MapPin, Cpu, Signal } from "lucide-react";
import { useEnergyData } from "@/hooks/useEnergyData";

export function ConnectedProjectCard() {
  const { data, isLoading } = useEnergyData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-white border-[#e5e0d8] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#6b6b6b] flex items-center gap-2">
              <Sun className="w-5 h-5 text-[#F49136]" />
              Proyecto Conectado
            </CardTitle>
            <Badge
              variant={data.status === "online" ? "default" : "secondary"}
              className={`${data.status === "online" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}
            >
              <Signal className="w-3 h-3 mr-1" />
              {data.status === "online" ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-6 bg-[#f0ebe3] rounded animate-pulse" />
              <div className="h-4 bg-[#f0ebe3] rounded animate-pulse w-3/4" />
              <div className="h-4 bg-[#f0ebe3] rounded animate-pulse w-1/2" />
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#1a1a1a]">
                {data.project}
              </h3>
              <div className="flex items-center gap-2 text-[#6b6b6b]">
                <MapPin className="w-4 h-4 text-[#066EB5]" />
                <span>{data.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6b6b6b]">
                <Cpu className="w-4 h-4 text-[#904907]" />
                <span>Device ID: </span>
                <code className="bg-[#F6F3EC] px-2 py-0.5 rounded text-sm font-mono text-[#066EB5]">
                  {data.deviceId}
                </code>
              </div>
            </div>
          )}
        </CardContent>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F6B07D]/20 to-transparent rounded-bl-full" />
      </Card>
    </motion.div>
  );
}
