import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage } from '../services/dataService';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { 
  MessageSquare, 
  Send, 
  Users, 
  User, 
  Search, 
  Building2, 
  ShieldCheck, 
  Paperclip, 
  Sparkles,
  Clock
} from 'lucide-react';

export const MessagingPage = () => {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const loadConvs = async () => {
    try {
      const data = await getConversations(profile?.id);
      setConversations(data);
      if (data.length > 0 && !activeConvId) {
        setActiveConvId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCurrentMessages = async (convId) => {
    if (!convId) return;
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
    if (activeConvId) {
      loadCurrentMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsgText.trim() || !activeConvId) return;
    setSending(true);
    try {
      await sendMessage(activeConvId, profile, newMsgText);
      setNewMsgText('');
      await loadCurrentMessages(activeConvId);
      await loadConvs();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px] max-h-[750px]">
        {/* Left Conversation List Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
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
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-white border-l-4 border-l-brand-600 shadow-xs' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-400 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {conv.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                        {conv.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{conv.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {/* Chat Header */}
          {activeConv ? (
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  {activeConv.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeConv.title}</h3>
                  <p className="text-xs text-slate-400">{activeConv.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-medium text-slate-500">Live Secure Channel</span>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 text-slate-400 text-sm">Select a conversation</div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((m) => {
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
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message to project members, mentors, or CSR leaders..."
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              icon={Send}
              isLoading={sending}
              disabled={!newMsgText.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
