import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import './BeenTalk.css'; // Corrected import
import { GoogleGenerativeAI } from '@google/generative-ai';
import useFirestoreDocument from '../hooks/useFirestoreDocument';

const BeenTalk = () => { // Corrected component name
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [genAI, setGenAI] = useState(null);
  const { data: aboutContent, loading: aboutLoading, error: aboutError } = useFirestoreDocument('pages', 'about');
  const messagesEndRef = useRef(null); // Created ref

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (apiKey && !aboutLoading && !aboutError) {
      const ai = new GoogleGenerativeAI(apiKey);
      setGenAI(ai);
    } else if (aboutError) {
      console.error("Error loading about content:", aboutError);
    }
  }, [aboutLoading, aboutError]);

  // New useEffect for auto-scrolling
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]); // Dependency on messages array

  const handleSend = async () => {
    if (input.trim() === '' || !genAI || aboutLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
      let context = '';
      if (aboutContent) {
        context = `
以下是網站關於廉世彬的介紹內容，請參考這些資訊來回答問題：
${aboutContent.section2022Title}: ${aboutContent.section2022Content}
${aboutContent.section2023Title}: ${aboutContent.section2023Content}
${aboutContent.section2025Title}: ${aboutContent.section2025Content}
`;
      }

      const prompt = `你是一位熱情且樂於助人的助理，也是啦啦隊員廉世彬（廉世彬）的超級粉絲。你的目標是精簡的回答有關她的問題。如果問題與她無關，請禮貌地拒絕並將話題引導回廉世彬。

${context}

以下是廉世彬的生涯經歷資訊：
基本資料：
出生: 2002年4月23日, 韓國首爾
學歷: 白石藝術大學 實用音樂系
出道日期: 2022年

啦啦隊經歷：
2022年: KEPCO Vixtorm Volleyball Team, Hana Bank Women's Basketball Team
2023年: 起亞虎, 高陽索諾天空槍手
2024年: 起亞虎, 安養正官庄赤紅火箭
2025年: 樂天桃猿, NC恐龍

音樂作品：
2024年: Snooze - 새벽감성
2025年: Snooze - Cherry Blooming

問題：${input}`;
      
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
    <div className="beentalk-container">
      <div className="beentalk-header">
        <h2>彬Talk</h2>
        <p>有想知道的都等你來問！</p>
      </div>
      <div className="beentalk-messages" ref={messagesEndRef}> {/* Added ref */}
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
          placeholder={genAI ? (aboutLoading ? "正在載入網站介紹內容..." : "輸入你想問的問題...") : "正在初始化，請稍候..."}
          disabled={isLoading || !genAI || aboutLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !genAI || aboutLoading}>
          傳送
        </button>
      </div>
    </div>
  );
};

export default BeenTalk;