import React from "react";
import { FaSolarPanel } from "react-icons/fa";

type Transaction = {
  timestamp: number;
  kwh_generated: string;
  gaia_e_minted: string;
  producer: string;
};

type TransactionCardProps = {
  transaction: Transaction;
};

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const formattedTimestamp = new Date(transaction.timestamp).toLocaleString();
  const kwhGenerated = parseInt(transaction.kwh_generated, 16);
  const gaiaEMinted = parseInt(transaction.gaia_e_minted);

  return (
    <div className="border border-green-500 rounded-lg p-6 shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl transition duration-300 ease-in-out max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl shadow-md">
          <FaSolarPanel />
        </div>
        <h3 className="ml-4 text-xl font-bold text-white">Energy Transaction</h3>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-white">
          <span className="font-medium">Producer:</span>{" "}
          <span className="text-blue-200 break-all">{transaction.producer}</span>
        </p>
        <p className="text-sm text-white">
          <span className="font-medium">kWh Generated:</span>{" "}
          <span className="text-yellow-200">{kwhGenerated.toLocaleString()} kWh</span>
        </p>
        <p className="text-sm text-white">
          <span className="font-medium">GAIA-E Minted:</span>{" "}
          <span className="text-yellow-200">{gaiaEMinted.toLocaleString()} tokens</span>
        </p>
        <p className="text-sm text-gray-200">
          <span className="font-medium">Date:</span> {formattedTimestamp}
        </p>
      </div>
      <div className="mt-4">
        {/* You can add buttons or links here if needed */}
      </div>
    </div>
  );
};

export default TransactionCard;
