
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool' | 'model';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isToolCall?: boolean;
  toolResult?: any;
  sources?: { title: string; url: string }[];
}

export interface ApiSettings {
  model: string;
  tavilyApiKey?: string;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilyResponse {
  results: TavilySearchResult[];
}

export interface ToolCall {
  name: string;
  arguments: any;
}
