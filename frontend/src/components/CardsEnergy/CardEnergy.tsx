import { motion } from "framer-motion";

type CardEnergyProps = {
  supply: number | string;
  reward?: () => void;
};

const CardEnergy = ({ supply, reward }: CardEnergyProps) => {
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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold">Gaia Tokens</h3>
            <p className="text-orange-100 text-sm">Energy Rewards</p>
          </div>
          <motion.div
            className="relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          Renewable energy: a push towards a sustainable future
        </motion.h2>

        {/* Token Display */}
        <div className="mb-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Total Tokens Earned
            </div>
            <motion.div
              className="text-5xl font-bold text-orange-600 mb-1"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              {supply}
            </motion.div>
            <div className="text-lg text-gray-600 font-medium">Gaia Tokens</div>
          </motion.div>
        </div>

        {/* Token Visualization */}
        <div className="relative mb-8">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(Number(supply) / 100 * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>Energy Production</span>
            <span>100%</span>
          </div>
        </div>

        {/* Token Value Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-xs text-gray-500 mb-1">Current Value</div>
            <div className="text-lg font-semibold text-gray-800">$0.25</div>
            <div className="text-xs text-green-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              +2.5% today
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-xs text-gray-500 mb-1">Daily Rewards</div>
            <div className="text-lg font-semibold text-gray-800">+{Math.round(Number(supply) * 0.05)}</div>
            <div className="text-xs text-blue-500">Based on production</div>
          </motion.div>
        </div>

        {/* Action Button */}
        {/* {reward && (
          <motion.button
            onClick={reward}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Claim Tokens
          </motion.button>
        )} */}

        {/* Gaia Logo */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="relative">
            <motion.img
              src="/LogoGaia.svg"
              alt="Gaia Logo"
              className="h-16 w-16 rounded-full border-2 border-gray-200 bg-white p-2"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <div className="absolute -inset-1 rounded-full border border-orange-200 animate-ping opacity-75"></div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="font-medium">Gaia EcoTrack</span> • Web3 Energy
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardEnergy;