import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import './ChatPage.css';

const ChatWindow = ({ messages, onSendMessage, isLoading, activeChatId, onToggleSidebar }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Clear input when starting a new chat
  useEffect(() => {
    if (!activeChatId) {
      setInput('');
    }
  }, [activeChatId]);

  const handleSend = () => {
    if (input.trim() === '') return;
    onSendMessage(input);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="chat-window-main">
       <div className="beentalk-header">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <h2>彬Talk</h2>
        <p>有想知道的都等你來問！</p>
      </div>
      <div className="beentalk-messages" ref={messagesEndRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">請稍等...</div>}
      </div>
      <div className="beentalk-input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={"輸入你想問的問題..."}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading} className="btn btn-theme-gradient">
          傳送
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
