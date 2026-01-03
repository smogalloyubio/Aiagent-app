
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage } from '../types';
import { Send, User, Bot, Search, Loader2, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (msg: string) => void;
  isTerminalView: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage, isTerminalView }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0d1117]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center opacity-40 text-center px-8 mt-[-10%]">
            <Sparkles className="h-10 w-10 mb-3 text-indigo-400" />
            <h3 className="text-sm font-bold text-white mb-1">Architectural Planning</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Describe the application or code module you want to build. I will provide step-by-step logic here and the full source code on the right.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
               {msg.role === 'user' ? (
                 <div className="flex items-center gap-2">
                   <User className="h-3 w-3 text-indigo-400" />
                   <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-tighter">User Request</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <Bot className="h-3 w-3 text-emerald-400" />
                   <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-tighter">AI Architect</span>
                 </div>
               )}
            </div>
            
            <div className={`text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'text-[#e6edf3] bg-[#161b22] p-3 rounded-lg border border-[#30363d]' 
                : 'text-[#c9d1d9] prose-chat'
            }`}>
              {msg.role === 'user' ? (
                 <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="my-2 rounded-md overflow-hidden border border-[#30363d]">
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1rem', fontSize: '11px' }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-[#1e293b] px-1 rounded text-[#e2e8f0]" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {msg.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[9px] text-indigo-400 hover:text-indigo-300 transition-colors bg-[#161b22] px-2 py-1 rounded border border-[#30363d]"
                    >
                      <Search className="h-2.5 w-2.5" />
                      {source.title || 'Documentation'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-[#8b949e] text-xs animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Architecting implementation...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#30363d] bg-[#0d1117]">
        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your coding request..."
            rows={1}
            className="w-full resize-none rounded-md border border-[#30363d] bg-[#161b22] pl-4 pr-12 py-3 text-sm text-[#c9d1d9] placeholder-[#484f58] focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]/30 transition-all disabled:opacity-50 scrollbar-hide min-h-[46px] max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-2 rounded-md bg-[#238636] p-1.5 text-white transition-all hover:bg-[#2ea043] disabled:opacity-0 shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-[9px] text-[#484f58] text-center italic">
          Press Enter to send. Shift+Enter for new lines. Code is automatically extracted to the right.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
