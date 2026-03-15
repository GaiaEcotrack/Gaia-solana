import React, { useState } from "react";
import CarbonCertificateCard from "./CarbonCertificateCard";
import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { motion } from "framer-motion";

interface CarbonCertificateListProps {
  certificates: any[];
}

const CarbonCertificateList: React.FC<CarbonCertificateListProps> = ({ certificates }) => {
  const [data, setData] = useState(certificates);
  const [filteredData, setFilteredData] = useState(certificates);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"value" | "date" | "expiry">("value");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = data.filter((certificate: any) => 
      certificate.certificate_id.toLowerCase().includes(query) ||
      certificate.owner.toLowerCase().includes(query) ||
      certificate.value.toString().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleSort = (type: "value" | "date" | "expiry") => {
    setSortBy(type);
    const sorted = [...filteredData].sort((a, b) => {
      switch (type) {
        case "value":
          return parseInt(b.value) - parseInt(a.value);
        case "date":
          return b.issue_date - a.issue_date;
        case "expiry":
          return a.expiry_date - b.expiry_date; // Closest expiry first
        default:
          return 0;
      }
    });
    setFilteredData(sorted);
  };

  const totalValue = filteredData.reduce((sum, cert) => sum + parseInt(cert.value), 0);
  const averageValue = filteredData.length > 0 ? totalValue / filteredData.length : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Carbon Certificates</h2>
            <p className="text-gray-500 text-sm mt-1">Trade and manage carbon offset certificates</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">
              {filteredData.length} certificate{filteredData.length !== 1 ? 's' : ''}
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search certificates by ID, owner, or value..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFilter className="w-4 h-4" />
              Filter
            </motion.button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            className="mb-6 p-4 bg-white rounded-xl border border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Sort By</h3>
              <FaSortAmountDown className="text-gray-400 w-4 h-4" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "value", label: "Highest Value" },
                { id: "date", label: "Most Recent" },
                { id: "expiry", label: "Expiring Soon" }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSort(option.id as "value" | "date" | "expiry")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    sortBy === option.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Total Value</div>
            <div className="text-xl font-bold text-gray-800">${totalValue.toLocaleString()}</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Average Value</div>
            <div className="text-xl font-bold text-gray-800">${Math.round(averageValue).toLocaleString()}</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Active Certificates</div>
            <div className="text-xl font-bold text-gray-800">{filteredData.length}</div>
          </div>
        </motion.div>
      </div>

      {/* Certificates Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((certificate, index) => (
            <motion.div
              key={certificate.certificate_id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CarbonCertificateCard certificate={certificate} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          {searchQuery ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Certificates Found</h3>
              <p className="text-gray-500 text-center max-w-md">
                No certificates match "{searchQuery}". Try a different search term or clear the search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilteredData(data);
                }}
                className="mt-4 px-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Clear Search
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Certificates Available</h3>
              <p className="text-gray-500 text-center max-w-md">
                There are currently no carbon certificates available for trading.
                Certificates will appear here when they are issued.
              </p>
            </>
          )}
        </motion.div>
      )}

      {/* Footer Info */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All certificates are blockchain-verified</span>
          </div>
          <div>
            Showing {filteredData.length} of {data.length} total certificates
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CarbonCertificateList;