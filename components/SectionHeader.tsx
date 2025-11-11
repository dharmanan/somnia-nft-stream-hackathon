import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-lg text-gray-400 mt-2">{subtitle}</p>}
        </div>
    );
};
