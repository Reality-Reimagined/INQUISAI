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
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-600">
              No conversation history yet
            </p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {history.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleThreadClick(thread.id)}
                className={cn(
                  "w-full px-3 py-2 text-left rounded-lg group",
                  "hover:bg-gray-100",
                  "text-sm text-gray-700",
                  "transition-colors duration-150",
                  "flex items-center justify-between"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">
                    {thread.messages[0]?.query || 'New Conversation'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(thread.messages[0]?.timestamp || Date.now()).toLocaleDateString()}
                    <MessageSquare className="w-3 h-3 ml-2" />
                    {thread.messages.length} messages
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteThread(e, thread.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Usage Tracker */}
      <div className="border-t border-gray-200">
        <UsageTracker 
          searchesUsed={user?.searches_used || 0}
          searchLimit={user?.search_limit || 10}
        />
      </div>
    </div>
  );
};