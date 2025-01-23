import React from 'react';
import { Clock, X, MessageSquare, Trash2, User } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';
import { cn } from '../utils/cn';
import { UsageTracker } from './UsageTracker';
import { useAuth } from '../hooks/useAuth';

interface SearchHistoryProps {
  onSelectThread: (threadId: string) => void;
  onClose?: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectThread, onClose }) => {
  const { history, clearHistory, deleteThread } = useSearchStore();
  const { user, signOut } = useAuth();

  const handleThreadClick = (threadId: string) => {
    onSelectThread(threadId);
    onClose?.();
  };

  const handleDeleteThread = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    deleteThread(threadId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.email || 'Guest'}</p>
              <p className="text-xs text-gray-500">{user?.subscription_tier || 'Free Plan'}</p>
            </div>
          </div>
          {user && (
            <button
              onClick={signOut}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No conversation history yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Previous Threads
              </h2>
              <button
                onClick={clearHistory}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
                aria-label="Clear all history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {history.map((thread) => (
                <div key={thread.id} className="relative group">
                  <button
                    onClick={() => handleThreadClick(thread.id)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left",
                      "bg-white hover:bg-gray-50 border border-gray-200",
                      "hover:border-[#0A85D1] transition-colors"
                    )}
                  >
                    <p className="font-medium text-gray-800 line-clamp-2">
                      {thread.messages[0].query}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.messages.length} messages</span>
                      <span>·</span>
                      <span>{new Date(thread.timestamp).toLocaleDateString()}</span>
                      <button
                        onClick={(e) => handleDeleteThread(e, thread.id)}
                        className={cn(
                          "ml-auto p-1.5 rounded-md",
                          "text-gray-400 hover:text-red-500",
                          "opacity-0 group-hover:opacity-100 transition-opacity",
                          "hover:bg-red-50"
                        )}
                        aria-label="Delete thread"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Usage Tracker */}
      <div className="border-t border-gray-200">
        <UsageTracker 
          stripePricing={{
            credits: {
              price: 'price_credits',
              amount: 100,
              cost: 5
            },
            subscription: {
              price: 'price_subscription',
              searches: 1000,
              cost: 10
            }
          }} 
        />
      </div>
    </div>
  );
};