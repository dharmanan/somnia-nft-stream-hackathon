import React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

interface WalletProps {
  account: string;
  isConnected: boolean;
  isConnecting: boolean;
  networkName: string;
  onConnect: () => void;
  onDisconnect?: () => void;
}

const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export const Wallet: React.FC<WalletProps> = ({ 
  account, 
  isConnected, 
  isConnecting, 
  networkName, 
  onConnect,
  onDisconnect
}) => {
    // If not connected, show connect button
    if (!isConnected || !account) {
        return (
            <Button 
              variant="primary" 
              onClick={onConnect} 
              disabled={isConnecting}
              className="py-2 px-4 text-sm"
            >
                <div className="flex items-center space-x-2">
                    <Icon name="wallet" className="w-4 h-4" />
                    <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </div>
            </Button>
        );
    }

    return (
        <div className="flex items-center gap-3 bg-white/5 border border-white/20 rounded-lg px-4 py-2">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-mono text-sm text-gray-300">{truncateAddress(account)}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-indigo-300 font-semibold">{networkName}</span>
            </div>
            <Button 
                variant="danger"
                onClick={onDisconnect}
                className="py-1 px-2 text-xs ml-auto"
                title="Disconnect wallet"
            >
                <span>Disconnect</span>
            </Button>
        </div>
    );
};