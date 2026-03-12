"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cpu, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { mockDeviceInfo } from "@/lib/mock-data";

export function DeviceInfo() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deviceData = [
    { label: "Device ID", value: mockDeviceInfo.deviceId, highlight: false },
    { label: "Device Type", value: mockDeviceInfo.deviceType, highlight: false },
    { label: "Manufacturer", value: mockDeviceInfo.manufacturer, highlight: false },
    { label: "Current Power Output", value: `${mockDeviceInfo.currentPowerOutput} kW`, highlight: true },
    { label: "Total Lifetime kWh", value: mockDeviceInfo.totalLifetimeKwh.toLocaleString(), highlight: true },
    { label: "Firmware Version", value: mockDeviceInfo.firmwareVersion, highlight: false },
    { label: "Installation Date", value: mockDeviceInfo.installationDate, highlight: false },
    { label: "Last Data Update", value: mockDeviceInfo.lastDataUpdate, highlight: false },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#066EB5] to-[#055a9a] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">
            Device Information
          </h2>
          <p className="text-sm text-[#6b6b6b]">
            Technical data and blockchain details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Info Table */}
        <Card className="lg:col-span-2 bg-white border-[#e5e0d8] shadow-lg overflow-hidden">
          <CardHeader className="bg-[#066EB5]/5 border-b border-[#e5e0d8]">
            <CardTitle className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#066EB5]" />
              Device Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {deviceData.map((row, index) => (
                  <motion.tr
                    key={row.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[#e5e0d8] last:border-0 hover:bg-[#F6F3EC]/50 transition-colors"
                  >
                    <TableCell className="font-medium text-[#6b6b6b] w-1/3">
                      {row.label}
                    </TableCell>
                    <TableCell
                      className={`text-[#1a1a1a] ${row.highlight ? "font-semibold text-[#F49136]" : ""}`}
                    >
                      {row.value}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Solana Address Card */}
        <Card className="bg-gradient-to-br from-[#066EB5] to-[#055a9a] text-white border-0 shadow-lg shadow-blue-200 overflow-hidden">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-4 h-4" />
              </div>
              Solana Address
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <code className="text-sm break-all font-mono text-white/90">
                  {mockDeviceInfo.solanaAddress}
                </code>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => copyToClipboard(mockDeviceInfo.solanaAddress)}
                className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl py-3 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </motion.button>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Network</span>
                <Badge className="bg-white/20 text-white border-0">Devnet</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </CardContent>
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#F49136]/20 rounded-full blur-2xl" />
        </Card>
      </div>
    </motion.section>
  );
}
