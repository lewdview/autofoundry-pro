import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true, 
  variant = 'full' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const LogoIcon = () => (
    <img
      src="/logo.png"
      alt="AutoFoundry PRO Logo"
      className={cn(
        "object-contain rounded-lg shadow-lg",
        sizeClasses[size],
        className
      )}
    />
  );

  const LogoText = () => (
    <div className="flex flex-col">
      <span className={cn(
        "font-bold text-gray-800",
        textSizeClasses[size]
      )}>
        AutoFoundry
        <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent ml-1">
          PRO
        </span>
      </span>
      {size !== 'sm' && (
        <span className="text-xs text-gray-500 -mt-1">Business Automation</span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className="flex items-center space-x-3">
      <LogoIcon />
      {showText && <LogoText />}
    </div>
  );
};

export default Logo;
