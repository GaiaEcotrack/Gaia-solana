/* eslint-disable */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { getAuth } from "firebase/auth";

// Icons
import {
  FiActivity,
  FiTrendingUp,
  FiDollarSign,
  FiShield,
  FiUsers,
  FiArrowUpRight,
  FiArrowDownRight,
  FiRefreshCw,
  FiCreditCard,
  FiGlobe,
  FiZap,
  FiClock,
  FiBarChart2,
  FiPackage
} from "react-icons/fi";

interface RootState {
  app: {
    loggedInUser: any[];
  };
}

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { PROGRAM_ID, IDL } from "../../utils/constants";

interface RootState {
  app: {
    loggedInUser: any[];
  };
}

const UserDashboard = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userPublicKey, setUserPublicKey] = useState<PublicKey | null>(null);

  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    gaiaTokens: "0",
    gaiaEnergyTokens: "0",
    totalValue: "0",
    dailyEarnings: "+0.00",
    weeklyChange: "+0.00%",
    energyProduced: "0.0 MWh",
    carbonOffset: "0.0 TON",
    rank: "Eco Warrior",
    stakedTokens: "0",
    pendingRewards: "0.00"
  });

  const [countdown, setCountdown] = useState("00:00:00");
  const [progress, setProgress] = useState(0);
  const [marketData] = useState({
    gaiaPrice: "0.0917",
    gaiaChange: "+2.4%",
    energyTokenPrice: "0.125",
    energyChange: "+1.8%",
    marketCap: "$1.2M",
    totalStaked: "450k"
  });
  const [transactions] = useState([
    { id: 1, type: 'mint', token: 'GAIA', amount: '+150.00', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'trade', token: 'SOL', amount: '-0.50', time: '5 hours ago', status: 'completed' },
    { id: 3, type: 'stake', token: 'GAIA', amount: '+500.00', time: '1 day ago', status: 'completed' },
  ]);

  const stakeTokens = (token: string) => {
    console.log(`Staking ${token}...`);
  };

  const auth = getAuth();
  const userEmail = auth.currentUser?.email || "";
  const URL = "http://localhost:3001"; // fallback local api

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fetchBalanceGaia = async (publicKey: PublicKey) => {
    try {
      // En Solana devnet, podríamos consultar el balance de un token específico
      // Por ahora, simularemos o consultaremos SOL como placeholder si no hay mint.
      const balance = await connection.getBalance(publicKey);
      const formattedBalance = (balance / 1e9).toFixed(3);

      setUserStats(prev => ({
        ...prev,
        gaiaTokens: formattedBalance,
      }));

      dispatch({
        type: "SET_VALUE_GAIA",
        payload: formattedBalance,
      });
    } catch (error) {
      console.error("Error al obtener el balance de Solana:", error);
    }
  };
    
  const fetchBalanceEnergy = async (publicKey: PublicKey, deviceId: string) => {
    try {
      if (!deviceId) return;

      // Derivar PDA del dispositivo: ["device", owner_pubkey, device_id]
      const [devicePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("device"),
          publicKey.toBuffer(),
          Buffer.from(deviceId)
        ],
        PROGRAM_ID
      );

      const provider = new anchor.AnchorProvider(connection, (window as any).solana, {});
      const program = new anchor.Program(IDL as any, PROGRAM_ID, provider);

      const deviceAccount: any = await program.account.device.fetch(devicePda);
      
      // Suponiendo que el dispositivo tiene un campo para energía acumulada o similar
      // En nuestro lib.rs actual, Device no tiene acumulado, pero EnergyReport sí.
      // Por ahora, mostramos la capacidad como placeholder o buscamos reportes.
      const capacity = deviceAccount.capacityKw.toString();

      setUserStats(prev => ({
        ...prev,
        gaiaEnergyTokens: capacity,
      }));
    } catch (error) {
      console.error("Error al obtener datos del dispositivo desde Solana:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${URL}/users/search`, {
        params: { email: userEmail },
      });
      const user = response.data;
      if (user) {
        dispatch({ type: "SET_LOGGED_IN_USER", payload: [user] });
        
        // Si el usuario tiene una wallet asociada en BD, la usamos
        if (user.wallet) {
          try {
            const pubkey = new PublicKey(user.wallet);
            setUserPublicKey(pubkey);
            setWalletConnected(true);
            fetchBalanceGaia(pubkey);
            if (user.deviceId) {
               fetchBalanceEnergy(pubkey, user.deviceId);
            }
          } catch (e) {
            console.error("Wallet inválida en perfil:", user.wallet);
          }
        }
        
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if ((window as any).solana) {
      try {
        const resp = await (window as any).solana.connect();
        const pubkey = new PublicKey(resp.publicKey.toString());
        setUserPublicKey(pubkey);
        setWalletConnected(true);
        // alert.success("Solana wallet connected!");
        fetchBalanceGaia(pubkey);
      } catch (err) {
        console.error("Error connecting to Phantom:", err);
      }
    } else {
      // alert.error("Please install Phantom or a Solana wallet");
    }
  };

  useEffect(() => {
    fetchUserData();
     const getNextRewardTime = () => {
    // Hora Colombia (UTC-5)
    const now = new Date();

    const colombiaNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Bogota" })
    );

    const rewardTime = new Date(colombiaNow);
    rewardTime.setHours(20, 0, 0, 0); // 8:00 PM

    // Si ya pasó hoy, usar mañana
    if (colombiaNow >= rewardTime) {
      rewardTime.setDate(rewardTime.getDate() + 1);
    }

    return rewardTime;
  };

  const rewardTime = getNextRewardTime();
  const totalSeconds =
    (rewardTime.getTime() -
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "America/Bogota",
        })
      ).getTime()) /
    1000;

  const interval = setInterval(() => {
    const nowColombia = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Bogota",
      })
    );

    const diff = rewardTime.getTime() - nowColombia.getTime();

    if (diff <= 0) {
      setCountdown("00:00:00");
      setProgress(100);
      clearInterval(interval);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setCountdown(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    );

    const elapsed =
      1 - diff / (totalSeconds * 1000);

    setProgress(Math.min(100, Math.max(0, elapsed * 100)));
  }, 1000);

  return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Token Dashboard</h1>
            <p className="text-blue-500 mt-1">Manage your GAIA tokens and rewards</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={connectWallet}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${walletConnected ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              {walletConnected ? (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Wallet Connected
                </span>
              ) : 'Connect Wallet'}
            </button>
            
            <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userRedux[0]?.username?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{userRedux[0]?.username || "User"}</p>
                <p className="text-xs text-gray-500">Rank: {userStats.rank}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Token Balance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* GAIA Token Card */}
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiGlobe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">GAIA Token</h3>
                  <p className="text-blue-100 text-xs">Governance & Utility</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">${marketData.gaiaPrice}</span>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs mt-1">
                  <FiTrendingUp className="w-3 h-3" />
                  <span>{marketData.gaiaChange}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-5">
              <p className="text-blue-100 text-xs mb-2">Your Balance</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{userStats.gaiaTokens}</p>
                  <p className="text-blue-100 text-sm">≈ ${(parseFloat(userStats.gaiaTokens.replace(/,/g, '')) * 0.0917).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-200">Staked</p>
                  <p className="text-lg font-semibold">{userStats.stakedTokens}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => stakeTokens('GAIA')}
                className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
              >
                Stake
              </button>
              <button className="flex-1 bg-white/20 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm">
                Trade
              </button>
              <button className="flex-1 bg-white/20 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm">
                Send
              </button>
            </div>
          </motion.div>

          {/* GAIA ENERGY Token Card */}
          <motion.div
            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiZap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">GAIA ENERGY</h3>
                  <p className="text-green-100 text-xs">Energy-Backed Token</p>
                </div>
              </div>

            </div>
            
            <div className="mb-5">
              <p className="text-green-100 text-xs mb-2">Your Balance</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{userStats.gaiaEnergyTokens}</p>
                  <p className="text-green-100 text-sm">≈ ${(parseFloat(userStats.gaiaEnergyTokens.replace(/,/g, '')) * 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                </div>
              </div>
            </div>
            

          </motion.div>
        </div>

        {/* Main Grid - Ajustado para sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Portfolio Overview */}
            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Portfolio Overview</h2>
                <button className="text-blue-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1">
                  <FiRefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Value",
                    value: `${(parseFloat(userStats.gaiaTokens.replace(/,/g, '')) * 0.0917).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                    change: userStats.weeklyChange,
                    icon: <FiDollarSign className="w-4 h-4 text-blue-500" />,
                    color: "blue"
                  },
                  {
                    label: "Daily Earnings",
                    value: userStats.dailyEarnings,
                    change: "+2.1%",
                    icon: <FiActivity className="w-4 h-4 text-green-500" />,
                    color: "green"
                  },
                  {
                    label: "Energy Produced",
                    value: userStats.energyProduced,
                    change: "+15%",
                    icon: <FiZap className="w-4 h-4 text-yellow-500" />,
                    color: "yellow"
                  },
                  {
                    label: "Carbon Offset",
                    value: userStats.carbonOffset,
                    change: "+12%",
                    icon: <FiGlobe className="w-4 h-4 text-emerald-500" />,
                    color: "emerald"
                  }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      {stat.icon}
                    </div>
                    <p className="text-lg font-bold text-gray-800 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.color === 'green' ? 'bg-green-50 text-green-700' :
                      stat.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                      stat.color === 'yellow' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {stat.change.startsWith('+') ? <FiArrowUpRight className="w-3 h-3" /> : <FiArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
                <NavLink to="/transactions">
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    View All
                  </button>
                </NavLink>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-gray-600 font-medium text-xs uppercase">Type</th>
                      <th className="text-left py-3 text-gray-600 font-medium text-xs uppercase">Token</th>
                      <th className="text-left py-3 text-gray-600 font-medium text-xs uppercase">Amount</th>
                      <th className="text-left py-3 text-gray-600 font-medium text-xs uppercase">Time</th>
                      <th className="text-left py-3 text-gray-600 font-medium text-xs uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              tx.type === 'mint' ? 'bg-blue-50 text-blue-600' :
                              tx.type === 'trade' ? 'bg-green-50 text-green-600' :
                              tx.type === 'stake' ? 'bg-purple-50 text-purple-600' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {tx.type === 'mint' ? <FiZap className="w-3 h-3" /> :
                               tx.type === 'trade' ? <FiTrendingUp className="w-3 h-3" /> :
                               tx.type === 'stake' ? <FiShield className="w-3 h-3" /> :
                               <FiCreditCard className="w-3 h-3" />}
                            </div>
                            <span className="font-medium text-sm capitalize">{tx.type}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="font-medium text-sm">{tx.token}</span>
                        </td>
                        <td className={`py-3 font-bold text-sm ${
                          tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount}
                        </td>
                        <td className="py-3 text-gray-600 text-sm">{tx.time}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed' ? 'bg-green-50 text-green-700' :
                            'bg-yellow-50 text-yellow-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Market Insights */}
            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Market Insights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "GAIA Price", value: marketData.gaiaPrice, change: marketData.gaiaChange, icon: <FiBarChart2 className="w-4 h-4" /> },
                  { label: "ENERGY Price", value: marketData.energyTokenPrice, change: marketData.energyChange, icon: <FiZap className="w-4 h-4" /> },
                  { label: "Market Cap", value: marketData.marketCap, icon: <FiDollarSign className="w-4 h-4" /> },
                  { label: "Total Staked", value: marketData.totalStaked, icon: <FiPackage className="w-4 h-4" /> },
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-gray-500">{item.icon}</div>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{item.value}</p>
                    {item.change && (
                      <p className={`text-xs ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Quick Actions</h2>
              
              <div className="space-y-3">
                {[

                  {
                    icon: <FiShield className="w-4 h-4" />,
                    label: "Stake GAIA",
                    description: "Earn passive income",
                    action: () => stakeTokens('GAIA'),
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    icon: <FiCreditCard className="w-4 h-4" />,
                    label: "Buy Tokens",
                    description: "Purchase GAIA tokens",
                    action: () => alert.info("Token purchase coming soon!"),
                    color: "from-green-500 to-green-600"
                  },
                  {
                    icon: <FiUsers className="w-4 h-4" />,
                    label: "Join Governance",
                    description: "Vote on proposals",
                    action: () => alert.info("Governance portal coming soon!"),
                    color: "from-orange-500 to-orange-600"
                  }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full group"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-white`}>
                        {action.icon}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600">{action.label}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Environmental Impact */}
            <motion.div
              className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl p-5 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-lg font-semibold mb-5">Environmental Impact</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiGlobe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Carbon Neutral</p>
                      <p className="text-emerald-100 text-xs">Days this month</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">24</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Community Rank</p>
                      <p className="text-emerald-100 text-xs">Top 15% globally</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{userStats.rank}</p>
                    <p className="text-sm flex items-center gap-1">
                      <FiArrowUpRight className="w-3 h-3" />
                      +2 positions
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-emerald-400/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-100">Equivalent to planting</span>
                  <span className="font-bold">{Math.round(parseFloat(userStats.carbonOffset) * 40)} trees</span>
                </div>
              </div>
            </motion.div>

            {/* Next Reward Cycle */}
            <motion.div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Next Reward</h2>
                <FiClock className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-800 mb-2">{countdown}</div>
                <p className="text-gray-600 text-sm mb-4">Until next reward distribution</p>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Estimated reward:</span>
                    <span className="font-bold text-green-600">+85.50 GAIA</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;