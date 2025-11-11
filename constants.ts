import type { NFT, Seller, Collection } from './types';

const now = new Date();

export const MOCK_NFTS: NFT[] = [
  {
    id: 1,
    title: 'Chromatic Dream',
    creator: 'PixelSorcerer',
    creatorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    imageUrl: 'https://picsum.photos/seed/chromatic/600/600',
    currentBid: 5.25,
    endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 2 days 5 hours
    likes: 120,
  },
  {
    id: 2,
    title: 'Cybernetic Echo',
    creator: 'GlitchArtist',
    creatorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705e',
    imageUrl: 'https://picsum.photos/seed/cyber/600/600',
    currentBid: 1.89,
    endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day
    likes: 95,
  },
  {
    id: 3,
    title: 'Aetheric Bloom',
    creator: 'Seraphina',
    creatorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706f',
    imageUrl: 'https://picsum.photos/seed/aetheric/600/600',
    currentBid: 3.5,
    endDate: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours
    likes: 230,
  },
  {
    id: 4,
    title: 'Neon Nomad',
    creator: 'Vex',
    creatorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707g',
    imageUrl: 'https://picsum.photos/seed/neon/600/600',
    currentBid: 2.1,
    endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
    likes: 78,
  },
  {
    id: 5,
    title: 'Forgotten Idol',
    creator: 'RelicHunter',
    creatorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708h',
    imageUrl: 'https://picsum.photos/seed/idol/600/600',
    currentBid: 7.0,
    endDate: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours
    likes: 450,
  },
    {
    id: 6,
    title: 'Quantum Weave',
    creator: 'Syntax',
    creatorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709i',
    imageUrl: 'https://picsum.photos/seed/quantum/600/600',
    currentBid: 4.2,
    endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
    likes: 188,
  },
];

export const TOP_SELLERS: Seller[] = [
    { id: 1, name: 'PixelSorcerer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', sales: 34.5 },
    { id: 2, name: 'GlitchArtist', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705e', sales: 28.9 },
    { id: 3, name: 'Seraphina', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706f', sales: 25.1 },
    { id: 4, name: 'RelicHunter', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708h', sales: 22.7 },
];

export const POPULAR_COLLECTIONS: Collection[] = [
    {
        id: 1,
        name: 'Cybernetic Visions',
        creator: 'GlitchArtist',
        itemCount: 25,
        mainImage: 'https://picsum.photos/seed/collection1-main/500/500',
        subImages: [
            'https://picsum.photos/seed/collection1-sub1/150/150',
            'https://picsum.photos/seed/collection1-sub2/150/150',
            'https://picsum.photos/seed/collection1-sub3/150/150',
        ]
    },
    {
        id: 2,
        name: 'Organic Algorithms',
        creator: 'Seraphina',
        itemCount: 18,
        mainImage: 'https://picsum.photos/seed/collection2-main/500/500',
        subImages: [
            'https://picsum.photos/seed/collection2-sub1/150/150',
            'https://picsum.photos/seed/collection2-sub2/150/150',
            'https://picsum.photos/seed/collection2-sub3/150/150',
        ]
    },
    {
        id: 3,
        name: 'Dreamscapes',
        creator: 'PixelSorcerer',
        itemCount: 42,
        mainImage: 'https://picsum.photos/seed/collection3-main/500/500',
        subImages: [
            'https://picsum.photos/seed/collection3-sub1/150/150',
            'https://picsum.photos/seed/collection3-sub2/150/150',
            'https://picsum.photos/seed/collection3-sub3/150/150',
        ]
    }
];
