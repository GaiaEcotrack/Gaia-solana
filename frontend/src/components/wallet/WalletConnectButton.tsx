"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useCallback } from "react";

export function WalletConnectButton() {
  const { publicKey, disconnect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = useCallback(() => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  }, [connected, disconnect, setVisible]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Button
      onClick={handleClick}
      disabled={connecting}
      className="bg-[#F49136] hover:bg-[#e07d20] text-white font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-orange-200 transition-all duration-300 hover:shadow-xl hover:shadow-orange-300"
    >
      {connecting ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Connecting...</span>
        </div>
      ) : connected && publicKey ? (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>{formatAddress(publicKey.toBase58())}</span>
          <LogOut className="w-4 h-4 ml-1" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </div>
      )}
    </Button>
  );
}
