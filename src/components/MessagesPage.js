import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MessagesPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5003/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load conversations');
      }
      setLoading(false);
    };
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5003/api/messages/conversation/${selectedConversation._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load messages');
      }
      setLoading(false);
    };
    fetchMessages();
  }, [selectedConversation]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5003/api/messages', {
        receiverId: selectedConversation._id,
        content: messageInput
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessageInput('');
      // Refresh messages after sending
      const res = await axios.get(`http://localhost:5003/api/messages/conversation/${selectedConversation._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      setError('');
    } catch (err) {
      setError('Failed to send message');
    }
    setLoading(false);
  };


  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Messages', path: '/MessagesPage'}
  ];
  
  const userNavItems = [
    { name: 'My Work', path: '/AssignedTask' },
    { name: 'My Team'}
  ];
  
  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="nav-section left">
          <img 
            src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} 
            alt="CITADA Logo" 
            className="nav-logo"
          />
          {mainNavItems.map(item => (
            <button
              key={item.name}
              className={`nav-btn ${activeNav === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="nav-section right">
          {userNavItems.map(item => (
            <button
              key={item.name}
              className="nav-btn"
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          <div className="user-profile">A</div>
        </div>
      </nav>

       <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <div className="welcome-section">
              <h1 className="welcome-text">Welcome,</h1>
              <div className="username">Alex</div>
            </div>
            <div className="action-btns">
              <button onClick={() => navigate('/EditProfile')} className="primary-btn">Edit Profile</button>
            </div>
          </div>
        </header>
      </main>

      <h2 className="section-title">My Messages</h2>
      <div className="container">
        {/* Sidebar for Conversations */}
        <div className="sidebar">
          {loading && <div style={{ color: '#441752', padding: '1rem' }}>Loading...</div>}
          {error && <div style={{ color: 'red', padding: '1rem' }}>{error}</div>}
          {conversations.map(conv => (
            <div
              key={conv._id}
              className="event"
              style={{ background: selectedConversation && selectedConversation._id === conv._id ? '#fff' : undefined, color: selectedConversation && selectedConversation._id === conv._id ? '#441752' : undefined, cursor: 'pointer' }}
              onClick={() => setSelectedConversation(conv)}
            >
              {conv.name || conv.username || conv.email || conv._id}
            </div>
          ))}
          {conversations.length === 0 && !loading && <div style={{ color: '#441752', padding: '1rem' }}>No conversations</div>}
        </div>

        {/* Chat Container */}
        <div className="chat-box">
          {/* Supplier Name */}
          <div className="supplier-name">
            {selectedConversation ? (selectedConversation.name || selectedConversation.username || selectedConversation.email || selectedConversation._id) : 'Select a conversation'}
          </div>
          {/* Chat Messages */}
          <div className="chat-messages">
            {loading && <div style={{ color: '#441752' }}>Loading...</div>}
            {messages.map(msg => (
              <div key={msg._id} style={{ marginBottom: '0.5rem', color: '#441752' }}>
                <strong>{msg.senderName || msg.sender || 'User'}:</strong> {msg.content}
              </div>
            ))}
            {messages.length === 0 && !loading && selectedConversation && <div style={{ color: '#441752' }}>No messages yet.</div>}
          </div>
          {/* Message Input */}
          <div className="message-input">
            <input
              type="text"
              placeholder="Message"
              className="message-field"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              disabled={!selectedConversation || loading}
            />
            <button className="send-button" onClick={handleSendMessage} disabled={!selectedConversation || loading}>Send</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-blue: #441752;
          --hover-blue: #441752;
          --light-bg: #A888B5;
          --text-dark: #1A1F36;
          --text-light: #441752;
          --border-color: #441752;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--light-bg);
          font-family: 'Inter', sans-serif;
        }

        /* Top Navigation Styles */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          height: 64px;
          background: #441752;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-logo {
          height: 28px;
          margin-right: 16px;
        }

        .nav-btn {
          padding: 8px 16px;
          border: none;
          background: none;
          color: #A888B5;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: #A888B5;
          color: #441752;
        }

        .nav-btn.active {
          color: #A888B5;
          background: #441752;
        }

        .user-profile {
          width: 32px;
          height: 32px;
          background: #A888B5;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* Main Content Styles */
        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .header-left {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .welcome-section {
          margin-bottom: 16px;
        }

        .welcome-text {
          font-size: 32px;
          color: #441752;
          margin: 0;
        }

        .username {
          font-size: 24px;
          color: #441752;
          font-weight: 500;
          margin-top: 4px;
        }

        .action-btns {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .primary-btn {
          padding: 10px 24px;
          background: var(--primary-blue);
          color: #A888B5;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn:hover {
          background: var(--hover-blue);
          transform: translateY(-1px);
        }

        .section-title {
          font-size: 24px;
          color: #441752;
          margin-left: 40px;
        }
        
        .container {
display: flex;
          height: 100vh;
          background-color: #A888B5;
          font-family: 'Inter', sans-serif;
        }

    .sidebar {
          width: 20%;
          display: flex;
          flex-direction: column;
          border-right: 2px solid #441752;
          background-color: #A888B5;
          padding: 8px;
        }

        .event {
          padding: 16px;
          font-weight: bold;
          border-bottom: 2px solid  #441752;
          background-color: #A888B5;
          color:  #441752;
        }

        .chat-box {
          display: flex;
          flex-direction: column;
          width: 80%;
          background-color: #A888B5;
        }

        .supplier-name {
          padding: 12px;
          font-weight: bold;
          border-bottom: 2px solid  #441752;
          background-color: #A888B5;
          color:  #441752;
        }

        .chat-messages {
          flex-grow: 1;
          padding: 16px;
        }

        .message-input {
          display: flex;
          border-top: 2px solid  #441752;
          padding: 8px;
          background-color: #A888B5;
        }

        .message-field {
          flex-grow: 1;
          padding: 8px;
          border: 2px solid  #441752;
          background-color: #A888B5;
        }

        .send-button {
          background-color:  #441752;
          color: #A888B5;
          padding: 8px 16px;
          margin-left: 8px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;
