import React from 'react';
import type { Seller } from '../types';

interface TopSellersProps {
    sellers: Seller[];
}

const SellerCard: React.FC<{ seller: Seller; rank: number }> = ({ seller, rank }) => (
    <div className="flex items-center space-x-4 p-4 bg-slate-500/10 rounded-xl border border-transparent hover:border-white/20 transition-colors">
        <span className="text-xl font-bold text-gray-400 w-6 text-center">{rank}</span>
        <img src={seller.avatar} alt={seller.name} className="w-14 h-14 rounded-full" />
        <div>
            <h4 className="font-bold text-white text-lg">{seller.name}</h4>
            <p className="text-sm text-indigo-400 font-semibold">{seller.sales.toFixed(2)} ETH</p>
        </div>
    </div>
);

export const TopSellers: React.FC<TopSellersProps> = ({ sellers }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellers.map((seller, index) => (
                <SellerCard key={seller.id} seller={seller} rank={index + 1} />
            ))}
        </div>
    );
};
