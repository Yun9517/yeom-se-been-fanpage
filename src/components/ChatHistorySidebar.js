import React from 'react';
import { FaTrash } from 'react-icons/fa';

const ChatHistorySidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, isOpen }) => {
  return (
    <div className={`chat-history-sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={onNewChat} className="new-chat-btn">
        + 新增對話
      </button>
      <ul className="chat-history-list">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <span className="chat-item-title" title={chat.title}>{chat.title}</span>
            <button 
              className="delete-chat-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent li's onClick from firing
                onDeleteChat(chat.id);
              }}
              title="刪除對話"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistorySidebar;
