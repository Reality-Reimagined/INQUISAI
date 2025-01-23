import React from 'react';
import { SearchHistory } from './SearchHistory';

interface SidebarProps {
  onSelectThread: (threadId: string) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectThread, onClose, isOpen }) => {
  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <img src="/inquisaibgremove.png" alt="INQUISAI" className="w-8 h-8" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">INQUISAI</h1>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <SearchHistory 
            onSelectThread={onSelectThread} 
            onClose={onClose} 
          />
        </div>
      </div>
    </div>
  );
};