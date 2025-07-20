// src/components/NewsItem.js
import React from 'react';
import './NewsItem.css';

function NewsItem({ date, title, content }) {
  return (
    <div className="news-item">
      <span className="news-date">{date}</span>
      <span className="news-title">{title}</span>
      <p className="news-content">{content}</p>
    </div>
  );
}

export default React.memo(NewsItem);
