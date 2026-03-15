import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiZap, 
  FiDollarSign, 
  FiPackage,
  FiTrendingUp,
  FiActivity,
  FiGlobe,
  FiCreditCard
} from "react-icons/fi";

interface User {
  name: string;
  generatedKW: number;
  Earnings?: number;
  tokens_distributed?: number;
}

interface UsersListProps {
  users: User[];
}

const Users: React.FC<UsersListProps> = ({ users }) => {
  // Calcula el total usando generatedKW
  const totalGenerated = users.reduce((sum, user) => sum + (user.generatedKW || 0), 0);
  const totalGeneratedKW = totalGenerated.toFixed(2);
  
  const totalTokens = users.reduce((acumulador, objeto) => {
    return acumulador + (objeto.generatedKW || 0);
  }, 0);
  
  const totalEarnings = ((totalTokens * 0.645) * 0.15).toFixed(2);
  
  // Estadísticas adicionales
  const avgKWPerUser = users.length > 0 ? (totalGenerated / users.length).toFixed(2) : "0.00";
  const co2Saved = (totalGenerated * 0.5).toFixed(2); // Estimación: 0.5 ton CO2 por kW
  const estimatedMonthlyRevenue = (parseFloat(totalEarnings) * 30).toFixed(2);

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+12%",
      icon: <FiUsers className="w-6 h-6 text-blue-500" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      metric: "Active clients"
    },
    {
      title: "Energy Generated",
      value: `${totalGeneratedKW} kW`,
      change: "+24%",
      icon: <FiZap className="w-6 h-6 text-green-500" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      metric: "Total production"
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings}`,
      change: "+18%",
      icon: <FiDollarSign className="w-6 h-6 text-yellow-500" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      metric: "Today's revenue"
    },
    {
      title: "Tokens Distributed",
      value: `${totalTokens.toFixed(2)}`,
      change: "+32%",
      icon: <FiPackage className="w-6 h-6 text-purple-500" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      metric: "GAIA tokens"
    },
    {
      title: "Avg. per User",
      value: `${avgKWPerUser} kW`,
      change: "+8%",
      icon: <FiTrendingUp className="w-6 h-6 text-orange-500" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      metric: "Average production"
    },
    {
      title: "CO₂ Saved",
      value: `${co2Saved} TON`,
      change: "+24%",
      icon: <FiGlobe className="w-6 h-6 text-emerald-500" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      metric: "Environmental impact"
    },
    {
      title: "Est. Monthly",
      value: `$${estimatedMonthlyRevenue}`,
      change: "+15%",
      icon: <FiCreditCard className="w-6 h-6 text-red-500" />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      metric: "Monthly revenue"
    },
    {
      title: "Active Systems",
      value: users.length.toString(),
      change: "+5%",
      icon: <FiActivity className="w-6 h-6 text-cyan-500" />,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      metric: "Online now"
    }
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Performance Overview</h2>
        <p className="text-gray-600 mt-2">Real-time statistics for all your managed clients</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.slice(0, 4).map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm">
                <FiTrendingUp className="w-3 h-3" />
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">{stat.metric}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.slice(4).map((stat, index) => (
            <motion.div
              key={index + 4}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 4) * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{stat.metric}</span>
                <span className={`text-xs font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Monthly Performance Summary</h3>
            <p className="text-blue-100">All systems are operating at optimal performance</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-blue-200">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-blue-200">Issues</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-blue-400/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">No maintenance required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Auto-reporting enabled</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div
        className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <FiTrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-800">Top Performer</span>
            </div>
            <p className="text-sm text-gray-600">
              Highest energy producer: {Math.max(...users.map(u => u.generatedKW || 0)).toFixed(2)} kW
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <FiZap className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-800">Daily Average</span>
            </div>
            <p className="text-sm text-gray-600">
              {avgKWPerUser} kW per client | ${((parseFloat(totalEarnings) / users.length) || 0).toFixed(2)} avg. revenue
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <FiGlobe className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-800">Environmental Impact</span>
            </div>
            <p className="text-sm text-gray-600">
              Equivalent to planting {Math.round(parseFloat(co2Saved) * 40)} trees this month
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Users;