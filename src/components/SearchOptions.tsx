import React from 'react';
import { Settings, X } from 'lucide-react';
import { SearchOptions, defaultSearchOptions } from '../types/search';
import { cn } from '../utils/cn';

interface SearchOptionsPanelProps {
  options: SearchOptions;
  onChange: (options: SearchOptions) => void;
}

export const SearchOptionsPanel: React.FC<SearchOptionsPanelProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-md text-gray-500 hover:text-gray-700",
          "transition-colors duration-200",
          isOpen && "text-blue-600"
        )}
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Search Options</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Depth
              </label>
              <select
                value={options.search_depth}
                onChange={(e) => onChange({ ...options, search_depth: e.target.value as 'basic' | 'advanced' })}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="basic">Basic</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <select
                value={options.topic}
                onChange={(e) => onChange({ ...options, topic: e.target.value as 'general' | 'news' })}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="general">General</option>
                <option value="news">News</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={options.time_range || ''}
                onChange={(e) => onChange({ ...options, time_range: e.target.value as SearchOptions['time_range'] })}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">All Time</option>
                <option value="day">Past Day</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Results
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={options.max_results}
                onChange={(e) => onChange({ ...options, max_results: parseInt(e.target.value) })}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.include_images}
                  onChange={(e) => onChange({ ...options, include_images: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include Images</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.include_raw_content}
                  onChange={(e) => onChange({ ...options, include_raw_content: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include Raw Content</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.include_answer}
                  onChange={(e) => onChange({ ...options, include_answer: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include AI Answer</span>
              </label>
            </div>

            <button
              onClick={() => onChange(defaultSearchOptions)}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};