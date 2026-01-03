
import React, { useState } from 'react';
import { ApiSettings } from '../types';
import { DEFAULT_MODEL } from '../constants';
import { Key, Globe, Cpu, Check, AlertCircle, Shield } from 'lucide-react';

interface SettingsProps {
  settings: ApiSettings;
  onSave: (settings: ApiSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>(settings);

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#8b949e]">
          <Cpu className="h-3.5 w-3.5" />
          Model Preference
        </label>
        <select
          value={localSettings.model}
          onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
          className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#c9d1d9] focus:border-[#1f6feb] focus:outline-none transition-colors appearance-none"
        >
          <option value="gemini-3-pro-preview">Gemini 3 Pro (High Quality)</option>
          <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#8b949e]">
          <Globe className="h-3.5 w-3.5" />
          Tavily API Key (Optional)
        </label>
        <div className="relative">
          <input
            type="password"
            value={localSettings.tavilyApiKey || ''}
            onChange={(e) => setLocalSettings({ ...localSettings, tavilyApiKey: e.target.value })}
            placeholder="tvly-..."
            className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] pl-10 pr-3 py-2 text-sm text-[#c9d1d9] focus:border-[#1f6feb] focus:outline-none transition-colors"
          />
          <Key className="absolute left-3 top-2.5 h-4 w-4 text-[#484f58]" />
        </div>
        <p className="text-[10px] text-[#484f58]">Stored locally in your browser for web search integration.</p>
      </div>

      <div className="flex items-start gap-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200/70 italic">
        <Shield className="h-3 w-3 shrink-0 mt-0.5" />
        <span>Gemini API Key is handled by your system's environment variables (API_KEY).</span>
      </div>

      <button
        onClick={() => onSave(localSettings)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#238636] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2ea043] active:scale-[0.98]"
      >
        <Check className="h-4 w-4" />
        Save Configuration
      </button>
    </div>
  );
};

export default Settings;
