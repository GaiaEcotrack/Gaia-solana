import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { useAccount, useAlert } from "@gear-js/react-hooks";
import axios from "axios";
import { motion } from "framer-motion";

const SwapTokens = () => {
  const [fromToken, setFromToken] = useState("GAIAE");
  const [toToken, setToToken] = useState("GAIA");
  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const { account } = useAccount();
  const alert = useAlert();
  const url = import.meta.env.VITE_APP_API_EXPRESS;

  const DECIMALS_GAIAE = 3;
  const conversionRate = 0.2;

  const convertedAmount = amount
    ? (parseFloat(amount) * conversionRate).toFixed(6)
    : "";

  const handleSwap = async () => {
    if (!amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
      alert.error("Enter a valid amount greater than 0.");
      return;
    }

    if (!account?.decodedAddress) {
      alert.error("Please connect your wallet to swap tokens.");
      return;
    }

    alert.info("Processing swap... This may take a moment.");
    setIsSwapping(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert.error("Authentication token not found. Please sign in again.");
        return;
      }

      const parsedAmount = parseFloat(amount);
      const amountInGaiaeUnits = BigInt(
        (parsedAmount * 10 ** DECIMALS_GAIAE).toFixed(0)
      );

      await axios.post(
        `${url}/service/GaiaService/SwapGaiaEnergyToGaia`,
        [account.decodedAddress, amountInGaiaeUnits.toString()],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert.success("Swap completed successfully.");
      setAmount("");
    } catch (error) {
      alert.error("Swap failed. Please try again or check your connection.");
      console.error(error);
    } finally {
      setIsSwapping(false);
    }
  };

  const tokenOptions = [
    { symbol: "GAIAE", name: "Gaia Energy", color: "from-blue-500 to-blue-600" },
    { symbol: "GAIA", name: "Gaia", color: "from-green-500 to-green-600" },
  ];

  return (
    <motion.div
      className="bg-white text-black rounded-2xl border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6 text-black">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Token Swap</h2>
        <p className="text-gray-500 text-sm">Exchange Gaia Energy tokens for Gaia tokens</p>
      </div>

      {/* Swap Interface */}
      <div className="space-y-6">
        {/* From Token */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">From</label>
          <div className="p-4 border border-gray-300 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GE</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Gaia Energy</div>
                  <div className="text-sm text-gray-500">GAIAE</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Balance</div>
                <div className="font-semibold text-gray-800">-</div>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 text-lg font-semibold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">
                GAIAE
              </div>
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white shadow-lg"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <ArrowRightLeft size={20} />
          </motion.div>
        </div>

        {/* To Token */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <div className="p-4 border border-gray-300 rounded-xl bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Gaia</div>
                  <div className="text-sm text-gray-500">GAIA</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Balance</div>
                <div className="font-semibold text-gray-800">-</div>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={convertedAmount || "0.00"}
                readOnly
                className="w-full px-4 py-3 text-lg font-semibold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">
                GAIA
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Info */}
        {convertedAmount && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="font-medium text-gray-800">1 GAIAE = 0.2 GAIA</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-600">Estimated Output</div>
              <div className="font-semibold text-gray-800">{convertedAmount} GAIA</div>
            </div>
          </div>
        )}

        {/* Wallet Info */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${account?.decodedAddress ? "bg-green-500" : "bg-gray-400"}`}></div>
              <span className="text-sm text-gray-600">Wallet Status</span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {account?.decodedAddress ? "Connected" : "Not Connected"}
            </span>
          </div>
          {account?.decodedAddress && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              {account.decodedAddress.slice(0, 12)}...{account.decodedAddress.slice(-8)}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <motion.button
          onClick={handleSwap}
          disabled={isSwapping || !account?.decodedAddress || !amount || parseFloat(amount) <= 0}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isSwapping || !account?.decodedAddress || !amount || parseFloat(amount) <= 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white hover:shadow-lg"
          }`}
          whileHover={!isSwapping && account?.decodedAddress && amount && parseFloat(amount) > 0 ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          {isSwapping ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Swapping Tokens...
            </div>
          ) : !account?.decodedAddress ? (
            "Connect Wallet to Swap"
          ) : (
            "Swap Tokens"
          )}
        </motion.button>

        {/* Swap Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Swaps are executed on the Vara Network blockchain. The conversion rate is fixed at 1 GAIAE = 0.2 GAIA.
              Transactions may take a few seconds to complete.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwapTokens;