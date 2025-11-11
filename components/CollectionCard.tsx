import React from 'react';
import type { Collection } from '../types';

interface CollectionCardProps {
    collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
    return (
        <div className="space-y-4 group">
            <div className="aspect-square overflow-hidden rounded-2xl">
                <img 
                    src={collection.mainImage} 
                    alt={collection.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="flex justify-between gap-4">
                {collection.subImages.map((img, index) => (
                    <div key={index} className="w-1/3 aspect-square overflow-hidden rounded-xl">
                        <img 
                            src={img} 
                            alt={`${collection.name} sub image ${index+1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                ))}
            </div>
             <div>
                <h3 className="font-bold text-lg text-white truncate">{collection.name}</h3>
                <p className="text-sm text-gray-400">by {collection.creator} - <span className="text-indigo-400">{collection.itemCount} items</span></p>
            </div>
        </div>
    );
};
