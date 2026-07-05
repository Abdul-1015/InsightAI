import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Sparkles, Database, BarChart2, Lightbulb, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { chatMessages as initialMessages } from '../../data/mock';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant' as const,
        content: `I've analyzed your query: "${input}"\n\nBased on the available data, here are my findings:\n\n**Key Metrics:**\n- Total revenue this quarter: $255K\n- Growth rate: +15.2% MoM\n- Active users: 2,898\n\n**Recommendations:**\n1. Focus on Enterprise tier expansion\n2. Monitor conversion funnel drop-offs\n3. Consider increasing marketing spend\n\nWould you like me to dive deeper into any specific area?`
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestedQuestions = [
    { icon: BarChart2, text: 'What were our top performing products last quarter?' },
    { icon: Lightbulb, text: 'Show me the churn rate by plan type' },
    { icon: Database, text: 'Compare revenue across all regions' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>AI Chat</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Ask questions about your data in natural language</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
          <Plus className="w-3.5 h-3.5" /> New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4F46E5] flex items-center justify-center mb-6 shadow-lg shadow-[#4F46E5]/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              What can I help you analyze?
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
              Ask questions about your data in natural language. I can help with trends, comparisons, forecasts, and more.
            </p>
            <div className="grid gap-3 w-full max-w-md">
              {suggestedQuestions.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => setInput(text)}
                  className="flex items-center gap-3 p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors text-sm text-foreground"
                >
                  <Icon className="w-4 h-4 text-[#4F46E5] flex-shrink-0" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[70%] rounded-xl px-4 py-3',
                  msg.role === 'user' ? 'bg-[#4F46E5] text-white' : 'bg-muted text-foreground'
                )}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-background hover:text-foreground transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            placeholder="Ask a question about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              input.trim()
                ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          <Sparkles className="w-3 h-3 inline mr-1" />
          AI-powered insights based on your uploaded data
        </p>
      </div>
    </div>
  );
}