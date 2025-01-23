import React from 'react';
import { cn } from '../utils/cn';

interface UsageTrackerProps {
  searchesUsed: number;
  searchLimit: number;
  className?: string;
}

export const UsageTracker: React.FC<UsageTrackerProps> = ({ 
  searchesUsed, 
  searchLimit,
  className 
}) => {
  const percentage = (searchesUsed / searchLimit) * 100;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out transform origin-left",
            "bg-[#0A85D1] dark:bg-[#0A85D1]",
            searchesUsed > 0 && "animate-pulse-once"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 tabular-nums">
        {searchesUsed}/{searchLimit} searches
      </span>
    </div>
  );
};