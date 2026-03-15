import { TbWallet, TbWalletOff } from "react-icons/tb";
import { Wallet } from './wallet';
import { AccountsModal } from './accounts-modal';
import { useApi, useAccount, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { useState } from 'react';
import { ACCOUNT_ID_LOCAL_STORAGE_KEY } from '@/app/consts';
import { motion } from 'framer-motion';

type Props = {
  isSidebarOpen?: boolean;
};

// Función para formatear números grandes
const formatLargeNumber = (value: string): string => {
  const num = parseFloat(value);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return parseFloat(value).toFixed(2);
};

// Función para formatear el balance separando valor y unidad
const formatBalance = (formattedBalance: string | undefined) => {
  if (!formattedBalance) return null;
  
  // Separar el valor numérico de la unidad
  const match = formattedBalance.match(/^([\d.,]+)\s*([a-zA-Z]+)$/);
  if (match) {
    const value = match[1];
    const unit = match[2];
    return { value: formatLargeNumber(value), unit };
  }
  
  // Si no coincide el formato, usar separación simple
  const parts = formattedBalance.split(' ');
  if (parts.length >= 2) {
    const value = parts.slice(0, -1).join(' ');
    const unit = parts[parts.length - 1];
    return { value: formatLargeNumber(value), unit };
  }
  
  return { value: formattedBalance, unit: '' };
};

export function AccountInfo({ isSidebarOpen = true }: Props) {
  const { isApiReady } = useApi();
  const { account, accounts, logout } = useAccount();
  const { balance } = useBalance(account?.address);
  const { getFormattedBalance } = useBalanceFormat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedBalance = isApiReady && balance ? getFormattedBalance(balance) : undefined;
  const balanceInfo = formatBalance(formattedBalance?.value);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      logout();
      localStorage.removeItem(ACCOUNT_ID_LOCAL_STORAGE_KEY);
    }
  };

  const isCollapsed = !isSidebarOpen;

  return (
    <>
      {account ? (
        <motion.div 

          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs font-medium text-green-600">Connected</span>
            </div>
            <div className="text-xs text-gray-500">
              Web3 Wallet
            </div>
          </div>

          {/* Wallet Info */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-4 cursor-pointer min-w-0"
            onClick={openModal}
          >
            <div className="flex items-center justify-between mb-2 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TbWallet className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{account.meta.name}</h4>
                  <p className="text-xs text-gray-500 truncate">
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-3 min-w-0">
                {balanceInfo && (
                  <div className="flex flex-col items-end">
                    <div className="text-base font-bold text-gray-800 truncate max-w-[100px]" title={balanceInfo.value}>
                      {balanceInfo.value}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[80px]" title={balanceInfo.unit}>
                      {balanceInfo.unit}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Network Info */}
            {!isCollapsed && balanceInfo && (
              <div className="mt-3 pt-3 border-t border-blue-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate">Network Balance</span>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-medium text-gray-800 truncate max-w-[80px]" title={balanceInfo.value}>
                      {balanceInfo.value}
                    </span>
                    <span className="text-gray-600 truncate max-w-[60px]" title={balanceInfo.unit}>
                      {balanceInfo.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Disconnect Button */}
          {!isCollapsed && (
            <motion.button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-300 group min-w-0"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <TbWalletOff className="w-4 h-4 group-hover:rotate-12 transition-transform flex-shrink-0" />
              <span className="text-sm font-medium truncate">Disconnect Wallet</span>
            </motion.button>
          )}

          {/* Quick Stats */}
          {!isCollapsed && (
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg min-w-0">
                  <div className="text-xs text-gray-500 mb-1 truncate">Status</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-800 truncate">Active</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg min-w-0">
                  <div className="text-xs text-gray-500 mb-1 truncate">Type</div>
                  <div className="text-sm font-medium text-gray-800 truncate">Polkadot.js</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isCollapsed ? (
            // Collapsed State
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center cursor-pointer"
              onClick={openModal}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <TbWallet className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            // Expanded State
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-blue-200 rounded-2xl p-2 text-center cursor-pointer group hover:border-blue-400 hover:shadow-md transition-all duration-300"
              onClick={openModal}
              whileHover={{ y: -2 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <TbWallet className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2 truncate">Connect Wallet</h3>
              <p className="text-sm text-gray-600 mb-4 truncate">
                Connect your Web3 wallet to interact with Gaia EcoTrack
              </p>
              
              <motion.button
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TbWallet className="w-4 h-4" />
                Connect Now
              </motion.button>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 truncate">
                  Supports Polkadot.js • Vara Network
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}