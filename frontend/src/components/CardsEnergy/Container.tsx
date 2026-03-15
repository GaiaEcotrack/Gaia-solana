import React from 'react';
import { motion } from 'framer-motion';
import CardConsume from './CardConsume';
import CardGenerated from './CardGenerated';
import CardEnergy from './CardEnergy';

interface ContainerProps {
  energyGenerated: any;
  energyGenerating: any;
  consumedCalculate: any;
  tokens: any;
  claimReward: any;
  emailUser: string;
}

const Container: React.FC<ContainerProps> = ({
  energyGenerated,
  energyGenerating,
  consumedCalculate,
  tokens,
  claimReward,
  emailUser
}) => {
  return (
    <div className="w-full">
      {/* Header del Dashboard */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      </motion.div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Energy Generated */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <div className="h-full">
            <CardGenerated 
              total={energyGenerated} 
              moment={energyGenerating} 
              emailUser={emailUser} 
            />
          </div>
        </motion.div>

        {/* Card 2: Energy Consumed */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="h-full">
            <CardConsume supply={consumedCalculate} />
          </div>
        </motion.div>

        {/* Card 3: Tokens */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="h-full">
            <CardEnergy reward={claimReward} supply={tokens} />
          </div>
        </motion.div>
      </div>

      {/* Stats Summary */}
      <motion.div
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-lg font-semibold text-gray-800">
                {Math.round(Number(energyGenerated) / 30)} K/w
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-xl border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Efficiency</p>
              <p className="text-lg font-semibold text-gray-800">
                {Math.round((Number(energyGenerated) - Number(consumedCalculate)) / Number(energyGenerated) * 100)}%
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-white p-4 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Token Rate</p>
              <p className="text-lg font-semibold text-gray-800">
                {Math.round(Number(tokens) / Math.max(Number(energyGenerated), 1) * 100)}%
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Container;