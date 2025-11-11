import React from 'react';
import type { NFT } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { Button } from './Button';

interface NFTCardProps {
  item: NFT;
}

const LikeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

export const NFTCard: React.FC<NFTCardProps> = ({ item }) => {
  return (
    <div className="bg-slate-500/10 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden group transition-all duration-300 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2">
      <div className="relative aspect-square overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1.5 group cursor-pointer">
            <LikeIcon />
            <span className="text-sm text-white font-semibold">{item.likes}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center space-x-3 mb-4">
          <img src={item.creatorAvatar} alt={item.creator} className="w-8 h-8 rounded-full border-2 border-white/20"/>
          <div>
            <h3 className="font-bold text-lg text-white truncate">{item.title}</h3>
            <p className="text-sm text-gray-400">by {item.creator}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg mb-4">
            <div>
                <p className="text-xs text-gray-400">Current Bid</p>
                <p className="font-bold text-white">{item.currentBid.toFixed(2)} ETH</p>
            </div>
            <CountdownTimer endDate={item.endDate} />
        </div>

        <Button fullWidth>Place Bid</Button>
      </div>
    </div>
  );
};
