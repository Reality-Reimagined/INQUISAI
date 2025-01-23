export interface SearchImage {
  url: string;
  description?: string;
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
  raw_content?: string;
}

export interface SearchResponse {
  answer?: string;
  query: string;
  response_time: number;
  results: SearchResult[];
  images?: SearchImage[];
}

export interface ConversationMessage {
  id: string;
  query: string;
  timestamp: number;
  response?: SearchResponse;
  isFollowUp?: boolean;
}

export interface SearchHistory {
  id: string;
  messages: ConversationMessage[];
  timestamp: number;
}

export interface SearchOptions {
  search_depth: 'basic' | 'advanced';
  topic: 'general' | 'news';
  include_images: boolean;
  include_raw_content: boolean;
  include_answer: boolean;
  max_results: number;
  time_range?: 'day' | 'week' | 'month' | 'year';
  include_domains?: string[];
  exclude_domains?: string[];
}

export const defaultSearchOptions: SearchOptions = {
  search_depth: 'basic',
  topic: 'general',
  include_images: false,
  include_raw_content: false,
  include_answer: true,
  max_results: 5,
};