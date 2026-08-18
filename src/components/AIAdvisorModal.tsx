import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  HelpCircle, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Lightbulb
} from 'lucide-react';
import { SystemNode, LifecycleStageId, UserPersona } from '../types';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  allSystems: SystemNode[];
  currentLifecycleFilter: LifecycleStageId | 'all';
  currentPersona: UserPersona;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  allSystems,
  currentLifecycleFilter,
  currentPersona,
}) => {
  if (!isOpen) return null;

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I am your **Enterprise HR Systems Architect & Process Optimization Advisor**.\n\nI have full architectural context on your platforms:\n- **MyHR Portal / HRcore** (Single Source of Truth)\n- **Onboarding App & OneID / ITSP** (Zero-Touch Provisioning)\n- **LearnHUB, Competence Management (CptM) & HR Academy**\n- **HR Services Administration & Power BI Analytics**\n\nHow can I help you optimize your Hire-to-Transition lifecycle today?`
    }
  ]);

  const presetQuestions = [
    "How can we eliminate Day-1 IT provisioning delays between Onboarding App and OneID?",
    "What is the best practice architecture for synchronizing LearnHUB course completions into CptM skills matrix?",
    "How should we structure zero-day automated deprovisioning during the Transition phase?",
    "How can Power BI best ingest high-volume telemetry from HR Services without impacting SAP/ServiceNow SLA?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: {
            currentPersona,
            currentLifecycleFilter,
            activeSystems: allSystems.map(s => ({ id: s.id, name: s.name, code: s.code, category: s.category }))
          }
        })
      });

      const data = await response.json();
      if (data.response) {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      } else {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'An error occurred while generating recommendations. Please check server logs.' 
        }]);
      }
    } catch (err: any) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `Error contacting AI Advisor service: ${err?.message || 'Network error'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-850/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white tracking-tight">
                  HR Systems Architecture & Process Advisor
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Architectural guidance, SLA optimization, integration patterns, and data flow consulting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History & Messages */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs scrollbar-thin">
          
          {/* Preset Questions Chips */}
          {messages.length <= 1 && (
            <div className="space-y-2 mb-4 p-4 rounded-2xl bg-slate-850/60 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested Architectural Inquiries:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 text-left transition-colors flex items-start space-x-2 text-[11px]"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Bubble Stream */}
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.content)}
                      className="absolute top-2 right-2 p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Copy advice"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs py-2">
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Analyzing HR architecture and generating recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about process optimization, SCIM provisioning, CptM skills sync..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-blue-600/20 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
