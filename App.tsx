import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Icon } from './components/Icon';
import { ethers } from 'ethers';

// Add custom animations
const styles = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-out;
  }
`;

interface AuctionStatus {
  auctionStarted: boolean;
  highestBid: string;
  highestBidder: string;
  endTime: number;
  nftContract: string;
  nftId: string;
  seller: string;
}

interface Bid {
  address: string;
  amount: number;
}

const App: React.FC = () => {
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatus | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [lastBid, setLastBid] = useState<Bid | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string>('');
  const [newBidIndex, setNewBidIndex] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('0.01');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // MetaMask state
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState<string>('');

  // WebSocket for real-time updates
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [sdsData, setSdsData] = useState<any[]>([]);
  const [sdsLoading, setSdsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const wsConnectingRef = useRef(false);
  const wsReconnectCountRef = useRef(0);
  const listenersDisabledRef = useRef(false);

  // Somnia testnet configuration
  const SOMNIA_CHAIN = {
    chainId: '0xC488', // 50312 in hex
    chainName: 'Somnia Testnet (Shannon)',
    nativeCurrency: {
      name: 'STT',
      symbol: 'STT',
      decimals: 18,
    },
    rpcUrls: ['https://dream-rpc.somnia.network/'],
    blockExplorerUrls: ['https://shannon-explorer.somnia.network/'],
  };

  // Check on mount if page was reloaded after disconnect - if so, reset everything
  useEffect(() => {
    console.log('🎬 App mounted');
    const wasDisconnected = localStorage.getItem('wasDisconnected') === 'true';
    console.log('📍 wasDisconnected marker:', wasDisconnected);
    
    if (wasDisconnected) {
      console.log('🔄 Page reloaded after disconnect - clearing all state');
      localStorage.removeItem('wasDisconnected');
      
      // Re-enable listeners for fresh connection
      listenersDisabledRef.current = false;
      console.log('✅ Listeners re-enabled for new connection');
      
      // Hard reset all state
      flushSync(() => {
        console.log('🔄 Flushing state resets...');
        setAccount('');
        setIsConnected(false);
        setIsConnecting(false);
        setNetworkName('');
        setError('');
        setBids([]);
        setLastBid(null);
        setSdsData([]);
      });
      console.log('✅ All state reset complete');
    } else {
      console.log('ℹ️ Normal mount, no disconnect marker');
    }
  }, []);

  // Backend'den auction status'ü çek
  const fetchAuctionStatus = async () => {
    try {
      if (!account) {
        console.warn('No account connected, skipping auction status fetch');
        return;
      }

      // Read from contract directly with fresh provider (no cache)
      const auctionAbi = [
        "function highestBid() view returns (uint256)",
        "function highestBidder() view returns (address)",
        "function endTime() view returns (uint256)"
      ];

      const auctionAddress = '0x811CD7090a8e7b63ee466A7610d7e28Ba0cda6ef';
      // Create fresh provider to bypass cache
      const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network/');
      const auctionContract = new ethers.Contract(auctionAddress, auctionAbi, provider);

      console.log('📊 Fetching auction status from contract...');
      const highestBid = await auctionContract.highestBid();
      const highestBidder = await auctionContract.highestBidder();
      const endTime = await auctionContract.endTime();

      console.log('📊 Contract data:', {
        highestBid: ethers.formatEther(highestBid),
        highestBidder: highestBidder,
        endTime: Number(endTime)
      });

      setAuctionStatus({
        auctionStarted: true,
        highestBid: ethers.formatEther(highestBid),
        highestBidder: highestBidder,
        endTime: Number(endTime),
        nftContract: '0x6c5cE10cD5dcE7250f5dF94599Ec6869158E966f',
        nftId: '1',
        seller: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
      });
      setError('');
    } catch (err) {
      console.error('Error fetching auction status from contract:', err);
      // Fallback to backend API
      try {
        const response = await fetch('/api/auction/status');
        const data = await response.json();
        setAuctionStatus(data);
      } catch (backendErr) {
        setError('Failed to fetch auction status');
      }
    }
  };

  // Fetch SDS data
  const fetchSdsData = async () => {
    setSdsLoading(true);
    try {
      // Use live WebSocket data instead of backend mock data
      // sdsData is already populated from WebSocket events in real-time
      console.log('📊 SDS Data (Live from WebSocket):', sdsData);
      
      // Show toast notification
      setToast({
        message: `Loaded ${sdsData.length} events from live stream`,
        type: 'info'
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Error fetching SDS data:', error);
      setSdsData([]);
    } finally {
      setSdsLoading(false);
    }
  };

  // WebSocket connection for real-time SDS subscription
  useEffect(() => {
    const connectWebSocket = () => {
      // Prevent duplicate connection attempts
      if (wsConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
        console.log('⚠️ WebSocket connection already in progress or connected');
        return;
      }

      wsConnectingRef.current = true;

      // Determine WebSocket URL based on environment
      const isDevelopment = import.meta.env.DEV;
      const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const wsProtocol = isSecure ? 'wss' : 'ws';
      
      // Use Railway backend URL from env or localhost in dev
      const backendUrl = isDevelopment
        ? `${wsProtocol}://localhost:3001`
        : `${wsProtocol}://${import.meta.env.VITE_BACKEND_URL || window.location.host}`;
      
      console.log(`🔌 Connecting to WebSocket: ${backendUrl} (Dev: ${isDevelopment}, Secure: ${isSecure})`);
      const websocket = new WebSocket(backendUrl);

      websocket.onopen = () => {
        console.log('🔌 Connected to SDS WebSocket for real-time subscriptions');
        wsRef.current = websocket;
        setWs(websocket);
        wsConnectingRef.current = false;
        wsReconnectCountRef.current = 0; // Reset reconnect counter on successful connection
        
        // Subscribe to BID_PLACED events via SDS
        websocket.send(JSON.stringify({
          type: 'subscribe_sds',
          eventType: 'BID_PLACED',
          auctionId: 'auction-001'
        }));
        console.log('📡 SDS subscription initiated for BID_PLACED events');
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 WebSocket message received:', data.type, data);
          
          // Skip heartbeat messages
          if (data.type === 'heartbeat') {
            return;
          }
          
          // Handle SDS auction events
          if (data.type === 'auction_event' && data.eventType === 'BID_PLACED') {
            console.log('📡 Real-time bid received via SDS subscription:', data);
            // Update bid history and last bid from WebSocket
            const newBid = {
              address: `${data.data.bidder.slice(0, 6)}...${data.data.bidder.slice(-4)}`,
              amount: parseFloat(data.data.bidAmount)
            };
            
            // Prevent duplicate bids - check if this bid already exists in history
            setBids(prev => {
              // Check if this exact bid already exists
              const isDuplicate = prev.some(
                bid => bid.address === newBid.address && bid.amount === newBid.amount
              );
              
              if (isDuplicate) {
                console.log('⚠️ Duplicate bid prevented:', newBid);
                return prev;
              }
              
              return [newBid, ...prev.slice(0, 9)];
            });
            
            setLastBid(newBid);
            
            // Format event for display - flatten the data structure
            const displayEvent = {
              eventType: data.eventType,
              timestamp: data.timestamp,
              bidder: data.data.bidder,
              bidAmount: data.data.bidAmount,
              txHash: data.data.txHash
            };
            setSdsData(prev => [displayEvent, ...prev.slice(0, 19)]);
            // Refresh auction status
            fetchAuctionStatus();
            
          } else if (data.type === 'sds_subscription_confirmed') {
            console.log('✅ SDS subscription confirmed:', data.subscriptionId);
            
          } else if (data.type === 'sds_heartbeat') {
            console.log('💓 SDS connection heartbeat - stream active');
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      websocket.onclose = () => {
        console.log('🔌 SDS WebSocket disconnected, reconnecting...');
        wsConnectingRef.current = false;
        wsRef.current = null;
        
        // Exponential backoff: 3s, 6s, 12s, 30s max
        wsReconnectCountRef.current++;
        const delay = Math.min(3000 * Math.pow(2, wsReconnectCountRef.current - 1), 30000);
        console.log(`⏱️ Reconnect attempt ${wsReconnectCountRef.current} in ${delay}ms`);
        
        setTimeout(connectWebSocket, delay);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        wsConnectingRef.current = false;
      };
    };

    connectWebSocket();

    return () => {
      // Don't close the WebSocket on unmount in StrictMode - just clean up ref
      // The connection will be reused on remount
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log('🧹 Cleanup: keeping WebSocket open for potential remount');
      }
    };
  }, []);

    // Check if any Ethereum wallet is installed
  const isWalletInstalled = () => {
    if (typeof window === 'undefined') return false;
    
    // Check for window.ethereum (MetaMask, Brave, Opera)
    if ((window as any).ethereum) return true;
    
    // Check for WalletConnect
    if ((window as any).walletconnect) return true;
    
    return false;
  };

  // Connect to wallet
  const connectWallet = async () => {
    console.log('🔗 Connecting to wallet...');
    console.log('Wallet available:', !!window.ethereum);

    if (!isWalletInstalled()) {
      // Show error with WalletConnect option
      setError('No Web3 wallet detected. Please install MetaMask, Brave Wallet, or use WalletConnect at https://walletconnect.com/');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      console.log('📋 Requesting accounts...');
      // Request account access
      const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('✅ Connected account:', account);
      setAccount(account);

      // Try to switch to Somnia testnet
      console.log('🌐 Attempting to switch to Somnia network...');
      try {
        await (window.ethereum as any).request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SOMNIA_CHAIN.chainId }],
        });
        console.log('✅ Switched to Somnia network');
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          console.log('ℹ️ Somnia network not in wallet - please add it manually or use faucet to get test tokens');
        } else {
          console.log('ℹ️ Network switch returned error, but continuing...');
        }
      }

      // Get current network
      const chainIdHex = await (window.ethereum as any).request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16); // Convert hex to decimal
      console.log('📊 Current chain ID (hex):', chainIdHex);
      console.log('📊 Current chain ID (decimal):', chainId);
      console.log('Expected chain ID (decimal):', parseInt(SOMNIA_CHAIN.chainId, 16));
      
      // Set state synchronously to ensure UI updates immediately
      flushSync(() => {
        setAccount(account);
        setIsConnected(true);
        setNetworkName(chainId === parseInt(SOMNIA_CHAIN.chainId, 16) ? 'Somnia Testnet' : 'Different Network');
      });
      
      console.log('🎉 Wallet connection successful!');

    } catch (err: any) {
      console.error('❌ Error connecting to wallet:', err);
      setError(err.message || 'Failed to connect to wallet');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to Somnia testnet
  const switchToSomniaNetwork = async () => {
    console.log('🔄 Attempting to switch to Somnia network...');
    console.log('Target chain ID:', SOMNIA_CHAIN.chainId);

    try {
      console.log('📡 Calling wallet_switchEthereumChain...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SOMNIA_CHAIN.chainId }],
      });
      console.log('✅ Successfully switched to Somnia network');
    } catch (switchError: any) {
      console.log('⚠️ Switch error, code:', switchError.code);
      console.log('Error message:', switchError.message);

      // If it's not a "chain not added" error, just continue
      if (switchError.code === 4902) {
        console.log('🌍 Chain not found');
        // Don't try to add - user will add manually
        throw new Error('Please add Somnia Testnet to your wallet manually, or make sure you\'re already connected to it.');
      } else if (switchError.code === 4001) {
        console.log('⚠️ User rejected network switch');
        throw new Error('Network switch rejected. Please approve the network switch in your wallet.');
      } else {
        // Other errors - just log and continue
        console.log('ℹ️ Network switch returned error, but continuing anyway...');
        // Don't throw - let the app continue
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    console.log('🔌 Disconnecting wallet - full reset...');
    
    // Disable listeners to prevent auto-reconnect
    listenersDisabledRef.current = true;
    console.log('🚫 Listeners disabled');
    
    // Set marker BEFORE clearing storage
    localStorage.setItem('wasDisconnected', 'true');
    
    // Clear all other storage
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    
    // Remove all listeners
    if (window.ethereum) {
      try {
        window.ethereum.removeAllListeners?.();
        console.log('✅ Removed all listeners');
      } catch (e) {
        console.log('Could not remove all listeners:', e);
      }
    }
    
    // Synchronously clear all wallet state using flushSync
    flushSync(() => {
      setAccount('');
      setIsConnected(false);
      setIsConnecting(false);
      setNetworkName('');
      setError('');
      setBids([]);
      setLastBid(null);
    });
    
    console.log('✅ All state cleared');
    
    setToast({
      message: '✅ Wallet disconnected. Reloading page...',
      type: 'success'
    });
    
    // Force hard reload - bypass cache
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 500);
  };

  // Listen for account changes - only when user explicitly switches account in wallet
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      // Skip if listeners are disabled (after disconnect)
      if (listenersDisabledRef.current) {
        console.log('🚫 Listeners disabled, ignoring accountsChanged event');
        return;
      }
      
      console.log('👛 Accounts changed in wallet:', accounts);
      // If user switched accounts in the wallet, reflect it
      if (accounts.length > 0 && isConnected) {
        setAccount(accounts[0]);
      } else if (accounts.length === 0 && isConnected) {
        // User disconnected all accounts
        console.log('🔌 User disconnected all accounts from wallet');
        setAccount('');
        setIsConnected(false);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [isConnected]);

  // Bid placement with MetaMask
  const placeBid = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create ethers provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get current network info
      const network = await provider.getNetwork();
      console.log('📊 Current network:', network.chainId.toString(), network.name);
      console.log('📊 Network is Somnia?', network.chainId === 50312n);

      // Auction contract address
      const AUCTION_ADDRESS = '0x811CD7090a8e7b63ee466A7610d7e28Ba0cda6ef';
      
      // Basic ABI for bid function
      const AUCTION_ABI = [
        "function placeBid() payable",
        "function highestBid() view returns (uint256)",
        "function highestBidder() view returns (address)",
        "function auctionStarted() view returns (bool)",
        "function endTime() view returns (uint256)"
      ];

      const auctionContract = new ethers.Contract(AUCTION_ADDRESS, AUCTION_ABI, signer);

      // Convert bid amount to wei
      const bidAmountWei = ethers.parseEther(bidAmount);

      // Check if bid is higher than current highest bid
      const currentHighestBid = await auctionContract.highestBid();
      if (bidAmountWei <= currentHighestBid) {
        const minBidAmount = ethers.formatEther(currentHighestBid + BigInt(100000000000000)); // Add 0.0001
        setError(`Bid must be higher than current highest bid. Minimum: ${minBidAmount} STT`);
        return;
      }

      // Send transaction
      console.log('💰 Placing bid:', bidAmountWei.toString(), 'wei');
      const tx = await auctionContract.placeBid({ value: bidAmountWei });
      console.log('📝 Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation with timeout
      let receipt = null;
      try {
        receipt = await Promise.race([
          tx.wait(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Receipt timeout')), 15000)
          )
        ]);
        console.log('✅ Transaction confirmed:', receipt?.hash);
      } catch (waitError) {
        console.warn('⚠️ Receipt wait timeout, continuing with hash:', tx.hash);
        receipt = { hash: tx.hash, blockNumber: null };
      }

      // Update auction status
      await fetchAuctionStatus();

      const bidPayload = {
        eventType: 'BID_PLACED',
        auctionId: 'auction-001',
        eventData: {
          bidder: account,
          bidAmount: bidAmount,
          txHash: tx.hash,
          blockNumber: receipt?.blockNumber
        }
      };

      // Try WebSocket first
      let publishedViaWS = false;
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          console.log('📡 Publishing bid to SDS via WebSocket...');
          console.log(`   WebSocket state: ${ws.readyState} (1=OPEN, 2=CLOSING, 3=CLOSED)`);
          ws.send(JSON.stringify({
            type: 'publish_auction_event',
            ...bidPayload
          }));
          publishedViaWS = true;
          console.log('✅ WebSocket message sent successfully');
        } catch (wsError) {
          console.warn('⚠️ WebSocket send failed:', wsError);
        }
      } else {
        console.warn(`⚠️ WebSocket not ready for publish. State: ${ws?.readyState || 'no ws'}`);
      }

      // Always also try REST as backup
      if (!publishedViaWS) {
        console.warn('⚠️ WebSocket not ready, using REST fallback...');
        try {
          const backendUrl = import.meta.env.DEV 
            ? 'http://localhost:3001' 
            : `https://${import.meta.env.VITE_BACKEND_URL || window.location.host}`;
          
          const response = await fetch(`${backendUrl}/api/sds/publish-event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bidPayload)
          });
          const result = await response.json();
          if (result.success) {
            console.log('✅ Bid published to SDS via REST:', result);
          }
        } catch (sdsError) {
          console.warn('⚠️ SDS publish failed:', sdsError);
        }
      }

      // Show transaction hash without popup
      console.log('✅ Bid placed successfully! Transaction:', tx.hash);
      setLastTxHash(tx.hash);
      
      // Add bid to SDS Data directly (since WebSocket broadcast may not work)
      const newBid = {
        eventType: 'BID_PLACED',
        auctionId: 'auction-001',
        bidder: account,
        bidAmount: bidAmount,
        txHash: tx.hash,
        blockNumber: receipt?.blockNumber,
        timestamp: Date.now(),
        source: 'direct_from_blockchain'
      };
      
      setSdsData(prevData => [newBid, ...prevData]);
      console.log('📡 Added bid to local SDS Data:', newBid);
      
      // Also update bids history and last bid for UI sections
      const bidHistoryItem = {
        address: account,
        amount: parseFloat(bidAmount)
      };
      setBids(prev => [bidHistoryItem, ...prev.slice(0, 49)]);
      setLastBid(bidHistoryItem);
      
      // Trigger animation for new bid
      setNewBidIndex(0);
      
      // Reset animation after it completes
      setTimeout(() => setNewBidIndex(null), 500);

    } catch (err: any) {
      console.error('❌ Error placing bid:', err);
      setError(err.message || 'Failed to place bid');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen text-white font-sans flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="relative z-10 container mx-auto px-4 py-8 flex-grow">
        <Header 
          account={account}
          isConnected={isConnected}
          isConnecting={isConnecting}
          networkName={networkName}
          onConnectWallet={connectWallet}
          onDisconnectWallet={disconnectWallet}
        />

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <main className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Row */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="SDS Data (Live Stream)" icon={<Icon name="sds" />}>
              <div className="border-t border-indigo-400/50 text-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3">
                  <div>
                    <p className="font-semibold">SDS Contract:</p>
                    <a 
                      href="https://shannon-explorer.somnia.network/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline break-all"
                    >
                      Somnia Data Streams Active
                    </a>
                    <a 
                      href="https://shannon-explorer.somnia.network/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs mt-1"
                    >
                      <Icon name="explorer" />
                      <span>View on Explorer</span>
                    </a>
                  </div>
                  <div className="mt-2 sm:mt-0 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                    SDS Active
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <Button 
                    fullWidth 
                    size="sm"
                    onClick={fetchSdsData}
                    disabled={sdsLoading}
                    className="mb-3"
                  >
                    {sdsLoading ? 'Loading...' : 'Refresh SDS Data'}
                  </Button>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {sdsData && sdsData.length > 0 ? (
                      sdsData.map((event, index) => (
                        <div key={index} className="bg-black/20 p-2 rounded text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold ${
                              event.eventType === 'BID_PLACED' ? 'text-green-400' :
                              event.eventType === 'AUCTION_STARTED' ? 'text-blue-400' :
                              'text-yellow-400'
                            }`}>
                              {event.eventType ? event.eventType.replace('_', ' ') : 'Event'}
                            </span>
                            <span className="text-gray-400">
                              {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : 'N/A'}
                            </span>
                          </div>
                          {event.bidder && (
                            <div className="text-gray-300">
                              Bidder: <span className="font-mono">{event.bidder.slice(0, 6)}...{event.bidder.slice(-4)}</span>
                            </div>
                          )}
                          {event.bidAmount && (
                            <div className="text-gray-300">
                              Amount: <span className="text-indigo-400 font-bold">{event.bidAmount} STT</span>
                            </div>
                          )}
                          {event.txHash && (
                            <div className="text-gray-300">
                              TX: <a 
                                href={`https://shannon-explorer.somnia.network/tx/${event.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:underline font-mono"
                              >
                                {event.txHash.slice(0, 10)}...{event.txHash.slice(-8)}
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-xs text-center py-2">
                        {sdsLoading ? 'Loading SDS data...' : 'Click refresh to load live SDS events'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Deployed Contracts" icon={<Icon name="contract" />}>
              <div className="space-y-3 text-sm">
                <p className="font-semibold">Auction Contract:</p>
                <a 
                  href={`https://shannon-explorer.somnia.network/address/0x811CD7090a8e7b63ee466A7610d7e28Ba0cda6ef`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline break-all"
                >
                  0x811CD7090a8e7b63ee466A7610d7e28Ba0cda6ef
                </a>
                <a 
                  href={`https://shannon-explorer.somnia.network/address/0x811CD7090a8e7b63ee466A7610d7e28Ba0cda6ef`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs"
                >
                  <Icon name="explorer" />
                  <span>View on Explorer</span>
                </a>
                <p className="font-semibold pt-2">NFT Contract:</p>
                <a 
                  href={`https://shannon-explorer.somnia.network/address/0x6c5cE10cD5dcE7250f5dF94599Ec6869158E966f`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline break-all"
                >
                  0x6c5cE10cD5dcE7250f5dF94599Ec6869158E966f
                </a>
                <a 
                  href={`https://shannon-explorer.somnia.network/address/0x6c5cE10cD5dcE7250f5dF94599Ec6869158E966f`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs"
                >
                  <Icon name="explorer" />
                  <span>View on Explorer</span>
                </a>
              </div>
            </Card>
            <Card title="LIVE Stream" icon={<Icon name="stream" />}>
              <div className="bg-black/20 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-green-400">
                  <span className="font-bold">🟢 Connected</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                {lastBid ? (
                  <div className="space-y-2">
                    <p className="text-gray-400">Latest Bid:</p>
                    <div className="bg-indigo-500/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-mono text-xs text-gray-300 truncate">
                          {lastBid.address.length > 20 ? `${lastBid.address.slice(0, 6)}...${lastBid.address.slice(-4)}` : lastBid.address}
                        </span>
                        <span className="font-bold text-indigo-400 flex-shrink-0">{lastBid.amount.toFixed(4)} STT</span>
                      </div>
                      {lastTxHash && (
                        <p className="text-xs text-gray-500 mt-1">
                          TX: <a 
                            href={`https://shannon-explorer.somnia.network/tx/${lastTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline font-mono"
                          >
                            {lastTxHash.slice(0, 10)}...{lastTxHash.slice(-8)}
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Just now</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Waiting for first bid...</p>
                )}
                <div className="text-xs text-gray-500">
                  {isConnected ? '💡 WebSocket Live (Real-time SDS updates)' : '💡 HTTP polling (Backend API required for live SDS)'}
                </div>
                <div className={`text-xs font-semibold ${isConnected ? 'text-green-400' : 'text-indigo-400'}`}>
                  {isConnected ? '✅ SDS Integration Active' : '🔌 SDS Integration Ready (Connect backend for live stream)'}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <Card title="SDS Integration" icon={<Icon name="sds" />}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-gray-300">Real-time WebSocket streaming active</span>
              </div>
              <div className="text-xs text-gray-400">
                <p>✅ Connected to Somnia Data Streams</p>
                <p>📡 Blockchain events streaming live via WebSocket</p>
              </div>
            </div>
          </Card>

          <Card title="Place Your Bid" icon={<Icon name="bid" />}>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <input
                type="number"
                step="0.1"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto flex-grow"
              />
              <span className="font-bold text-gray-400">STT</span>
              <Button 
                variant="success" 
                className="w-full sm:w-auto" 
                onClick={placeBid}
                disabled={isLoading}
              >
                {isLoading ? 'Placing...' : 'Place Bid'}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {auctionStatus ? `Min bid: ${(parseFloat(auctionStatus.highestBid) + 0.0001).toFixed(4)} STT` : 'Loading minimum bid...'}
            </p>
          </Card>

          <Card title="Auction Status" icon={<Icon name="status" />} className="lg:row-span-2 flex flex-col">
            <div className="flex-grow flex flex-col justify-center items-center space-y-4">
              <Button fullWidth onClick={fetchAuctionStatus} disabled={isLoading}>
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="refresh" />
                  <span>{isLoading ? 'Loading...' : 'Refresh Status'}</span>
                </div>
              </Button>
              
              {auctionStatus ? (
                <div className="w-full space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-bold ${auctionStatus.auctionStarted ? 'text-green-400' : 'text-yellow-400'}`}>
                      {auctionStatus.auctionStarted ? 'Active' : 'Not Started'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Highest Bid:</span>
                    <span className="font-bold text-indigo-400">{auctionStatus.highestBid} STT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Highest Bidder:</span>
                    <span className="font-mono text-xs text-gray-300">
                      {auctionStatus.highestBidder.slice(0, 6)}...{auctionStatus.highestBidder.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">End Time:</span>
                    <span className="text-xs text-gray-300">
                      {new Date(auctionStatus.endTime * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center">Loading auction status...</p>
              )}
            </div>
          </Card>

          <Card title="NFT Information" icon={<Icon name="nft" />}>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-gray-300">NFT Name:</span> Somnia Hackathon NFT #{auctionStatus?.nftId || '0'}</p>
              <p><span className="font-semibold text-gray-300">Contract:</span> {auctionStatus?.nftContract ? `${auctionStatus.nftContract.slice(0, 6)}...${auctionStatus.nftContract.slice(-4)}` : 'Loading...'}</p>
              <p><span className="font-semibold text-gray-300">Token ID:</span> {auctionStatus?.nftId || 'Loading...'}</p>
              <p><span className="font-semibold text-gray-300">Seller:</span> {auctionStatus?.seller ? `${auctionStatus.seller.slice(0, 6)}...${auctionStatus.seller.slice(-4)}` : 'Loading...'}</p>
            </div>
          </Card>

          <Card title="Bid History" icon={<Icon name="history" />}>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {bids && bids.length > 0 ? (
                bids.slice(0, 10).map((bid, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center bg-black/20 p-3 rounded-lg text-sm transition-all duration-500 ${
                      index === 0 ? 'animate-slide-in-right bg-indigo-500/20' : ''
                    }`}
                  >
                    <span className="font-mono text-gray-300 truncate text-xs">
                      {bid.address.length > 20 ? `${bid.address.slice(0, 6)}...${bid.address.slice(-4)}` : bid.address}
                    </span>
                    <span className="font-bold text-indigo-400 flex-shrink-0">{bid.amount.toFixed(4)} STT</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No bids yet...</p>
              )}
            </div>
          </Card>
        </main>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-semibold text-white text-center animate-pulse transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500/80' : 
          toast.type === 'error' ? 'bg-red-500/80' : 
          'bg-blue-500/80'
        }`}>
          {toast.message}
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default App;
