'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, ChevronDown, ChevronUp, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatAssistantProps {
  modality: 'CT' | 'MRI' | 'XRAY';
}

const sampleResponses: Record<string, string> = {
  default: "Unë jam asistenti juaj AI i radiologjisë. Mund t'ju ndihmoj të kuptoni gjetjet, të lundëroni studimet dhe të përgjigjeni pyetjeve rreth imazhit.",
  finding: "Bazuar në radiografinë aktuale të gjoksit, kam identifikuar disa gjetje të mundshme. Analiza AI thekson zona me rezultate probabiliteti. Dëshironi që t'ju shpjegoj çdo gjetje?",
  measurement: "Për të matur dimensionet e fushës pulmonare ose siluetën kardiale, përdorni mjetet e matjes. Këto mund të ndihmojnë në vlerësimin e kardiomegalisë ose anomalive pulmonare.",
  window: "Për radiografi të gjoksit, provoni paracaktimin 'Përmirësim i Kockave' për të vizualizuar më mirë brinjët dhe shtyllën kurrizore, ose 'Indi i Butë' për detaje të parenkimës pulmonare.",
};

export function AIChatAssistant({ modality }: AIChatAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Përshëndetje! Unë jam asistenti juaj AI për imazhet ${modality}. Si mund t'ju ndihmoj të analizoni këtë studim?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response (mock)
    setTimeout(() => {
      let response = sampleResponses.default;
      const inputLower = input.toLowerCase();

      if (inputLower.includes('finding') || inputLower.includes('see') || inputLower.includes('spot')) {
        response = sampleResponses.finding;
      } else if (inputLower.includes('measure') || inputLower.includes('size')) {
        response = sampleResponses.measurement;
      } else if (inputLower.includes('window') || inputLower.includes('contrast') || inputLower.includes('brightness')) {
        response = sampleResponses.window;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  return (
    <div className="border-t border-white/10">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/20 rounded">
            <MessageCircle className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-text-primary">Asistenti AI</span>
          {messages.length > 1 && (
            <span className="text-xs text-text-muted">({messages.length - 1})</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {/* Chat Area */}
      {isExpanded && (
        <div className="flex flex-col h-[500px] bg-[#1a1a1a]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-full flex-shrink-0 h-fit',
                    message.role === 'user' ? 'bg-primary/20' : 'bg-ai-cyan/20'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-3 h-3 text-primary" />
                  ) : (
                    <Bot className="w-3 h-3 text-ai-cyan" />
                  )}
                </div>
                <div
                  className={cn(
                    'rounded-lg p-2.5 max-w-[85%]',
                    message.role === 'user'
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-black/40 border border-white/10'
                  )}
                >
                  <p className="text-xs text-text-primary leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pyesni për gjetjet, matjet..."
                className="flex-1 h-8 bg-black/40 border-white/10 text-xs text-text-primary placeholder:text-text-muted"
              />
              <Button
                onClick={handleSend}
                size="sm"
                className="h-8 px-3 bg-primary hover:bg-primary/80"
                disabled={!input.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
