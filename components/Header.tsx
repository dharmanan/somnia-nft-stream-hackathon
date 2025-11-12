import React from 'react';
import { Wallet } from './Wallet';

const Logo: React.FC = () => (
    <img 
        src="/somnia.jpg" 
        alt="Somnia Logo" 
        className="w-10 h-10 rounded-full object-cover" 
    />
);

export const Header: React.FC<{
  account: string;
  isConnected: boolean;
  isConnecting: boolean;
  networkName: string;
  onConnectWallet: () => void;
  onDisconnectWallet?: () => void;
}> = ({ account, isConnected, isConnecting, networkName, onConnectWallet, onDisconnectWallet }) => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Logo />
        <div>
          <h1 className="text-2xl font-bold text-white">Somnia NFT Auction</h1>
          <p className="text-sm text-gray-300">Hackathon Demo - Real-Time Web3 Auction Platform</p>
          <p className="text-xs text-gray-400 mt-1">
              <span className="font-semibold">Network:</span> Somnia Testnet (Shannon) - <span className="font-semibold">Chain ID:</span> 50312
          </p>
        </div>
      </div>
      <Wallet 
        account={account}
        isConnected={isConnected}
        isConnecting={isConnecting}
        networkName={networkName}
        onConnect={onConnectWallet}
        onDisconnect={onDisconnectWallet}
      />
    </header>
  );
};
