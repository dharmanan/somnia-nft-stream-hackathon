import React from 'react';

interface CardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
    return (
        <div className={`bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg ${className}`}>
            <div className="p-5">
                <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
                    <div className="text-indigo-400">
                        {icon}
                    </div>
                    <h3 className="font-bold text-white text-md">{title}</h3>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};