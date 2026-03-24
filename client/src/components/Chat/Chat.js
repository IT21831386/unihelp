import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Chat.css';

const BASE_URL = 'http://localhost:5000/conversations';

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchAndSelect = async () => {
      try {
        const res = await axios.get(BASE_URL);
        const convs = res.data.conversations;
        setConversations(convs);

        const params = new URLSearchParams(location.search);
        const convId = params.get('conv');

        if (convId) {
          const target = convs.find((c) => c._id === convId);
          if (target) {
            setSelected(target);
          } else {
            const res2 = await axios.get(`${BASE_URL}/${convId}`);
            setSelected(res2.data.conversation);
          }
        } else if (convs.length > 0) {
          setSelected(convs[0]);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchAndSelect();
  }, [location.search]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selected]);

  const fetchSelected = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`);
      setSelected(res.data.conversation);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? res.data.conversation : c))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectChat = (conv) => {
    setSelected(conv);
    fetchSelected(conv._id);
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selected) return;
    setSending(true);
    try {
      const res = await axios.post(`${BASE_URL}/${selected._id}/message`, {
        sender: 'seller',
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
      console.log(err);
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getLastMessage = (conv) => {
    if (!conv.messages || conv.messages.length === 0) return 'No messages yet';
    return conv.messages[conv.messages.length - 1].text;
  };

  const formatTime = (dateStr) => {
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
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="ch-page">

      <div className="ch-breadcrumb">
        <span onClick={() => navigate('/marketplace')}>Market Place</span>
        &nbsp;›&nbsp;
        <span onClick={() => navigate('/marketplace/sell')}>Sell Items</span>
        &nbsp;›&nbsp; Chats
      </div>

      <div className="ch-layout">

        <div className="ch-left">
          <div className="ch-left-head">
            <h2>Messages</h2>
            <div className="ch-search-wrap">
              <svg viewBox="0 0 24 24" className="ch-search-icon">
                <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                  fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
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
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`ch-list-item ${selected && selected._id === conv._id ? 'ch-list-item--active' : ''}`}
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
                    <div className="ch-item-buyer">{conv.buyerName}</div>
                    <div className="ch-item-name">{conv.itemName}</div>
                    <div className="ch-item-preview">{getLastMessage(conv)}</div>
                  </div>
                  <div className="ch-item-meta">
                    <div className="ch-item-time">
                      {conv.updatedAt ? formatTime(conv.updatedAt) : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="ch-right">
          {!selected ? (
            <div className="ch-no-chat">
              <div className="ch-no-chat-icon">💬</div>
              <p>Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              <div className="ch-right-head">
                <div className="ch-right-avatar">
                  {selected.buyerName?.charAt(0).toUpperCase()}
                </div>
                <div className="ch-right-info">
                  <div className="ch-right-name">{selected.buyerName}</div>
                  <div className="ch-right-sub">Buyer</div>
                </div>
                <div className="ch-item-chip">
                  {selected.itemPhoto && (
                    <img src={selected.itemPhoto} alt={selected.itemName} className="ch-chip-img" />
                  )}
                  <div className="ch-chip-info">
                    <div className="ch-chip-name">{selected.itemName}</div>
                  </div>
                </div>
              </div>

              <div className="ch-messages">
                {selected.messages && selected.messages.length === 0 ? (
                  <div className="ch-no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  selected.messages && selected.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`ch-msg-row ${msg.sender === 'seller' ? 'ch-msg-row--mine' : 'ch-msg-row--theirs'}`}
                    >
                      <div className="ch-msg-avatar">
                        {msg.sender === 'seller' ? 'Me' : selected.buyerName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={`ch-bubble ${msg.sender === 'seller' ? 'ch-bubble--mine' : 'ch-bubble--theirs'}`}>
                          {msg.text}
                        </div>
                        <div className={`ch-msg-time ${msg.sender === 'seller' ? 'ch-msg-time--right' : ''}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="ch-input-area">
                <input
                  type="text"
                  className="ch-input"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="ch-send-btn"
                  onClick={handleSend}
                  disabled={sending || !messageText.trim()}
                >
                  <svg viewBox="0 0 24 24" fill="white" width="17" height="17">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;