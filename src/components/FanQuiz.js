import React, { useState } from 'react';
import { FiRefreshCcw, FiLink } from 'react-icons/fi';
import { FaLine } from 'react-icons/fa';
import './FanQuiz.css';

const questions = [
  {
    question: '廉世彬是哪一年出道的？',
    options: ['2020', '2021', '2022', '2023'],
    answer: '2022',
  },
  {
    question: '廉世彬的MBTI是?',
    options: ['INFJ', 'ENFJ', 'ENTP', 'ISTP'],
    answer: 'ISTP',
  },
  {
    question: '有歌手夢的廉世彬，當歌手的藝名是甚麼?',
    options: ['Snoopy', 'Snooze', '女王阿彬', 'LISA'],
    answer: 'Snooze',
  },
  {
    question: '廉世彬第一支加入的"棒球"啦啦隊是哪一支球隊?',
    options: ['樂天巨人', 'NC恐龍', '起亞虎', '韓華鷹'],
    answer: '起亞虎',
  },
  {
    question: '廉世彬個人單曲Cherry Blooming，是在哪一天發布的?',
    options: ['2025年6月16日(GMT+8)', '2025年6月18日(GMT+8)', '2025年5月16日(GMT+8)', '2025年5月18日(GMT+8)'],
    answer: '2025年6月16日(GMT+8)',
  },
];

function FanQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

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
    const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(lineShareUrl, '_blank');
  };

  return (
    <div className="fan-quiz-container">
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
