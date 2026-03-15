import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CarbonCertificateList from "./CarbonCertificateList";
import TransactionList from "./TransactionList";
import axios from "axios";
import SwapTokens from "./SwapTokens";
import TokenTransfer from "./TransferAction";

const Blockchain: React.FC = () => {
  interface DataItem {
    producers?: any;
    carbonCertificates?: any;
    [key: string]: any;
  }

  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "tokens" | "certificates" | "transactions">("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = import.meta.env.VITE_APP_API_EXPRESS;
        const token = localStorage.getItem("token");

        const request = await axios.get(`${url}/service/query/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const response = request.data;
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalTransfers: data.GetTransferRecords?.transferRecords?.length || 0,
    totalCertificates: data[3]?.carbonCertificates?.length || 0,
    totalValue: data[3]?.carbonCertificates?.reduce((sum: number, cert: any) => sum + parseInt(cert.value || 0), 0) || 0,
    activeProducers: data.GetProducers?.producers?.filter((p: any) => parseInt(p.gaia_e_minted || 0) > 0).length || 0
  };


  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "tokens", label: "Token Actions", icon: "🔄" },
    { id: "certificates", label: "Certificates", icon: "🌿" },
    { id: "transactions", label: "Transactions", icon: "📈" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pl-0 lg:pl-80 transition-all duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Blockchain Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Manage tokens, certificates, and track blockchain activity</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Vara Network</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                className="bg-white rounded-xl border border-gray-200 p-5"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🔄</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stats.totalTransfers}</div>
                    <div className="text-sm text-gray-500">Total Transfers</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl border border-gray-200 p-5"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg">🌿</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stats.totalCertificates}</div>
                    <div className="text-sm text-gray-500">Certificates</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl border border-gray-200 p-5"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-lg">💰</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">${stats.totalValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Value</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl border border-gray-200 p-5"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-lg">⚡</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stats.activeProducers}</div>
                    <div className="text-sm text-gray-500">Active Producers</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("tokens")}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600">🔄</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Swap Tokens</div>
                          <div className="text-sm text-gray-500">Exchange GAIAE for GAIA</div>
                        </div>
                      </div>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("tokens")}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <span className="text-green-600">💰</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Transfer Tokens</div>
                          <div className="text-sm text-gray-500">Send tokens to another wallet</div>
                        </div>
                      </div>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : data.GetProducers?.producers?.slice(0, 3).map((producer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 text-sm">⚡</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">Energy Production</div>
                          <div className="text-xs text-gray-500">
                            {new Date(producer.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        +{parseInt(producer.gaia_e_minted || 0)} tokens
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Token Actions Tab */}
        {activeTab === "tokens" && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🔄</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Swap Tokens</h3>
                  <p className="text-sm text-gray-500">Exchange GAIAE for GAIA tokens</p>
                </div>
              </div>
              <SwapTokens />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Transfer Tokens</h3>
                  <p className="text-sm text-gray-500">Send tokens to another wallet address</p>
                </div>
              </div>
              <TokenTransfer />
            </div>
          </motion.div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center">
                <span className="text-green-600 text-xl">🌿</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Carbon Certificates</h3>
                <p className="text-sm text-gray-500">Manage and trade carbon offset certificates</p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            ) : data[3]?.carbonCertificates ? (
              <CarbonCertificateList certificates={data[3].carbonCertificates} />
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">🌿</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Certificates Available</h3>
                <p className="text-gray-500">Carbon certificates will appear here when available</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 flex items-center justify-center">
                <span className="text-purple-600 text-xl">📈</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Blockchain Transactions</h3>
                <p className="text-sm text-gray-500">View all token transfers and energy production records</p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : data.GetProducers?.producers ? (
              <TransactionList data={data} />
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Transactions Yet</h3>
                <p className="text-gray-500">Blockchain transactions will appear here when available</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Network Info */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">🔗</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Vara Network</h4>
                <p className="text-sm text-gray-600">All transactions are processed on the Vara blockchain</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Network Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-600">Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blockchain;