import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useUser } from '../context/UserContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, getDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

import ChatHistorySidebar from './ChatHistorySidebar';
import ChatWindow from './ChatWindow';
import LoadingSpinner from './LoadingSpinner';
import useFirestoreDocument from '../hooks/useFirestoreDocument';

import './ChatPage.css';

const ChatPage = () => {
  const { user, authLoading } = useUser();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genAI, setGenAI] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { data: aboutContent, loading: aboutLoading, error: aboutError } = useFirestoreDocument('pages', 'about');

  // Initialize Gemini AI
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenerativeAI(apiKey);
      setGenAI(ai);
    }
  }, []);

  // Effect for logged-in user data
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setChats([]);
      setActiveChatId(null);
      setMessages([]); // Clear all data on logout or for anonymous user
      return;
    }

    // Fetch user's chat list
    const q = query(collection(db, 'users', user.uid, 'chats'), orderBy('createdAt', 'desc'));
    const unsubscribeChats = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
    });

    // Fetch messages for the active chat
    let unsubscribeMessages = () => {};
    if (activeChatId) {
      unsubscribeMessages = onSnapshot(doc(db, 'users', user.uid, 'chats', activeChatId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages || []);
        }
      });
    } else {
        setMessages([]); // Clear messages if no chat is active
    }

    return () => {
        unsubscribeChats();
        unsubscribeMessages();
    };
  }, [user, activeChatId]);


  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setSidebarOpen(false); // Close sidebar on selection
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setSidebarOpen(false); // Close sidebar on new chat
  };

  const handleDeleteChat = async (chatId) => {
    if (!user || user.isAnonymous || !chatId) return;
    if (window.confirm('您確定要刪除這段對話嗎？')) {
      await deleteDoc(doc(db, 'users', user.uid, 'chats', chatId));
      if (activeChatId === chatId) {
        handleNewChat();
      }
    }
  };

  const handleSendMessage = async (inputText) => {
    const isGuest = !user || user.isAnonymous;

    if (!genAI || (!isGuest && aboutLoading)) return;

    const userMessage = { sender: 'user', text: inputText };
    setIsLoading(true);
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let context = '';
    if (aboutContent) {
      context = `
以下是網站關於廉世彬的介紹內容，請參考這些資訊來回答問題：
${aboutContent.section2022Title}: ${aboutContent.section2022Content}
${aboutContent.section2023Title}: ${aboutContent.section2023Content}
${aboutContent.section2025Title}: ${aboutContent.section2025Content}
`;
    }

    const loginPromptSegment = isGuest 
      ? `在回答完問題後，請用友善且簡短的語氣，溫馨地提醒使用者「登入後就可以保存我們的對話紀錄喔！」，但如果使用者只是簡單問候(例如:你好)，則不需提醒。`
      : '';

    const prompt = `你是一位熱情且樂於助人的助理，也是啦啦隊員廉世彬（廉世彬）的超級粉絲。你的目標是精簡的回答有關她的問題。如果問題與她無關，請禮貌地拒絕並將話題引導回廉世彬。 ${loginPromptSegment}

${context}

問題：${inputText}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botText = response.text();
      const botMessage = { sender: 'bot', text: botText };
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);

      if (user && !user.isAnonymous) {
        let currentChatId = activeChatId;
        if (!currentChatId) {
          const firstTitle = inputText.substring(0, 20) + '...';
          const newChatRef = await addDoc(collection(db, 'users', user.uid, 'chats'), {
            title: firstTitle,
            createdAt: serverTimestamp(),
            messages: finalMessages,
          });
          setActiveChatId(newChatRef.id);
        } else {
          const chatRef = doc(db, 'users', user.uid, 'chats', currentChatId);
          await updateDoc(chatRef, { messages: finalMessages });
        }
      }

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      let botMessageText = '哎呀！彬Talk 目前有點忙碌，就像廉世彬在場上一樣分身乏術！這是個暫時的狀況，請稍後再試一次。';
      if (error.message && error.message.includes('[503]')) {
          botMessageText = '哎呀！彬Talk 目前有點忙碌，就像廉世彬在場上一樣分身乏術！這是個暫時的狀況，請稍後再試一次。';
      }
      const errorMessage = { sender: 'bot', text: botMessageText };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);

      // Also save the error message to history for logged-in users
      if (user && !user.isAnonymous && activeChatId) {
          const chatRef = doc(db, 'users', user.uid, 'chats', activeChatId);
          await updateDoc(chatRef, { messages: finalMessages });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner loading={true} />;
  }

  if (user && !user.isAnonymous) {
    // Logged-in user UI
    return (
      <div className="chat-page-container">
        <div className={`page-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
        <ChatHistorySidebar 
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isOpen={isSidebarOpen}
        />
        <ChatWindow 
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          activeChatId={activeChatId}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
      </div>
    );
  } else {
    // Guest & Anonymous User UI
    return (
        <div className="chat-page-container guest-mode">
            <ChatWindow 
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                activeChatId={null}
                onToggleSidebar={() => {}}
            />
        </div>
    );
  }
};

export default ChatPage;