import { motion } from "framer-motion";
import React from "react";

type CardConsumeProps = {
  supply: number | string;
};

const CardConsume = ({ supply }: CardConsumeProps) => {
  const consumptionValue = Number(supply) || 0;
  const efficiencyPercentage = Math.min(Math.round((100 - consumptionValue) / 100 * 100), 95);
  const savedEnergy = (consumptionValue * 0.85).toFixed(1);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold">Energy Consumption</h3>
            <p className="text-blue-100 text-sm">Smart Monitoring</p>
          </div>
          <motion.div
            className="relative"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 7 }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <motion.h2
          className="text-lg font-medium text-gray-700 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Renewing the future with clean and sustainable energy
        </motion.h2>

        {/* Main Consumption Display */}
        <div className="mb-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Total Energy Consumed
            </div>
            <motion.div
              className="text-5xl font-bold text-blue-600 mb-1"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              {supply}
            </motion.div>
            <div className="text-lg text-gray-600 font-medium">Kilowatt-hours</div>
          </motion.div>
        </div>

        {/* Efficiency Visualization */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Energy Efficiency</span>
            <span className="text-sm font-bold text-green-600">{efficiencyPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${efficiencyPercentage}%` }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Low</span>
            <span>Optimal Consumption</span>
            <span>High</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="bg-blue-50 p-4 rounded-xl border border-blue-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-xs font-medium text-gray-700">Energy Saved</div>
            </div>
            <div className="text-xl font-bold text-blue-600">{savedEnergy} K/w</div>
            <div className="text-xs text-blue-500">Through optimization</div>
          </motion.div>
          
          <motion.div
            className="bg-green-50 p-4 rounded-xl border border-green-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xs font-medium text-gray-700">Efficiency</div>
            </div>
            <div className="text-xl font-bold text-green-600">{efficiencyPercentage}%</div>
            <div className="text-xs text-green-500">Optimal range</div>
          </motion.div>
        </div>

        {/* Comparison Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Daily Comparison</span>
            <span className="text-xs text-gray-500">vs Average</span>
          </div>
          <div className="h-24 flex items-end gap-2">
            {[20, 35, 45, 60, 75, 90, 85, 70, 55, 40].map((height, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.7 + index * 0.05, duration: 0.5 }}
              />
            ))}
            <motion.div
              className="flex-1 bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg"
              initial={{ height: 0 }}
              animate={{ height: `${consumptionValue}%` }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Previous Days</span>
            <span className="font-medium">Today</span>
          </div>
        </div>

        {/* Gaia Logo */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="relative">
            <motion.img
              src="/LogoGaia.svg"
              alt="Gaia Logo"
              className="h-16 w-16 rounded-full border-2 border-gray-200 bg-white p-2"
              whileHover={{ rotate: -15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <div className="absolute -inset-1 rounded-full border border-blue-200 animate-pulse opacity-50"></div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="font-medium">Smart Grid</span> • Real-time Monitoring
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardConsume;