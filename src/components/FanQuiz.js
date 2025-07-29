import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiRefreshCcw, FiLink } from 'react-icons/fi';
import { FaLine } from 'react-icons/fa';
import { Spinner, Alert, Accordion } from 'react-bootstrap'; // Import Accordion
import './FanQuiz.css';

import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import Leaderboard from './Leaderboard';

// Helper function to get random questions
const getRandomQuestions = (allQuestions, num = 5) => {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

function FanQuiz() {
  const [masterQuestions, setMasterQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const fetchedQuestions = querySnapshot.docs.map(doc => doc.data());
        setMasterQuestions(fetchedQuestions);
        setQuestions(getRandomQuestions(fetchedQuestions));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions from Firestore:", err);
        setError("無法載入題目，請稍後再試。");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const saveScore = async () => {
      if (showScore && user && !user.isAnonymous) { // Only save score if user is logged in and not anonymous
        try {
          await addDoc(collection(db, "scores"), {
            userName: user.displayName,
            userId: user.uid,
            score: score,
            userAnswers: userAnswers, // Add userAnswers here
            createdAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    };

    saveScore();
  }, [showScore, user, score, userAnswers]);

  const handleAnswerOptionClick = (selectedOption) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedOption === currentQ.answer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers(prevAnswers => [
      ...prevAnswers,
      {
        question: currentQ.question,
        correctAnswer: currentQ.answer,
        userAnswer: selectedOption,
        isCorrect: isCorrect,
      },
    ]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
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
      <div className="fan-quiz-container">
        <h2>염세빈 粉絲小遊戲！</h2>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
            <p className="text-white-50 mt-2">載入中...</p>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          showScore ? (
            <div className="score-section">
              <div className="score-text">你獲得了 {score} 分，總分 {questions.length} 分！</div>
              {user && user.isAnonymous && (
                <Alert variant="info" className="mt-3" style={{ fontSize: '0.85em' }}>您的作答結果不會進入排行榜。如需記錄分數，請使用 Google 帳戶登入。</Alert>
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
                    <button key={`${currentQuestion}-${index}`} onClick={() => handleAnswerOptionClick(option)}>
                      {option}
                    </button>
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