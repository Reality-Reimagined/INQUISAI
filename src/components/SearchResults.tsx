import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SearchResponse } from '../types/search';
import { cn } from '../utils/cn';

interface ImageData {
  url: string;
  description?: string;
}

interface SearchResultsProps {
  data: SearchResponse;
  showRawContent: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ data, showRawContent }) => {
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageUrl: string) => {
    console.error(`Failed to load image: ${imageUrl}`);
    setFailedImages(prev => new Set(prev).add(imageUrl));
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-8">
      {data.answer && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ReactMarkdown className="prose max-w-none">
            {data.answer}
          </ReactMarkdown>
        </div>
      )}

      {data.images && data.images.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Related Images ({data.images.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-video bg-gray-100 rounded-xl overflow-hidden"
              >
                {!failedImages.has(image) ? (
                  <img
                    src={image}
                    alt="Search result image"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(image)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 flex-col gap-2">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm text-center px-4">
                      Image Unavailable
                    </span>
                  </div>
                )}
                {!failedImages.has(image) && (
                  <a
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 cursor-zoom-in"
                    aria-label="View full image"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            Sources
            <span className="text-sm font-normal text-gray-500">
              ({data.results.length})
            </span>
          </h2>
          {isSourcesExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {isSourcesExpanded && (
          <div className="space-y-3">
            {data.results.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-xl shadow-sm border border-gray-100 p-4",
                  "hover:border-[#0A85D1] transition-colors"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A85D1] hover:text-[#0972B5] font-medium flex items-center gap-2"
                    >
                      {result.title}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {result.published_date && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(result.published_date).toLocaleDateString()}
                      </div>
                    )}
                    <p className="mt-2 text-gray-600 text-sm">
                      {showRawContent && result.raw_content ? result.raw_content : result.content}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    {Math.round(result.score * 100)}% relevant
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};