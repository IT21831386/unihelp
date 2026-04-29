import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getCurrentUser } from '../../utils/user';
import './Chat.css';

const BASE_URL = 'http://localhost:5000/api/conversations';

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return (
      <div className="ch-loading">
        <p>Please log in to view your chats.</p>
        <button className="id-btn-chat" style={{marginTop: '10px'}} onClick={() => navigate('/login')}>Log In</button>
      </div>
    );
  }

  // Fetch all conversations for the user
  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}?userId=${currentUser.id}`);
      setConversations(res.data.conversations);
      return res.data.conversations;
    } catch (err) {
      console.error('Error fetching conversations:', err);
      return [];
    }
  };

  // Fetch a specific conversation details
  const fetchSelected = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`);
      setSelected(res.data.conversation);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? res.data.conversation : c))
      );
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const convs = await fetchConversations();
      
      const params = new URLSearchParams(location.search);
      const convId = params.get('conv');

      if (convId) {
        const target = convs.find((c) => c._id === convId);
        if (target) {
          setSelected(target);
          await fetchSelected(convId);
        } else {
          try {
            const res = await axios.get(`${BASE_URL}/${convId}`);
            setSelected(res.data.conversation);
          } catch (e) {}
        }
      } else if (convs.length > 0) {
        setSelected(convs[0]);
      }
      setLoading(false);
    };

    init();
  }, [location.search]);

  // Polling for new messages
  useEffect(() => {
    let interval;
    if (selected) {
      interval = setInterval(() => {
        fetchSelected(selected._id);
        fetchConversations();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selected?._id]);

  // Scroll to bottom whenever selected conversation changes or new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selected?.messages?.length]);

  const handleSelectChat = (conv) => {
    setSelected(conv);
    fetchSelected(conv._id);
    // Force immediate scroll
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selected || sending) return;
    
    setSending(true);
    // Determine my role in this specific conversation
    const amISeller = selected.sellerId === currentUser.id;
    const role = amISeller ? 'seller' : 'buyer';
    
    try {
      const res = await axios.post(`${BASE_URL}/${selected._id}/message`, {
        sender: role,
        text: messageText.trim(),
      });
      
      setSelected(res.data.conversation);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selected._id ? res.data.conversation : c
        )
      );
      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getLastMessage = (conv) => {
    if (!conv.messages || conv.messages.length === 0) return 'No messages yet';
    const last = conv.messages[conv.messages.length - 1];
    return last.text;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="ch-loading">
        <div className="ch-spinner" />
        <p>Loading your conversations...</p>
      </div>
    );
  }

  return (
    <div className="ch-page-wrapper">
      <Navbar />
      <div className="ch-page">
      <div className="ch-breadcrumb">
        <span onClick={() => navigate('/marketplace')}>Market Place</span>
        &nbsp;›&nbsp;
        <span onClick={() => navigate('/marketplace/buy')}>Buy Items</span>
        &nbsp;›&nbsp; Chats
      </div>

      <div className="ch-layout">
        <div className="ch-left">
          <div className="ch-left-head">
            <h2>Messages</h2>
            <div className="ch-search-wrap">
              <svg viewBox="0 0 24 24" className="ch-search-icon" fill="none" stroke="#bbb" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search chats..."
                className="ch-search-input"
              />
            </div>
          </div>

          <div className="ch-list">
            {conversations.length === 0 ? (
              <div className="ch-empty-list">
                <div className="ch-empty-icon">📭</div>
                <p>No conversations yet</p>
                <span>Items you express interest in will appear here.</span>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSeller = conv.sellerId === currentUser.id;
                const partnerName = isSeller ? conv.buyerName : conv.sellerName;
                const isActive = selected?._id === conv._id;

                return (
                  <div
                    key={conv._id}
                    className={`ch-list-item ${isActive ? 'ch-list-item--active' : ''}`}
                    onClick={() => handleSelectChat(conv)}
                  >
                    <div className="ch-item-thumb">
                      {conv.itemPhoto ? (
                        <img src={conv.itemPhoto} alt={conv.itemName} />
                      ) : (
                        <div className="ch-item-thumb-placeholder">
                          {conv.itemName?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="ch-item-info">
                      <div className="ch-item-buyer">{partnerName || 'Unknown User'}</div>
                      <div className="ch-item-name">{conv.itemName}</div>
                      <div className="ch-item-preview">{getLastMessage(conv)}</div>
                    </div>
                    <div className="ch-item-meta">
                      <div className="ch-item-time">
                        {conv.updatedAt ? formatTime(conv.updatedAt) : ''}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="ch-right">
          {!selected ? (
            <div className="ch-no-chat">
              <div className="ch-no-chat-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Pick a chat from the left to start messaging</p>
            </div>
          ) : (
            <>
              <div className="ch-right-head">
                <div className="ch-right-avatar">
                  {((selected.sellerId === currentUser.id ? selected.buyerName : selected.sellerName) || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="ch-right-info">
                  <div className="ch-right-name">
                    {selected.sellerId === currentUser.id ? selected.buyerName : selected.sellerName}
                  </div>
                  <div className="ch-right-sub">
                    {selected.sellerId === currentUser.id ? 'Buyer' : 'Seller'} • {selected.itemName}
                  </div>
                </div>
                <div className="ch-item-chip" onClick={() => navigate(`/marketplace/item/${selected.itemId}`)}>
                  {selected.itemPhoto && (
                    <img src={selected.itemPhoto} alt={selected.itemName} className="ch-chip-img" />
                  )}
                  <div className="ch-chip-info">
                    <div className="ch-chip-name">{selected.itemName}</div>
                    <div className="ch-chip-view">View Item</div>
                  </div>
                </div>
              </div>

              <div className="ch-messages">
                {selected.messages && selected.messages.length === 0 ? (
                  <div className="ch-no-messages">
                    <div className="ch-intro-box">
                      <p>This is the start of your conversation about <strong>{selected.itemName}</strong>.</p>
                      <span>Be polite and professional!</span>
                    </div>
                  </div>
                ) : (
                    selected.messages && selected.messages.map((msg, i) => {
                      const amISeller = selected.sellerId === currentUser.id;
                      const isMe = (amISeller && msg.sender === 'seller') || (!amISeller && msg.sender === 'buyer');
                      const partnerName = amISeller ? selected.buyerName : selected.sellerName;

                      return (
                        <div
                          key={i}
                          className={`ch-msg-row ${isMe ? 'ch-msg-row--mine' : 'ch-msg-row--theirs'}`}
                        >
                          {!isMe && (
                            <div className="ch-msg-avatar">
                              {partnerName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="ch-bubble-wrap">
                            <div className={`ch-bubble ${isMe ? 'ch-bubble--mine' : 'ch-bubble--theirs'}`}>
                              {msg.text}
                            </div>
                            <div className={`ch-msg-time ${isMe ? 'ch-msg-time--right' : ''}`}>
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="ch-input-wrap">
                <div className="ch-input-area">
                  <textarea
                    className="ch-input"
                    placeholder="Type a message..."
                    rows="1"
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                  />
                  <button
                    className="ch-send-btn"
                    onClick={handleSend}
                    disabled={sending || !messageText.trim()}
                  >
                    {sending ? (
                      <div className="ch-btn-spinner" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  </div>
  );
}

export default Chat;