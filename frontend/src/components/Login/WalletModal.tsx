// components/WalletSelectorModal.tsx
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { FaCheck } from 'react-icons/fa';

interface WalletSelectorModalProps {
  isOpen: boolean;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: string | null;
  onSelectAccount: (account: InjectedAccountWithMeta) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function WalletSelectorModal({
  isOpen,
  accounts,
  selectedAccount,
  onSelectAccount,
  onClose,
  isLoading
}: WalletSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Select Wallet Account</h3>
            <p className="text-sm text-slate-500 mt-1">
              Choose an account from your Polkadot.js extension
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-lg"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-slate-500">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-slate-600">No accounts found in Polkadot.js extension.</p>
            <p className="text-sm text-slate-500 mt-2">
              Make sure you have the extension installed and accounts created.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {accounts.map((account) => (
              <button
                key={account.address}
                onClick={() => onSelectAccount(account)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedAccount === account.address
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {selectedAccount === account.address && (
                        <FaCheck className="text-indigo-600" />
                      )}
                      <div className="overflow-hidden">
                        <p className="font-medium text-slate-800 truncate">
                          {account.meta.name || 'Unnamed Account'}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {account.address}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                        {account.meta.source || 'unknown'}
                      </span>
                      {account.meta.isHardware && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          Hardware
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}