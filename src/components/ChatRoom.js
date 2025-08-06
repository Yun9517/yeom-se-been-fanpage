import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Container, Form, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '../context/UserContext';
import useFirestoreCollection from '../hooks/useFirestoreCollection';
import { collection, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import './ChatRoom.css';

const ChatRoom = () => {
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null); // Ref for the messages container

  const messagesQueryConstraints = useMemo(() => [orderBy('createdAt'), limit(100)], []);
  const { data: messages, loading, error } = useFirestoreCollection('messages', messagesQueryConstraints, true);

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to scroll the message area to the top on initial load
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = 0;
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || '匿名用戶',
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

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
          {messages.map((msg) => (
            <ListGroup.Item
              key={msg.id}
              className={`message-item ${msg.userId === user.uid ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <strong className="message-user">{msg.userName}</strong>
                <div className="message-text">{msg.text}</div>
                <small className="message-time">
                  {msg.createdAt?.toDate().toLocaleTimeString()}
                </small>
              </div>
            </ListGroup.Item>
          ))}
          <div ref={messagesEndRef} />
        </ListGroup>
      </div>
      <div className="picker-container">
        {showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>
      <Form onSubmit={handleSendMessage} className="message-form">
        <Form.Control
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="輸入訊息..."
          autoComplete="off"
        />
        <Button variant="light" onClick={() => setShowPicker(val => !val)} className="emoji-button">😊</Button>
        <Button variant="primary" type="submit" className="btn-theme-gradient">
          傳送
        </Button>
      </Form>
    </Container>
  );
};

export default ChatRoom;
