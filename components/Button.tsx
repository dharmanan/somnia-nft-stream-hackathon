import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, size = 'md', className = '', ...props }) => {
  const baseStyles = 'px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center';
  
  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 focus:ring-indigo-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 focus:ring-white/50',
    success: 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-600/30 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/30 focus:ring-red-500',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};