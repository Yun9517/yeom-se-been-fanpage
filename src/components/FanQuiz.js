import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiRefreshCcw, FiLink } from 'react-icons/fi';
import { FaLine } from 'react-icons/fa';
import { Alert, Accordion, Toast, ToastContainer, Button } from 'react-bootstrap';
import './FanQuiz.css';

import { useUser } from '../context/UserContext'; // Import the useUser hook

import Leaderboard from './Leaderboard';
import LoadingSpinner from './LoadingSpinner';
import useFirestoreCollection from '../hooks/useFirestoreCollection';

// Helper function to get random questions
const getRandomQuestions = (allQuestions, num = 5) => {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

function FanQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const { user, processQuizResults } = useUser(); // Use the context
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const quizQueryConstraints = useMemo(() => [], []);
  const { data: masterQuestions, loading, error } = useFirestoreCollection('quizzes', quizQueryConstraints);

  useEffect(() => {
    if (!loading && !error && masterQuestions.length > 0) {
      setQuestions(getRandomQuestions(masterQuestions));
    }
  }, [masterQuestions, loading, error]);

  const showAchievementToast = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleAnswerOptionClick = async (selectedOption) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedOption === currentQ.answer;

    if (isCorrect) {
      setScore(score + 1);
    }

    const newUserAnswers = [
      ...userAnswers,
      {
        question: currentQ.question,
        correctAnswer: currentQ.answer,
        userAnswer: selectedOption,
        isCorrect: isCorrect,
      },
    ];
    setUserAnswers(newUserAnswers);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      if (user && !user.isAnonymous) {
        const finalScore = isCorrect ? score + 1 : score;
        const unlockedAchievements = await processQuizResults({
          score: finalScore,
          questions,
          userAnswers: newUserAnswers,
        });

        // Show toasts for any unlocked achievements
        unlockedAchievements.forEach(ach => {
          showAchievementToast(`恭喜！您解鎖了 [${ach.name}] 成就！獲得 ${ach.points} 點！`);
        });
      }
    }
  };

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setQuestions(getRandomQuestions(masterQuestions));
    setUserAnswers([]);
  }, [masterQuestions]);

  const generateShareContent = () => {
    const shareText = `我在 염세빈 粉絲小遊戲中獲得了 ${score} 分！快來挑戰看看你的分數！`;
    const shareUrl = window.location.href;
    return { shareText, shareUrl };
  };

  const handleShareLink = () => {
    const { shareText, shareUrl } = generateShareContent();
    const fullShareLink = `${shareText} ${shareUrl}`;
    navigator.clipboard.writeText(fullShareLink).then(() => {
      alert('分享連結已複製到剪貼簿！');
    }).catch(err => {
      console.error('無法複製分享連結:', err);
    });
  };

  const handleShareLine = () => {
    const { shareText, shareUrl } = generateShareContent();
    const lineMessage = `${shareText} ${shareUrl}`;
    const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(lineMessage)}`;
    window.open(lineShareUrl, '_blank');
  };

  const ogImageUrl = `yeomsebeen_field.jpg`;

  return (
    <>
      <Helmet>
        <title>염세빈 粉絲小遊戲！</title>
        <meta property="og:title" content="염세빈 粉絲小遊戲！" />
        <meta property="og:description" content="快來挑戰看看你對廉世彬的了解程度！" />
        <meta property="og:image" content={`https://storage.googleapis.com/yeom-se-been-fanpage-assets/${ogImageUrl}`} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`https://storage.googleapis.com/yeom-se-been-fanpage-assets/${ogImageUrl}`} />
      </Helmet>
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} bg={toastVariant}>
          <Toast.Header>
            <strong className="me-auto">成就解鎖！</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="fan-quiz-container">
        <h2>염세彬 粉絲小遊戲！</h2>

        {loading && <LoadingSpinner loading={loading} />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          showScore ? (
            <div className="score-section">
              <div className="score-text">你獲得了 {score} 分，總分 {questions.length} 分！</div>
              {(!user || user.isAnonymous) && (
                <Alert variant="info" className="mt-3" style={{ fontSize: '0.65em' }}>您的作答結果不會進入排行榜。如需記錄分數，請使用 Google 帳戶登入。</Alert>
              )}
              <div className="score-buttons">
                <button onClick={handleShareLink} className="quiz-button share-link-button"><FiLink /></button>
                <button onClick={resetQuiz} className="quiz-button play-again-button"><FiRefreshCcw /></button>
                <button onClick={handleShareLine} className="quiz-button share-line-button"><FaLine /></button>
              </div>

              <div className="quiz-answers-summary mt-4">
                <h3>作答結果</h3>
                {userAnswers.map((item, index) => (
                  <div key={index} className="answer-item mb-3 p-3 border rounded">
                    <p><strong>問題 {index + 1}:</strong> {item.question}</p>
                    <p><strong>你的答案:</strong> <span style={{ color: item.isCorrect ? '#28a745' : '#dc3545' }}>{item.userAnswer}</span></p>
                    {!item.isCorrect && (
                      <p><strong>正確答案:</strong> <span style={{ color: '#28a745' }}>{item.correctAnswer}</span></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            questions.length > 0 && (
              <div className="question-section">
                <div className="question-count">
                  <span>問題 {currentQuestion + 1}</span>/{questions.length}
                </div>
                <div className="question-text">
                  {questions[currentQuestion]?.question}
                </div>
                <div className="answer-section">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <Button
                    key={index}
                    onClick={() => handleAnswerOptionClick(option)}
                    className="answer-btn btn-theme-gradient w-100 mb-2"
                    disabled={showScore} // Use showScore to disable button after quiz ends
                  >
                    {option}
                  </Button>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>

      <div className="leaderboard-section mt-5">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>排行榜</Accordion.Header>
            <Accordion.Body>
              <Leaderboard />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default FanQuiz;