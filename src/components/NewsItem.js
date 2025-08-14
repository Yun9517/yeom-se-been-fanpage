// src/components/NewsItem.js
import React from 'react';

const NewsItem = ({ title, date, content }) => {
  return (
    // 使用 bg-light, border, rounded, p-3, mb-4, shadow-sm 來模擬您原來的CSS
    <div className="bg-light rounded-3 p-3 mb-4 shadow-sm text-dark h-100 border-start border-primary border-5">
      <h5 className="fw-bold">{title}</h5>
      <small className="text-muted">{new Date(date).toLocaleDateString()}</small>
      <p className="mt-2 mb-0">{content}</p>
    </div>
  );
};

export default NewsItem;

