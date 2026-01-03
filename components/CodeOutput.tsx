
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeOutputProps {
  code: string;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-full w-full overflow-hidden group flex flex-col">
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded bg-[#30363d] px-2.5 py-1 text-[11px] font-medium text-[#c9d1d9] border border-[#444c56] hover:bg-[#444c56] transition-all"
        >
          {copied ? (
            <><Check className="h-3 w-3 text-emerald-400" /> Copied</>
          ) : (
            <><Copy className="h-3 w-3" /> Copy Plan</>
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-auto bg-[#0d1117]">
        <SyntaxHighlighter
          language="markdown"
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            height: '100%',
            fontSize: '13px',
            lineHeight: '1.7',
            fontFamily: '"Fira Code", monospace'
          }}
          showLineNumbers={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeOutput;
