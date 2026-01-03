
import { TavilyResponse } from '../types';
import { TAVILY_API_URL } from '../constants';

export const webSearch = async (query: string, apiKey: string): Promise<TavilyResponse> => {
  if (!apiKey) throw new Error("Tavily API Key is missing.");

  const response = await fetch(TAVILY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Tavily API Error: ${errorData.detail || response.statusText}`);
  }

  return response.json();
};
