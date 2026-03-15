import React, { useState } from "react";
import { FaExchangeAlt, FaSolarPanel, FaCalendarAlt, FaCoins, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

interface TransferRecord {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  token_type: string;
}

interface ProducerRecord {
  timestamp: number;
  producer: string;
  gaia_e_minted: string;
  kwh_generated: string;
}

interface ApiItem {
  transferRecords?: TransferRecord[];
  producers?: ProducerRecord[];
}

interface TransactionsListProps {
  data: ApiItem[];
}

// Card para Transferencias
const TransferCard: React.FC<{ transfer: TransferRecord; index: number }> = ({ transfer, index }) => {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-r from-purple-100 to-purple-50 flex items-center justify-center">
            <FaExchangeAlt className="text-purple-600 w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Token Transfer</h3>
            <p className="text-xs text-gray-500">{transfer.token_type}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-gray-800">{transfer.amount.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Amount</div>
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">From</span>
          <code className="text-xs font-medium text-gray-800 truncate max-w-[100px]" title={transfer.from}>
            {transfer.from.slice(0, 8)}...{transfer.from.slice(-6)}
          </code>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">To</span>
          <code className="text-xs font-medium text-gray-800 truncate max-w-[100px]" title={transfer.to}>
            {transfer.to.slice(0, 8)}...{transfer.to.slice(-6)}
          </code>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            <span>{new Date(transfer.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
          <span>{new Date(transfer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Card para Productores
const ProducerCard: React.FC<{ producer: ProducerRecord; index: number }> = ({ producer, index }) => {
  const kwh = producer.kwh_generated ? parseInt(producer.kwh_generated, 16) : 0;
  const minted = producer.gaia_e_minted ? parseInt(producer.gaia_e_minted, 16) : 0;

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center">
            <FaSolarPanel className="text-green-600 w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Energy Production</h3>
            <p className="text-xs text-gray-500 truncate max-w-[100px]" title={producer.producer}>
              {producer.producer.slice(0, 8)}...{producer.producer.slice(-6)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-green-600">{kwh.toLocaleString()}</div>
          <div className="text-xs text-gray-500">kWh</div>
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
              <FaCoins className="text-blue-600 w-3 h-3" />
            </div>
            <span className="text-xs text-gray-500">Tokens Minted</span>
          </div>
          <span className="text-sm font-medium text-gray-800">{minted.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            <span>{new Date(producer.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
          <span>{new Date(producer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </motion.div>
  );
};

const TransactionsList: React.FC<TransactionsListProps> = ({ data }) => {
  console.log("data", data);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"transfers" | "producers">("transfers");

  const transfers: TransferRecord[] =
    data?.GetTransferRecords?.transferRecords ?? [];

  const producers: ProducerRecord[] =
    data?.GetProducers?.producers ?? [];

  const filteredProducers = producers.filter((producer) =>
    producer.producer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header compacto */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Blockchain Activity</h2>
            <p className="text-gray-500 text-xs mt-1">Token transfers and energy production</p>
          </div>
          
          <div className="text-xs text-gray-600">
            {transfers.length} transfers • {producers.length} producers
          </div>
        </div>

        {/* Tabs compactas */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("transfers")}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === "transfers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-1">
              <FaExchangeAlt className="w-3 h-3" />
              Transfers
              {transfers.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                  {transfers.length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("producers")}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === "producers"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-1">
              <FaSolarPanel className="w-3 h-3" />
              Producers
              {producers.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                  {producers.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Search Bar compacta (solo para producers) */}
        {activeTab === "producers" && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 w-3 h-3" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search producers..."
                className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              />
            </div>
            {searchQuery && (
              <p className="text-xs text-gray-500 mt-1">
                {filteredProducers.length} results for "{searchQuery}"
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Content */}
      {activeTab === "transfers" ? (
        <div>
          {transfers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {transfers.slice(0, 6).map((transfer, i) => (
                <TransferCard key={`${transfer.from}-${transfer.timestamp}-${i}`} transfer={transfer} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <FaExchangeAlt className="text-gray-400 w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">No Transfers Yet</h3>
              <p className="text-gray-500 text-xs text-center max-w-xs">
                Token transfers will appear here when users exchange Gaia tokens.
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <div>
          {filteredProducers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredProducers.slice(0, 6).map((producer, i) => (
                <ProducerCard key={`${producer.producer}-${producer.timestamp}-${i}`} producer={producer} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <FaSolarPanel className="text-gray-400 w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                {searchQuery ? "No Matching Producers" : "No Producers Yet"}
              </h3>
              <p className="text-gray-500 text-xs text-center max-w-xs">
                {searchQuery
                  ? `No producers found for "${searchQuery}"`
                  : "Energy production records will appear here"}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Stats compactas */}
      <motion.div
        className="mt-6 pt-4 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">{transfers.length}</div>
            <div className="text-xs text-gray-500">Transfers</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">{producers.length}</div>
            <div className="text-xs text-gray-500">Producers</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">
              {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xs text-gray-500">Updated</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionsList;