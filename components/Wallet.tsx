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
    if (!isConnected) {
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
        <div className="flex items-center space-x-3">
            <div className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-mono text-sm text-gray-300">{truncateAddress(account)}</span>
            </div>
            <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg px-3 py-2">
                <span className="text-xs text-indigo-300 font-semibold">{networkName}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Button 
                    variant="secondary"
                    onClick={onConnect}
                    className="py-2 px-3 text-xs"
                    title="Switch to different wallet"
                >
                    <span>Switch</span>
                </Button>
                <Button 
                    variant="danger"
                    onClick={onDisconnect}
                    className="py-2 px-3 text-xs"
                    title="Disconnect wallet"
                >
                    <span>Disconnect</span>
                </Button>
            </div>
        </div>
    );
};