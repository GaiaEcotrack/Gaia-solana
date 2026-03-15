import React, { useState } from 'react';
import { useAccount, useAlert } from "@gear-js/react-hooks";
import axios from 'axios';
import { motion } from 'framer-motion';

const TokenTransfer: React.FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>('GAIE');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { account } = useAccount();
  const alert = useAlert();

  const tokens = [
    { name: 'Gaia Energy', symbol: 'GAIE', color: 'from-blue-500 to-blue-600' },
    { name: 'Gaia', symbol: 'GAI', color: 'from-green-500 to-green-600' },
  ];

  const handleTransfer = async () => {
    if (!recipient || !amount || !selectedToken) {
      return alert.error('Please fill out all fields before continuing.');
    };
    
    if (!account?.decodedAddress) {
      return alert.error('Please connect your wallet first.');
    }

    alert.info('Submitting transfer... This may take a few seconds.');
    setIsSubmitting(true);

    try {
      const url = import.meta.env.VITE_APP_API_EXPRESS;
      const token = localStorage.getItem("token");
      const selectedTokenObj = tokens.find(token => token.symbol === selectedToken);

      if (!selectedTokenObj) {
        throw new Error('Selected token is not valid.');
      }

      if (recipient.length > 80) {
        return alert.error('Destination address looks invalid. Please check and try again.');
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return alert.error('Enter a valid amount greater than 0.');
      }

      let endpoint = '';
      switch (selectedTokenObj.name) {
        case 'Gaia Energy':
          endpoint = 'TransferGaiaETokens';
          break;
        case 'Gaia':
          endpoint = 'TransferGaiaCompanyToken';
          break;
        default:
          throw new Error('Selected token is not supported.');
      }

      const response = await axios.post(`${url}/service/GaiaService/${endpoint}`, [
        account?.decodedAddress,
        recipient,
        amount,
      ], {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.err) {
        let errorMessage: string;
        if (typeof response.data.err === 'string') {
          errorMessage = response.data.err;
        } else if (typeof response.data.err === 'object') {
          if (response.data.err.selfTransferAttempted) {
            errorMessage = 'You cannot transfer tokens to your own address.';
          } else {
            errorMessage = Object.entries(response.data.err)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ') || 'An error occurred during the transfer.';
          }
        } else {
          errorMessage = String(response.data.err);
        }
        return alert.error(errorMessage);
      }
      
      alert.success('Transfer completed successfully.');
      
      setRecipient('');
      setAmount('');
      setSelectedToken(tokens[0]?.symbol || '');
    } catch (error) {
      alert.error('Transfer failed. Please try again or check your connection.');
      console.error('Transfer error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTokenObj = tokens.find(token => token.symbol === selectedToken);

  return (
    <motion.div
      className="bg-white text-black rounded-2xl border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Token Transfer</h2>
        <p className="text-gray-500 text-sm">Transfer tokens to another wallet address</p>
      </div>

      {/* Token Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Token</label>
        <div className="flex gap-2">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => setSelectedToken(token.symbol)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedToken === token.symbol
                  ? `bg-gradient-to-r ${token.color} text-white shadow-md`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs font-bold">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <span className="font-medium">{token.symbol}</span>
            </button>
          ))}
        </div>
        {selectedTokenObj && (
          <p className="text-xs text-gray-500 mt-2">
            You are transferring <span className="font-medium">{selectedTokenObj.name}</span> tokens
          </p>
        )}
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {selectedToken}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Enter the amount you want to transfer</p>
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono text-sm"
            placeholder="0x..."
          />
          <p className="text-xs text-gray-500 mt-2">Enter the destination wallet address</p>
        </div>

        {/* Wallet Info */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">From Address</span>
            <span className="text-xs text-gray-400 truncate max-w-[150px]">
              {account?.decodedAddress ? `${account.decodedAddress.slice(0, 8)}...${account.decodedAddress.slice(-6)}` : 'Not connected'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Network</span>
            <span className="text-sm font-medium text-gray-800">Vara Network</span>
          </div>
        </div>

        {/* Transfer Button */}
        <motion.button
          onClick={handleTransfer}
          disabled={isSubmitting || !account?.decodedAddress || !recipient || !amount}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isSubmitting || !account?.decodedAddress || !recipient || !amount
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : `bg-gradient-to-r ${selectedTokenObj?.color || 'from-blue-500 to-blue-600'} text-white hover:shadow-lg`
          }`}
          whileHover={!isSubmitting && account?.decodedAddress && recipient && amount ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Transfer...
            </div>
          ) : !account?.decodedAddress ? (
            'Connect Wallet to Transfer'
          ) : (
            `Transfer ${selectedToken} Tokens`
          )}
        </motion.button>

        {/* Transfer Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Token transfers are executed on the blockchain and may take a few seconds to complete.
              Ensure you have enough balance and the recipient address is correct.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TokenTransfer;