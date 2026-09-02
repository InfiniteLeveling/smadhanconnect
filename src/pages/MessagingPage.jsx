import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage } from '../services/dataService';
import { sendChatMessage, INITIAL_AI_MESSAGE } from '../services/aiChatService';
import { MarkdownMessage } from '../components/chat/MarkdownMessage';
import { SuggestedDomainsBar } from '../components/chat/SuggestedDomainsBar';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Sparkles,
  Bot,
  RotateCcw,
  AlertCircle,
  Loader2,
  Cpu,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  ThumbsUp,
  Share2,
  CornerDownLeft
} from 'lucide-react';

const SAMADHAN_AI_CONVERSATION = {
  id: 'conv-samadhan-ai',
  title: 'Samadhan AI Assistant',
  subtitle: 'Official 25-Domain Civic Assistant (Gemini 2.5 Pro)',
  is_ai: true,
  updated_at: new Date().toISOString()
};

const STARTER_PROMPTS = [
  {
    icon: '🌾',
    title: 'Agriculture & Subsidies',
    prompt: 'What are the eligibility criteria and documents required for Mukhyamantri Krishi Ashirwad Yojana and PM-KISAN in Jharkhand?'
  },
  {
    icon: '⚡',
    title: 'Electricity & JBVNL',
    prompt: 'How do I register an online grievance for prolonged power outage and incorrect electricity billing in Ranchi?'
  },
  {
    icon: '🎓',
    title: 'Student CSR Grants',
    prompt: 'How can a student innovation team submit a prototype on Samadhan Connect to secure corporate CSR funding?'
  },
  {
    icon: '🆔',
    title: 'JharSewa Certificates',
    prompt: 'What is the standard turnaround time and application procedure for Income, Caste, and Residential certificates on JharSewa?'
  }
];

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
  const [copiedMsgId, setCopiedMsgId] = useState(null);

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
      setConversations(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCurrentMessages = async (convId) => {
    if (!convId || convId === 'conv-samadhan-ai') return;
    try {
      const msgs = await getMessages(convId);
      setMessages(msgs || []);
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
        console.error(err);
        const errorReply = {
          id: `ai-err-${Date.now()}`,
          sender_id: 'samadhan-ai',
          sender_name: 'Samadhan AI',
          sender_role: 'CIVIC AI',
          is_ai: true,
          is_error: true,
          content: '⚠️ Failed to connect to Samadhan AI network. Please check your connection and try again.',
          created_at: new Date().toISOString()
        };
        setAiMessages(prev => [...prev, errorReply]);
      } finally {
        setIsAiLoading(false);
      }

    } else {
      // 2. Peer / Project Channel Chat
      setSending(true);
      try {
        const msg = await sendMessage(activeConvId, profile?.id, trimmed);
        setMessages(prev => [...prev, msg]);
        setNewMsgText('');
      } catch (err) {
        console.error(err);
      } finally {
        setSending(false);
      }
    }
  };

  const handleResetAiChat = () => {
    setAiMessages([INITIAL_AI_MESSAGE]);
    setLastAiError(null);
    localStorage.removeItem('samadhan_ai_chat_history');
  };

  const handleSelectSuggestedPrompt = (promptText) => {
    setNewMsgText(promptText);
    inputRef.current?.focus();
  };

  const handleCopyMessage = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const activeConv = activeConvId === 'conv-samadhan-ai' 
    ? SAMADHAN_AI_CONVERSATION 
    : conversations.find(c => c.id === activeConvId);

  const isAiActive = activeConvId === 'conv-samadhan-ai';

  const filteredPeerConvs = conversations.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Decorative Top Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-brand-200/20 via-emerald-100/10 to-transparent pointer-events-none -z-10 blur-3xl" />

      {/* Main Glassmorphic Workspace Container */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[760px] max-h-[88vh]">
        
        {/* =================================================================== */}
        {/* 1. LEFT SIDEBAR: CHANNEL DIRECTORY & CONVERSATIONS                  */}
        {/* =================================================================== */}
        <div className="md:col-span-4 lg:col-span-4 border-r border-slate-200/80 bg-slate-50/60 flex flex-col h-full">
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700 shadow-2xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 font-display text-sm tracking-tight">
                Live Messaging
              </h2>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime WSS</span>
            </div>
          </div>

          {/* Search Channels Input */}
          <div className="p-3 border-b border-slate-200/70">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Channels & Conversations List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            
            {/* PINNED SAMADHAN AI CHANNEL CARD */}
            <button
              onClick={() => setActiveConvId('conv-samadhan-ai')}
              className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                activeConvId === 'conv-samadhan-ai'
                  ? 'bg-gradient-to-r from-brand-50 via-emerald-50 to-teal-50 border-2 border-emerald-500/80 shadow-md shadow-emerald-500/10 scale-[1.01]'
                  : 'bg-white hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Left AI Glowing Icon */}
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/25 shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white ring-1 ring-emerald-500/30 flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-slate-900" />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                    <span>Samadhan AI</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold uppercase shadow-2xs">
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
            <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Peer & Project Channels</span>
              <span className="text-[9px] text-slate-400 bg-slate-200/70 px-1.5 py-0.2 rounded font-mono">
                {filteredPeerConvs.length}
              </span>
            </div>

            {/* PEER / PROJECT CONVERSATIONS */}
            {filteredPeerConvs.length === 0 ? (
              <div className="text-center py-6 px-3">
                <p className="text-xs text-slate-400 font-medium">No project channels found</p>
              </div>
            ) : (
              filteredPeerConvs.map((conv) => {
                const isSelected = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-white border-2 border-brand-500 shadow-md shadow-brand-500/10' 
                        : 'hover:bg-white/80 bg-white/40 border border-slate-200/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {conv.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                          {conv.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{conv.subtitle}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. RIGHT CHAT PANEL: STREAM & FLOATING INPUT                       */}
        {/* =================================================================== */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-white h-full relative">
          
          {/* Chat Pane Header */}
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                isAiActive 
                  ? 'bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 shadow-brand-600/20' 
                  : 'bg-slate-900'
              }`}>
                {isAiActive ? <Bot className="w-5 h-5" /> : activeConv?.title?.charAt(0) || 'C'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 font-display">
                    {activeConv?.title || 'Chat'}
                  </h3>
                  {isAiActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Cpu className="w-3 h-3 text-emerald-600" />
                      Gemini 2.5 Pro
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {isAiActive ? 'Official 25-Domain Civic Assistant (Google GenAI Engine)' : activeConv?.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAiActive ? (
                <button
                  onClick={handleResetAiChat}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-700 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/60 transition-all cursor-pointer shadow-2xs"
                  title="Clear chat history and start fresh"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Chat</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Project Mesh</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
            
            {/* PROMPT STARTERS GRID (Shown when only initial message exists) */}
            {isAiActive && aiMessages.length === 1 && (
              <div className="pt-2 pb-4 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Popular Civic Inquiry Starters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestedPrompt(item.prompt)}
                      className="group p-3.5 rounded-2xl bg-white hover:bg-brand-50/60 border border-slate-200/90 hover:border-brand-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-base">{item.icon}</span>
                          <span className="text-[10px] font-bold text-brand-700 font-mono flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Ask this</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES LIST */}
            {isAiActive ? (
              // 1. AI Assistant Chat Stream
              aiMessages.map((m) => {
                const isUser = !m.is_ai;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                  >
                    {/* Message Header Pill */}
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                      <span className="font-bold text-slate-700">
                        {isUser ? (m.sender_name || 'You') : '🤖 Samadhan AI'}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                        isUser 
                          ? 'bg-slate-200/80 text-slate-700' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                      }`}>
                        {m.sender_role || (isUser ? 'USER' : 'CIVIC AI')}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Message Bubble Card */}
                    <div
                      className={`relative max-w-2xl rounded-3xl p-4 sm:p-5 text-sm shadow-sm transition-all ${
                        isUser
                          ? 'bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600 text-white rounded-tr-xs shadow-md shadow-brand-700/20'
                          : m.is_error
                          ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-xs'
                          : 'bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs hover:shadow-md'
                      }`}
                    >
                      <MarkdownMessage content={m.content} isAi={!isUser} />

                      {/* AI Response Action Toolbar */}
                      {!isUser && !m.is_error && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified 25-Domain Guidance</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyMessage(m.id, m.content)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                              title="Copy response to clipboard"
                            >
                              {copiedMsgId === m.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              // 2. Peer / Project Channel Stream
              messages.map((m) => {
                const isMe = m.sender_id === profile?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                      <span className="font-bold text-slate-700">{m.sender_name}</span>
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                        {m.sender_role}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 text-sm shadow-xs ${
                        isMe
                          ? 'bg-gradient-to-r from-brand-700 to-emerald-600 text-white rounded-tr-xs shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              })
            )}

            {/* AI Real-time Thinking Animation */}
            {isAiActive && isAiLoading && (
              <div className="flex flex-col items-start animate-in fade-in">
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                  <span className="font-bold text-emerald-700 font-mono">🤖 Samadhan AI</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                    REASONING
                  </span>
                </div>
                <div className="bg-white border border-emerald-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-md shadow-emerald-500/10 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    Synthesizing official Jharkhand civic policies & guidelines...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ================================================================= */}
          {/* 3. BOTTOM FLOATING PROMPT INPUT & SUGGESTED PILLS                  */}
          {/* ================================================================= */}
          <div className="shrink-0 bg-white border-t border-slate-200/80">
            
            {/* Suggested Domain Pills Bar */}
            {isAiActive && (
              <SuggestedDomainsBar 
                onSelectPrompt={handleSelectSuggestedPrompt} 
                disabled={isAiLoading}
              />
            )}

            {/* Floating Command Input */}
            <form onSubmit={handleSend} className="p-3 sm:p-4">
              <div className="relative flex items-center bg-slate-50/90 border border-slate-200/90 rounded-2xl p-1.5 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 shadow-xs transition-all duration-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder={
                    isAiActive
                      ? "Ask Samadhan AI about public schemes, grievances, agriculture, electricity..."
                      : "Type a team message..."
                  }
                  disabled={isAiActive && isAiLoading}
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none border-none disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!newMsgText.trim() || (isAiActive && isAiLoading) || sending}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-brand-600/20 hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {isAiLoading || sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Disclaimer Subtext */}
              <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-slate-400 font-mono">
                <span>⚡ Powered by Google Gemini 2.5 Pro NLP Engine</span>
                <span className="hidden sm:inline">Press Enter to send</span>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
