import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage } from '../services/dataService';
import { sendChatMessage, INITIAL_AI_MESSAGE } from '../services/aiChatService';
import { MarkdownMessage } from '../components/chat/MarkdownMessage';
import { SuggestedDomainsBar } from '../components/chat/SuggestedDomainsBar';
import { Button } from '../components/ui/Button';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Sparkles,
  Bot,
  RotateCcw,
  AlertCircle,
  Loader2,
  Cpu
} from 'lucide-react';

const SAMADHAN_AI_CONVERSATION = {
  id: 'conv-samadhan-ai',
  title: 'Samadhan AI Assistant',
  subtitle: 'Official 25-Domain Civic Assistant (Gemini 2.5 Pro)',
  is_ai: true,
  updated_at: new Date().toISOString()
};

export const MessagingPage = () => {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState('conv-samadhan-ai');
  const [messages, setMessages] = useState([]);
  
  // AI-specific state
  const [aiMessages, setAiMessages] = useState(() => {
    const saved = localStorage.getItem('samadhan_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_AI_MESSAGE];
      }
    }
    return [INITIAL_AI_MESSAGE];
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastAiError, setLastAiError] = useState(null);
  const [lastUserPrompt, setLastUserPrompt] = useState('');

  // General chat state
  const [newMsgText, setNewMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save AI messages to localStorage
  useEffect(() => {
    localStorage.setItem('samadhan_ai_chat_history', JSON.stringify(aiMessages));
  }, [aiMessages]);

  const loadConvs = async () => {
    try {
      const data = await getConversations(profile?.id);
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCurrentMessages = async (convId) => {
    if (!convId || convId === 'conv-samadhan-ai') return;
    try {
      const msgs = await getMessages(convId);
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadConvs();
  }, [profile]);

  useEffect(() => {
    if (activeConvId && activeConvId !== 'conv-samadhan-ai') {
      loadCurrentMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiMessages, isAiLoading]);

  // Handle Send logic
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const trimmed = newMsgText.trim();
    if (!trimmed) return;

    if (activeConvId === 'conv-samadhan-ai') {
      // 1. AI Assistant Chat
      if (isAiLoading) return;

      const userMessage = {
        id: `user-msg-${Date.now()}`,
        sender_id: profile?.id || 'guest-user',
        sender_name: profile?.full_name || 'You',
        sender_role: profile?.role || 'CITIZEN',
        is_ai: false,
        content: trimmed,
        created_at: new Date().toISOString()
      };

      setAiMessages(prev => [...prev, userMessage]);
      setLastUserPrompt(trimmed);
      setNewMsgText('');
      setIsAiLoading(true);
      setLastAiError(null);

      try {
        const result = await sendChatMessage(trimmed, aiMessages);

        if (result.success) {
          const aiReply = {
            id: `ai-msg-${Date.now()}`,
            sender_id: 'samadhan-ai',
            sender_name: 'Samadhan AI',
            sender_role: 'CIVIC AI',
            is_ai: true,
            content: result.reply,
            domain: result.domain,
            created_at: new Date().toISOString()
          };
          setAiMessages(prev => [...prev, aiReply]);
        } else {
          setLastAiError(result.error || 'Failed to communicate with AI engine.');
          const errorReply = {
            id: `ai-err-${Date.now()}`,
            sender_id: 'samadhan-ai',
            sender_name: 'Samadhan AI',
            sender_role: 'CIVIC AI',
            is_ai: true,
            is_error: true,
            content: result.reply || '⚠️ An error occurred while retrieving assistance. Please try again.',
            created_at: new Date().toISOString()
          };
          setAiMessages(prev => [...prev, errorReply]);
        }
      } catch (err) {
        console.error('AI chat exception:', err);
        setLastAiError(err.message);
      } finally {
        setIsAiLoading(false);
      }

    } else {
      // 2. Peer / Project Live Chat
      setSending(true);
      try {
        await sendMessage(activeConvId, profile, trimmed);
        setNewMsgText('');
        await loadCurrentMessages(activeConvId);
        await loadConvs();
      } catch (err) {
        console.error(err);
      } finally {
        setSending(false);
      }
    }
  };

  // Keyboard handler: Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Retry last failed prompt
  const handleRetry = () => {
    if (lastUserPrompt) {
      setNewMsgText(lastUserPrompt);
      inputRef.current?.focus();
    }
  };

  // Reset AI Conversation
  const handleResetAiChat = () => {
    if (window.confirm('Reset conversation with Samadhan AI?')) {
      setAiMessages([INITIAL_AI_MESSAGE]);
      setLastAiError(null);
      localStorage.removeItem('samadhan_ai_chat_history');
    }
  };

  const isAiActive = activeConvId === 'conv-samadhan-ai';
  const activeConv = isAiActive 
    ? SAMADHAN_AI_CONVERSATION 
    : conversations.find(c => c.id === activeConvId);

  // Filter conversations
  const filteredPeerConvs = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[680px] max-h-[780px]">
        
        {/* Left Conversation List Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                Live Messaging
              </h2>
              <span className="text-xs font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-bold">
                Realtime WSS
              </span>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5">
            
            {/* 1. PINNED: SAMADHAN AI ASSISTANT */}
            <button
              onClick={() => setActiveConvId('conv-samadhan-ai')}
              className={`w-full text-left p-3 rounded-2xl transition-all relative overflow-hidden cursor-pointer flex items-center gap-3 ${
                isAiActive 
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-brand-50 border-2 border-brand-500 shadow-sm' 
                  : 'hover:bg-slate-100/80 border border-slate-200/80 bg-white'
              }`}
            >
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20 shrink-0">
                <Bot className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white ring-1 ring-emerald-500/30 flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-slate-900" />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                    <span>Samadhan AI</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-brand-600 text-white font-bold uppercase">
                      25 Domains
                    </span>
                  </p>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                  Official Public Problem & Scheme Guide
                </p>
              </div>
            </button>

            {/* Separator label */}
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Peer & Project Channels
            </div>

            {/* 2. PEER / PROJECT CONVERSATIONS */}
            {filteredPeerConvs.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected 
                      ? 'bg-white border-2 border-brand-400 shadow-sm' 
                      : 'hover:bg-slate-100/60 bg-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                    {conv.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                        {conv.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="md:col-span-8 flex flex-col bg-white">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                isAiActive ? 'bg-gradient-to-tr from-brand-700 to-teal-500' : 'bg-slate-900'
              }`}>
                {isAiActive ? <Bot className="w-5 h-5" /> : activeConv?.title?.charAt(0) || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{activeConv?.title || 'Chat'}</h3>
                  {isAiActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Cpu className="w-3 h-3 text-emerald-600" />
                      Gemini 2.5 Pro
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{activeConv?.subtitle || 'Active conversation'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAiActive ? (
                <button
                  onClick={handleResetAiChat}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-700 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-brand-200 hover:bg-brand-50/50 transition-colors cursor-pointer"
                  title="Clear conversation history"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Chat</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-500">Live Channel</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {isAiActive ? (
              // 1. AI Messages Stream
              aiMessages.map((m) => {
                const isUser = !m.is_ai;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                      <span className="font-bold text-slate-700">
                        {isUser ? m.sender_name : '🤖 Samadhan AI'}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isUser ? 'bg-slate-200 text-slate-600' : 'bg-brand-100 text-brand-800'
                      }`}>
                        {m.sender_role || (isUser ? 'USER' : 'CIVIC AI')}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-2xl rounded-2xl px-4 py-3 text-sm shadow-xs ${
                        isUser
                          ? 'bg-gradient-to-r from-brand-700 to-emerald-700 text-white rounded-tr-sm'
                          : m.is_error
                          ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-sm'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-sm'
                      }`}
                    >
                      <MarkdownMessage content={m.content} isAi={!isUser} />
                    </div>
                  </div>
                );
              })
            ) : (
              // 2. Peer Messages Stream
              messages.map((m) => {
                const isMe = m.sender_id === profile?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                      <span className="font-bold text-slate-700">{m.sender_name}</span>
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                        {m.sender_role}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        isMe
                          ? 'bg-brand-600 text-white rounded-tr-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              })
            )}

            {/* AI Typing / Generating Indicator */}
            {isAiActive && isAiLoading && (
              <div className="flex flex-col items-start animate-in fade-in">
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                  <span className="font-bold text-brand-700">🤖 Samadhan AI</span>
                  <span className="bg-brand-100 text-brand-800 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                    PROCESSING
                  </span>
                </div>
                <div className="bg-white border border-brand-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Samadhan AI is generating factual guidance...
                  </span>
                </div>
              </div>
            )}

            {/* Retry Box on Error */}
            {isAiActive && lastAiError && !isAiLoading && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>The previous query encountered an issue. Would you like to retry?</span>
                </div>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs cursor-pointer shrink-0 ml-2"
                >
                  Retry Query
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Domain Chips (Only for AI Assistant) */}
          {isAiActive && (
            <SuggestedDomainsBar
              onSelectPrompt={(prompt) => {
                setNewMsgText(prompt);
                inputRef.current?.focus();
              }}
              disabled={isAiLoading}
            />
          )}

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                isAiActive 
                  ? "Ask Samadhan AI about public schemes, grievances, agriculture, electricity..." 
                  : "Type your message to project members, mentors, or CSR leaders..."
              }
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAiLoading || sending}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:opacity-60"
            />
            <Button
              type="submit"
              variant="primary"
              icon={isAiLoading ? Loader2 : Send}
              isLoading={sending || isAiLoading}
              disabled={!newMsgText.trim() || isAiLoading || sending}
            >
              Send
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
