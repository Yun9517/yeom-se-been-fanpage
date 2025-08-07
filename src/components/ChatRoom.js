import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Container, Form, Button, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner'; // Import LoadingSpinner
import useFirestoreCollection from '../hooks/useFirestoreCollection';
import { collection, addDoc, serverTimestamp, orderBy, limit, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ChatRoom.css';

const RETRACT_TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

const ChatRoom = () => {
  const { user, authLoading } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const [showInputPicker, setShowInputPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [activeReactionPickerId, setActiveReactionPickerId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const emojiPickerRef = useRef(null); // Ref for emoji picker container
  const reactionToggleButtonRef = useRef(null); // Ref for the reaction toggle button

  const commonEmojis = ['👍', '😲', '🥺'];

  const messagesQueryConstraints = useMemo(() => [orderBy('createdAt', 'desc'), limit(100)], []);
  const { data: messages, loading, error } = useFirestoreCollection('messages', messagesQueryConstraints, true);

  const sortedMessages = useMemo(() => messages.slice().reverse(), [messages]);

  const onInputEmojiClick = (emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sortedMessages]);

  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [loading]);

  // Effect to handle click outside for closing emoji picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
          reactionToggleButtonRef.current && !reactionToggleButtonRef.current.contains(event.target)) {
        setActiveReactionPickerId(null);
      }
    }

    if (activeReactionPickerId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeReactionPickerId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || '匿名用戶',
        isRetracted: false,
        reactions: {}, // Ensure reactions field is created
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleRetractMessage = async (messageId) => {
    const messageRef = doc(db, 'messages', messageId);
    try {
      await updateDoc(messageRef, { isRetracted: true });
    } catch (err) {
      console.error("Error retracting message:", err);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    if (!user) return;
    const messageRef = doc(db, 'messages', messageId);

    try {
      const docSnap = await getDoc(messageRef);
      if (docSnap.exists()) {
        const messageData = docSnap.data();
        const reactions = messageData.reactions || {};
        const reactionUsers = reactions[emoji] || [];

        if (reactionUsers.includes(user.uid)) {
          reactions[emoji] = reactionUsers.filter(id => id !== user.uid);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          reactions[emoji] = [...reactionUsers, user.uid];
        }

        await updateDoc(messageRef, { reactions });
      }
    } catch (err) {
      console.error("Error handling reaction:", err);
    }
    setActiveReactionPickerId(null);
  };

  if (authLoading) {
    return (
      <Container className="mt-5 text-center">
        <LoadingSpinner />
        <p className="mt-3">載入使用者狀態...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">請先登入才能使用聊天室。</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 chat-container">
      <h2 className="mb-4">粉絲聊天室</h2>
      <div className="messages-area" ref={messagesAreaRef}>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">無法載入訊息：{error.message}</Alert>}
        <ListGroup>
          {sortedMessages.map((msg) => (
            <ListGroup.Item
              key={msg.id}
              className={`message-item ${msg.userId === user.uid ? 'sent' : 'received'}`}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className="message-content">
                {msg.isRetracted ? (
                  <em className="retracted-message">訊息已收回</em>
                ) : (
                  <>
                    <strong className="message-user">{msg.userName}</strong>
                    <div className="message-text">{msg.text}</div>
                    <small className="message-time">
                      {msg.createdAt?.toDate().toLocaleTimeString()}
                    </small>
                    
                    <div className={`message-toolbar ${msg.userId === user.uid ? 'sent' : 'received'}`}>
                      {(hoveredMessageId === msg.id || activeReactionPickerId === msg.id) && (
                        <>
                          <Button variant="link" className="reaction-button" onClick={() => setActiveReactionPickerId(activeReactionPickerId === msg.id ? null : msg.id)} ref={reactionToggleButtonRef}>...</Button>
                          {msg.userId === user.uid && (Date.now() - msg.createdAt?.toDate().getTime() < RETRACT_TIME_LIMIT) && (
                            <Button variant="link" className="retract-button" onClick={() => handleRetractMessage(msg.id)}>收回</Button>
                          )}
                        </>
                      )}
                    </div>

                    {hoveredMessageId === msg.id && (
                      <div className={`quick-reactions-container ${msg.userId === user.uid ? 'sent' : 'received'}`}>
                        {commonEmojis.map(emoji => (
                          <Button 
                            key={emoji} 
                            variant="link" 
                            className="quick-reaction-button"
                            onClick={() => handleReaction(msg.id, emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    )}

                    {activeReactionPickerId === msg.id && (
                      <div className={`picker-container-absolute ${msg.userId === user.uid ? 'sent-picker' : 'received-picker'}`} ref={emojiPickerRef}> {/* Add ref here */}
                        <EmojiPicker 
                          onEmojiClick={(e) => handleReaction(msg.id, e.emoji)}
                          pickerStyle={msg.userId === user.uid ? { right: '0px' } : { left: '0px' }}
                        />
                      </div>
                    )}

                    <div className="reactions-display">
                      {Object.entries(msg.reactions || {}).map(([emoji, users]) => (
                        users.length > 0 && (
                          <Badge 
                            key={emoji} 
                            pill 
                            bg={users.includes(user.uid) ? "primary" : "secondary"}
                            className="reaction-badge"
                            onClick={() => handleReaction(msg.id, emoji)}
                          >
                            {emoji} {users.length}
                          </Badge>
                        )
                      ))}
                    </div>
                  </>
                )}
              </div>
            </ListGroup.Item>
          ))}
          <div ref={messagesEndRef} />
        </ListGroup>
      </div>
      <div className="input-picker-container">
        {showInputPicker && (
          <>
            <EmojiPicker onEmojiClick={onInputEmojiClick} />
            <Button variant="secondary" onClick={() => setShowInputPicker(false)} className="mt-2 emoji-close-button">
              <IoClose />
            </Button>
          </>
        )}
      </div>
      <Form onSubmit={handleSendMessage} className="message-form">
        <Form.Control
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="輸入訊息..."
          autoComplete="off"
        />
        <Button variant="light" onClick={() => setShowInputPicker(val => !val)} className="emoji-button">😊</Button>
        <Button variant="primary" type="submit" className="btn-theme-gradient">
          傳送
        </Button>
      </Form>
    </Container>
  );
};

export default ChatRoom;
