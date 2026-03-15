import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZap, FiGlobe, FiMapPin, FiClock, FiTrendingUp, FiActivity, FiBarChart2, FiSun } from "react-icons/fi";

interface ModalDeviceProps {
  close: () => void;
  deviceData: {
    today_eq?: string;
    month_eq?: string;
    total_eq?: string;
    real_power?: string;
    co2_emission_reduction?: string;
    plant_tree?: string;
    data_time?: string;
    plantName?: string;
    location?: string;
  };
}

const ModalDevice: React.FC<ModalDeviceProps> = ({ close, deviceData }) => {
  const hasData = deviceData && Object.values(deviceData).some((value) => value && value.trim() !== "");

  const stats = [
    {
      label: "Energy Today",
      value: `${deviceData.today_eq || "0"} kWh`,
      icon: <FiSun className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500",
      description: "Generated today"
    },
    {
      label: "This Month",
      value: `${deviceData.month_eq || "0"} kWh`,
      icon: <FiBarChart2 className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      description: "Monthly total"
    },
    {
      label: "Total Energy",
      value: `${deviceData.total_eq || "0"} kWh`,
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: "from-green-500 to-green-600",
      description: "Lifetime production"
    },
    {
      label: "Current Power",
      value: `${deviceData.real_power || "0"} kW`,
      icon: <FiActivity className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      description: "Real-time output"
    }
  ];

  const renderDataRow = (label: string, value: string | undefined, icon: React.ReactNode) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold text-gray-800">{value || "Not specified"}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Content */}
        <motion.div
          className="
    relative bg-white rounded-2xl shadow-xl 
    max-w-4xl w-full 
    max-h-[90vh] 
    overflow-y-auto
  "
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="relative h-64 md:h-72 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Solar installation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Header Content */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {deviceData.plantName || "Solar Installation"}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <FiMapPin className="w-4 h-4" />
                    <span>{deviceData.location || "Location not specified"}</span>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white">Live Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            {hasData ? (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Environmental Impact */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <FiGlobe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Environmental Impact</h3>
                      <p className="text-gray-600">Positive contributions to the planet</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">CO₂ Reduction</span>
                        <span className="text-emerald-600 font-bold">
                          {deviceData.co2_emission_reduction || "0"} kg
                        </span>
                      </div>
                      <div className="w-full bg-emerald-100 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: '75%' }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Equivalent to {Math.round(parseFloat(deviceData.co2_emission_reduction || "0") / 22).toFixed(0)} trees</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Trees Equivalent</span>
                        <span className="text-emerald-600 font-bold">
                          {deviceData.plant_tree || "0"} trees
                        </span>
                      </div>
                      <div className="w-full bg-emerald-100 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: '60%' }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">CO₂ absorption capacity</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderDataRow(
                      "Last Update",
                      deviceData.data_time,
                      <FiClock className="w-5 h-5" />
                    )}
                    {renderDataRow(
                      "Installation Type",
                      "Solar PV System",
                      <FiZap className="w-5 h-5" />
                    )}
                    {renderDataRow(
                      "Status",
                      "Operational",
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                    {renderDataRow(
                      "Efficiency",
                      "92%",
                      <FiActivity className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Token Earnings Estimation */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Token Earnings</h3>
                      <p className="text-gray-600">Estimated GAIA tokens from production</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {((parseFloat(deviceData.today_eq || "0") * 0.15) * 1.25).toFixed(2)} GAIA
                      </p>
                      <p className="text-sm text-gray-600">Today's estimated earnings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>≈ ${(parseFloat(deviceData.today_eq || "0") * 0.15).toFixed(2)} USD</span>
                    <span>Auto-minted every 24h</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiZap className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  This device is not currently transmitting data. Please check the connection or try again later.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={close}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Close Dashboard
              </button>
              <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalDevice;