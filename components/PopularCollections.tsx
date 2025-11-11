import React from 'react';
import type { Collection } from '../types';
import { CollectionCard } from './CollectionCard';

interface PopularCollectionsProps {
    collections: Collection[];
}

export const PopularCollections: React.FC<PopularCollectionsProps> = ({ collections }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {collections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
    );
};
