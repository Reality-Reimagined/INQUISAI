import axios from 'axios';
import { SearchResponse, SearchOptions } from '../types/search';

const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;
const API_BASE_URL = 'https://api.tavily.com';

export const searchApi = {
  search: async (query: string, options: SearchOptions): Promise<SearchResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, {
        api_key: TAVILY_API_KEY,
        query,
        ...options,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Search failed');
      }
      throw error;
    }
  }
};