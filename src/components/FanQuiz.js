import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiRefreshCcw, FiLink } from 'react-icons/fi';
import { FaLine } from 'react-icons/fa';
import './FanQuiz.css';

import { masterQuestions, getRandomQuestions } from '../data/contentData';

function FanQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState(() => getRandomQuestions(masterQuestions));

  const handleAnswerOptionClick = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setQuestions(getRandomQuestions(masterQuestions)); // Get new random questions on reset
  };

  const generateShareContent = () => {
    const shareText = `我在 염세빈 粉絲小遊戲中獲得了 ${score} 分！快來挑戰看看你的分數！`;
    const shareUrl = window.location.origin + window.location.pathname; // Current page URL
    return { shareText, shareUrl };
  };

  const handleShareLink = () => {
    const { shareText, shareUrl } = generateShareContent();
    const fullShareLink = `${shareText} ${shareUrl}`;
    navigator.clipboard.writeText(fullShareLink).then(() => {
      alert('分享連結已複製到剪貼簿！');
    }).catch(err => {
      console.error('無法複製分享連結:', err);
      alert('複製分享連結失敗，請手動複製：' + fullShareLink);
    });
  };

  const handleShareLine = () => {
    const { shareText, shareUrl } = generateShareContent();
    const lineMessage = `${shareText} ${shareUrl}`;
    const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(lineMessage)}`;
    window.open(lineShareUrl, '_blank');
  };

  const quizUrl = window.location.origin + '/quiz';
      const imageUrl = `https://storage.googleapis.com/yeom-se-been-fanpage-assets/yeomsebeen_field.jpg`;

  return (
    <div className="fan-quiz-container">
      <Helmet>
        <title>염세빈 粉絲小遊戲！</title>
        <meta property="og:title" content="염세빈 粉絲小遊戲！" />
        <meta property="og:description" content="快來挑戰看看你對廉世彬的了解程度！" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={quizUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      <h2>염세빈 粉絲小遊戲！</h2>
      {showScore ? (
        <div className="score-section">
          <div className="score-text">你獲得了 {score} 分，總分 {questions.length} 分！</div>
          <div className="score-buttons">
            <button onClick={handleShareLink} className="quiz-button share-link-button"><FiLink /></button>
            <button onClick={resetQuiz} className="quiz-button play-again-button"><FiRefreshCcw /></button>
            <button onClick={handleShareLine} className="quiz-button share-line-button"><FaLine /></button>
          </div>
        </div>
      ) : (
        <div className="question-section">
          <div className="question-count">
            <span>問題 {currentQuestion + 1}</span>/{questions.length}
          </div>
          <div className="question-text">
            {questions[currentQuestion].question}
          </div>
          <div className="answer-section">
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerOptionClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FanQuiz;
