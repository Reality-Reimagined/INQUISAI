import { create } from 'zustand';
import { ConversationMessage, SearchHistory } from '../types/search';

interface SearchStore {
  currentConversation: ConversationMessage[] | null;
  history: SearchHistory[];
  startNewConversation: () => void;
  addToConversation: (message: ConversationMessage) => void;
  loadConversation: (threadId: string) => void;
  clearHistory: () => void;
  deleteThread: (threadId: string) => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  currentConversation: null,
  history: [],
  startNewConversation: () => {
    set((state) => {
      if (state.currentConversation && state.currentConversation.length > 0) {
        const newHistory: SearchHistory = {
          id: Date.now().toString(),
          messages: state.currentConversation,
          timestamp: Date.now(),
        };
        return {
          currentConversation: null,
          history: [newHistory, ...state.history].slice(0, 50),
        };
      }
      return { currentConversation: null };
    });
  },
  addToConversation: (message) => {
    set((state) => ({
      currentConversation: [
        ...(state.currentConversation || []),
        message,
      ],
    }));
  },
  loadConversation: (threadId: string) => {
    const thread = get().history.find(h => h.id === threadId);
    if (thread) {
      set({ currentConversation: thread.messages });
    }
  },
  clearHistory: () => set({ history: [], currentConversation: null }),
  deleteThread: (threadId: string) => 
    set((state) => ({
      history: state.history.filter((thread) => thread.id !== threadId),
      currentConversation: state.currentConversation && 
        state.history.find(h => h.id === threadId)?.messages === state.currentConversation 
        ? null 
        : state.currentConversation
    })),
}));