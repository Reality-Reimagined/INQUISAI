import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Brain, Plus, Menu } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
// import { SearchHistory } from './components/SearchHistory';
import { SearchOptionsPanel } from './components/SearchOptions';
import { searchApi } from './services/api';
import { useSearchStore } from './store/searchStore';
import { defaultSearchOptions, type SearchOptions } from './types/search';
import { InfoWidgets } from './components/InfoWidgets';
import { Sidebar } from './components/Sidebar';
import { cn } from './utils/cn';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/auth/AuthModal';
import { UsageTracker } from './components/UsageTracker';
import { ThemeToggle } from './components/ThemeToggle';
// import { LandingPage } from './LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function SearchApp() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(defaultSearchOptions);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentConversation, addToConversation, startNewConversation, loadConversation } = useSearchStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', currentQuery, searchOptions],
    queryFn: () => searchApi.search(currentQuery, searchOptions),
    enabled: false,
  });

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    const result = await refetch();
    
    if (result.data) {
      addToConversation({
        id: Date.now().toString(),
        query,
        timestamp: Date.now(),
        response: result.data,
        isFollowUp: currentConversation?.length > 0,
      });
    }
  };

  const mockData = {
    weather: {
      temp: 15,
      condition: "Overcast",
      location: "Windsor",
      forecast: [
        { day: "Wed", temp: 13 },
        { day: "Thu", temp: 25 },
        { day: "Fri", temp: 21 },
        { day: "Sat", temp: 29 },
        { day: "Sun", temp: 27 },
      ]
    },
    stocks: [
      { symbol: "Bitcoin", price: 103.83, change: -2.19 },
      { symbol: "AAPL", price: 223.83, change: 0.53 },
    ]
  };

  const suggestedTopics = [
    "What's happening in tech today?",
    "Explain quantum computing",
    "Latest AI developments",
    "History of the internet",
  ];

  // const popularCategories = [
  //   { name: "Technology", icon: "💻" },
  //   { name: "Science", icon: "🔬" },
  //   { name: "History", icon: "📚" },
  //   { name: "Business", icon: "📈" },
  //   { name: "Arts", icon: "🎨" },
  //   { name: "Health", icon: "🏥" }
  // ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        onSelectThread={loadConversation}
        onClose={() => setIsSidebarOpen(false)}
        isOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1 lg:flex lg:items-center lg:justify-end">
                <div className="flex items-center gap-4 justify-end">
                  {user && (
                    <UsageTracker 
                      searchesUsed={user.searches_used}
                      searchLimit={user.search_limit}
                      className="hidden lg:block"
                    />
                  )}
                  <button
                    onClick={startNewConversation}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                    title="New Thread"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <ThemeToggle />
                  <SearchOptionsPanel options={searchOptions} onChange={setSearchOptions} />
                  {user ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{user.email}</span>
                      <button 
                        onClick={signOut}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Sign Out
                      </button>
                      {user.subscription_tier === 'free' && (
                        <button 
                          className="px-4 py-1.5 text-sm font-medium text-white bg-[#0A85D1] rounded-full hover:bg-[#0972B5] transition-colors"
                          onClick={() => {/* handle upgrade */}}
                        >
                          Upgrade to Pro
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-4 py-1.5 text-sm font-medium text-white bg-[#0A85D1] rounded-full hover:bg-[#0972B5] transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            {!currentConversation?.length ? (
              // Empty state
              <div className="py-8 space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-gray-900">
                    What do you want to know?
                  </h2>
                  <p className="text-lg text-gray-600">
                    Ask anything and get comprehensive answers powered by AI
                  </p>
                </div>

                <div className="space-y-6">
                  <SearchBar onSearch={handleSearch} isLoading={isLoading} />

                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(topic)}
                        className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 rounded-full text-gray-700"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <InfoWidgets weather={mockData.weather} stocks={mockData.stocks} />
                  </div>
                </div>
              </div>
            ) : (
              // Conversation view
              <div className="py-8 space-y-6 mb-24">
                {currentConversation.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "py-6",
                      index !== 0 && "border-t border-gray-100"
                    )}
                  >
                    <p className="font-medium text-gray-700 mb-4">{message.query}</p>
                    {message.response && (
                      <SearchResults 
                        data={message.response} 
                        showRawContent={searchOptions.include_raw_content} 
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentConversation?.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100">
              <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
                <SearchBar 
                  onSearch={handleSearch} 
                  isLoading={isLoading}
                  placeholder="Continue the conversation..."
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xl mx-auto px-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchApp />
    </QueryClientProvider>
  );
}

export default App;