import React, { useState, useEffect } from 'react';
import './BinTalk.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const BinTalk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [genAI, setGenAI] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    console.log("Gemini API Key:", apiKey); // Debugging line to check if the key is loaded
    if (apiKey) {
      const ai = new GoogleGenerativeAI(apiKey);
      setGenAI(ai);
    } else {
      console.error("Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env.local file.");
    }
  }, []);

  const handleSend = async () => {
    if (input.trim() === '' || !genAI) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
      const prompt = `你是一位熱情且樂於助人的助理，也是啦啦隊員廉世彬（廉世彬）的超級粉絲。你的目標是回答有關她的問題。如果問題與她無關，請禮貌地拒絕並將話題引導回廉世彬。問題：${input}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = { sender: 'bot', text };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = { sender: 'bot', text: '抱歉，我現在無法回答問題。請檢查 API 金鑰或稍後再試。' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    <div className="bintalk-container">
      <div className="bintalk-header">
        <h2>彬Talk</h2>
        <p>快來聊聊彬彬的大小事，粉絲限定話題等你來問！</p>
      </div>
      <div className="bintalk-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">回覆中請耐心等待...</div>}
      </div>
      <div className="bintalk-input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={genAI ? "輸入你想問的問題..." : "正在初始化，請稍候..."}
          disabled={isLoading || !genAI}
        />
        <button onClick={handleSend} disabled={isLoading || !genAI}>
          傳送
        </button>
      </div>
    </div>
  );
};

export default BinTalk;
