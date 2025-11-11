import React, { useState, useEffect } from 'react';
import type { NFT } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { Button } from './Button';

interface FeaturedNFTProps {
  item: NFT;
}

const DescriptionSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
    </div>
);

export const FeaturedNFT: React.FC<FeaturedNFTProps> = ({ item }) => {
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDescription = async () => {
      setIsLoading(true);
      // Use static description - no external API calls
      const desc = `A captivating piece titled "${item.title}" by the visionary artist ${item.creator}. This NFT represents a unique moment in digital art history, blending creativity with blockchain innovation.`;
      setDescription(desc);
      setIsLoading(false);
    };

    fetchDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.title, item.creator]);

  return (
    <div className="bg-slate-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6 items-center w-full max-w-md mx-auto group hover:-translate-y-2 transition-transform duration-300">
      <div className="w-full">
        <img src={item.imageUrl} alt={item.title} className="w-full aspect-square object-cover rounded-2xl shadow-2xl shadow-black/50" />
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">{item.title}</h2>
        
        <div className="flex items-center space-x-3 mb-4">
          <img src={item.creatorAvatar} alt={item.creator} className="w-10 h-10 rounded-full border-2 border-white/20"/>
          <p className="text-md text-gray-300">by <span className="font-semibold text-white">{item.creator}</span></p>
        </div>
        
        <div className="h-20 mb-4">
            {isLoading ? (
                <DescriptionSkeleton />
            ) : (
                <p className="text-gray-300 italic text-sm">"{description}"</p>
            )}
        </div>

        <div className="bg-black/20 p-4 rounded-xl mb-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-400">Current Bid</p>
                    <p className="text-2xl font-bold text-white">{item.currentBid.toFixed(2)} ETH</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 text-right mb-1">Auction Ends In</p>
                    <CountdownTimer endDate={item.endDate} />
                </div>
            </div>
        </div>
        
        <div className="flex">
            <Button variant="primary" className="flex-1 py-3 text-md">Place a Bid</Button>
        </div>
      </div>
    </div>
  );
};
