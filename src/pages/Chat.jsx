import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon, X, RefreshCw, MessageSquare, ExternalLink, Paperclip } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConvoId = searchParams.get('convo');

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [imageAttachment, setImageAttachment] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // Fetch all conversations on load
  const fetchConversations = async (autoSelectId = null) => {
    try {
      const res = await api.get('/chats/conversations');
      setConversations(res.data);
      
      const targetConvoId = autoSelectId || queryConvoId;
      if (targetConvoId) {
        const found = res.data.find(c => c.conversationId === targetConvoId);
        if (found) {
          setActiveConvo(found);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingConvos(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user, queryConvoId]);

  // Load messages whenever active conversation changes
  const fetchMessages = async () => {
    if (!activeConvo) return;
    try {
      const res = await api.get(`/chats/messages/${activeConvo.conversationId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    if (!activeConvo) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    fetchMessages().then(() => setLoadingMessages(false));

    // Poll for new messages every 4 seconds (simple live chat fallback)
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      fetchMessages();
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeConvo]);

  // Auto-scroll to bottom of messages list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle uploading and parsing image attachment
  const handleImageAttach = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Attachment too large. Max size 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageAttachment(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !imageAttachment) return;
    if (!activeConvo) return;

    setSending(true);
    try {
      const res = await api.post('/chats', {
        receiverId: activeConvo.otherUser._id,
        listingId: activeConvo.listing?._id,
        content: inputText,
        image: imageAttachment || undefined,
      });

      // Append locally
      setMessages((prev) => [...prev, res.data]);
      setInputText('');
      setImageAttachment('');
      
      // Update conversations list latest message preview
      fetchConversations(activeConvo.conversationId);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm h-[calc(100vh-12rem)] min-h-[500px] flex overflow-hidden animate-fade-in">
      
      {/* Left Conversations Sidebar Pane */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 shrink-0">
          <h2 className="font-extrabold text-text text-base">Conversations</h2>
        </div>

        {loadingConvos ? (
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="animate-spin text-primary" size={24} />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-textSubtle">
            <MessageSquare size={36} className="mb-2 text-slate-200" />
            <p className="text-xs font-bold">No active chats</p>
            <p className="text-[10px] mt-1">Browse campus listings and contact sellers to start a chat thread.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
            {conversations.map((convo) => {
              const isSelected = activeConvo?.conversationId === convo.conversationId;
              return (
                <button
                  key={convo.conversationId}
                  onClick={() => {
                    setActiveConvo(convo);
                    setSearchParams({ convo: convo.conversationId });
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                    isSelected
                      ? 'bg-primary/5 border border-primary/10 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {/* Avatar or Listing Image */}
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 relative overflow-hidden">
                    {convo.listing?.image ? (
                      <img src={convo.listing.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                        {convo.otherUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-text text-xs truncate">
                        {convo.otherUser.name}
                      </span>
                      <span className="text-[9px] text-textSubtle shrink-0">
                        {formatTime(convo.lastMessage.createdAt)}
                      </span>
                    </div>
                    {convo.listing && (
                      <span className="text-[10px] font-semibold text-primary block truncate mb-1">
                        {convo.listing.title}
                      </span>
                    )}
                    <p className="text-[11px] text-textMuted truncate">
                      {convo.lastMessage.sender._id === user._id ? 'You: ' : ''}
                      {convo.lastMessage.content || 'Sent an image'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Messages Area Pane */}
      <div className={`flex-1 flex flex-col min-w-0 ${!activeConvo ? 'hidden md:flex bg-slate-50/50' : 'bg-white'}`}>
        {activeConvo ? (
          <>
            {/* Active chat header */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                  {activeConvo.otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-xs truncate">{activeConvo.otherUser.name}</h3>
                  {activeConvo.listing && (
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-textMuted truncate mt-0.5">
                      <span>Inquiring: <strong className="text-primary">{activeConvo.listing.title}</strong> (₹{activeConvo.listing.price})</span>
                    </div>
                  )}
                </div>
              </div>

              {activeConvo.listing && (
                <button
                  onClick={() => navigate(`/item/${activeConvo.listing._id}`)}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  View Item <ExternalLink size={12} />
                </button>
              )}
            </div>

            {/* Messages List Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="animate-spin text-primary" size={24} />
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender._id === user._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                      <div className={`max-w-[70%] space-y-1`}>
                        {/* Message Bubble Container */}
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10'
                              : 'bg-white border border-slate-200/80 text-text rounded-tl-none shadow-sm shadow-slate-100'
                          }`}
                        >
                          {/* Shared Image attachment */}
                          {msg.image && (
                            <div className="rounded-lg overflow-hidden mb-2 max-w-xs border border-slate-200/30">
                              <img
                                src={msg.image}
                                alt="Shared attachment"
                                className="w-full object-cover max-h-60"
                                onClick={() => window.open(msg.image, '_blank')}
                              />
                            </div>
                          )}
                          {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                        </div>
                        {/* Timestamp */}
                        <p className={`text-[9px] text-textSubtle px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Image attachment preview popup (above input) */}
            {imageAttachment && (
              <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-4 shrink-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                  <img src={imageAttachment} alt="Attachment Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImageAttachment('')}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-0.5 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
                <span className="text-[10px] text-textMuted font-bold">Image attached. Press Send.</span>
              </div>
            )}

            {/* Message input area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex items-center gap-3 shrink-0 bg-white">
              {/* Paperclip File Upload */}
              <label className="p-2.5 text-textMuted hover:text-primary hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                <Paperclip size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageAttach}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
              />

              <button
                type="submit"
                disabled={sending || (!inputText.trim() && !imageAttachment)}
                className="btn btn-primary !p-2.5 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-textMuted bg-slate-50/50">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-primary shadow-sm mb-4">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-base font-bold text-text mb-1">Select a Thread</h3>
            <p className="text-xs max-w-xs leading-relaxed">
              Choose an active buyer/seller conversation from the sidebar menu to view chat messages.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
