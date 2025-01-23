import React from 'react';
import { Brain } from 'lucide-react';
import { SearchHistory } from './SearchHistory';

interface SidebarProps {
  onSelectThread: (threadId: string) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectThread, onClose, isOpen }) => {
  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 w-72 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          {/* <div className="flex items-center gap-2"> */}
            {/* <Brain className="w-7 h-7 text-[#0A85D1]" /> */}
            {/* <img src="/inquisaibgremove.png" alt="INQUISAI" className="w-10 h-10" /> */}
            {/* <h1 className="text-xl font-bold text-gray-900 ml-2">INQUISAI</h1>
            <img src="/inquisaibgremove.png" alt="INQUISAI" className="h-16 w-auto" />
          </div> */}
                    <div className="flex items-center gap-2">
            <a href="/LandingPage">
              <img src="/inquisaibgremove.png" alt="INQUISAI" className="h-16 w-auto" />
            </a>
            <a href="/LandingPage">
              <h1 className="text-xl font-bold text-gray-900 dark:text-black">INQUISAI</h1>
            </a>
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