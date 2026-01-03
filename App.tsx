
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Code2, Bug, Trash2, Terminal as TerminalIcon, Sparkles, X, Cpu, Layers } from 'lucide-react';
import { ApiSettings, ChatMessage } from './types';
import { DEFAULT_MODEL } from './constants';
import { fetchAiResponse } from './services/openRouter';
import Settings from './components/Settings';
import ChatWindow from './components/ChatWindow';
import CodeOutput from './components/CodeOutput';

const App: React.FC = () => {
  const [settings, setSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('dev_agent_settings');
    return saved ? JSON.parse(saved) : { model: DEFAULT_MODEL };
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('// Senior AI Agent Workspace\n// Describe a feature or bug in the console to the left.\n\n/* Example:\n   "Build a custom React hook for handling local storage with encryption"\n*/');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('dev_agent_settings', JSON.stringify(settings));
  }, [settings]);

  const extractCode = (text: string) => {
    const codeBlockRegex = /```[a-zA-Z0-9]*\s*\n?([\s\S]*?)```/g;
    let match;
    let lastCode = null;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      lastCode = match[1];
    }
    return lastCode?.trim() || null;
  };

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { text, sources } = await fetchAiResponse([...messages, userMsg], settings);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: Date.now(),
        sources: sources
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      
      const extracted = extractCode(text);
      if (extracted) {
        setCurrentCode(extracted);
      }
    } catch (err: any) {
      let errorMessage = `Connection Error: ${err.message}. Ensure your local .env.local file contains a valid VITE_GEMINI_API_KEY.`;
      
      // Check for quota exceeded error
      if (err.message && err.message.includes('RESOURCE_EXHAUSTED') || err.message.includes('quota') || err.message.includes('insufficient_quota')) {
        errorMessage = `Quota exceeded for the current model. Try switching to a different model in settings or upgrade your Google AI plan at https://ai.google.dev.`;
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefactor = () => {
    const prompt = `Perform a full code audit and refactor on this implementation. Fix any bugs and optimize for performance:\n\n${currentCode}`;
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Dev Header */}
      <header className="flex h-12 items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
            <Cpu className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-sm font-bold tracking-tight text-[#f0f6fc]">DevAgent IDE</h1>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#30363d] bg-[#0d1117] text-[10px] text-[#8b949e]">
            <span>{settings.model}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefactor}
            disabled={isLoading || currentCode.length < 20}
            className="flex items-center gap-1.5 rounded bg-[#238636] px-3 py-1 text-xs font-semibold text-white hover:bg-[#2ea043] disabled:opacity-30 transition-all shadow-sm"
          >
            <Bug className="h-3.5 w-3.5" />
            Fix & Refactor
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#30363d] rounded transition-colors"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Chat / Instructions */}
        <div className="flex w-[40%] flex-col border-r border-[#30363d] bg-[#0d1117]">
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-[#30363d]">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
              <TerminalIcon className="h-3 w-3" />
              Instruction Console
            </span>
            <button onClick={() => setMessages([])} className="text-[#8b949e] hover:text-rose-400">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <ChatWindow 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage} 
              isTerminalView={false}
            />
          </div>
        </div>

        {/* Implementation / Code */}
        <div className="flex flex-1 flex-col bg-[#010409]">
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-[#30363d]">
            <div className="flex items-center gap-2">
              <Code2 className="h-3 w-3 text-indigo-400" />
              <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Implementation Preview</span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeOutput code={currentCode} />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-lg border border-[#30363d] bg-[#161b22] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#f0f6fc]">Agent Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-[#8b949e] hover:text-[#f0f6fc]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <Settings settings={settings} onSave={(s) => { setSettings(s); setIsSettingsOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
