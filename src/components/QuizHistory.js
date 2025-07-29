import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Container, Spinner, Alert, Table, Accordion } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './QuizHistory.css';

const QuizHistory = () => {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('createdAt'); // Default sort field
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order

  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (!user) {
        setLoading(false);
        setError("請先登入以查看遊戲紀錄。");
        return;
      }

      try {
        const q = query(
          collection(db, "scores"),
          where("userId", "==", user.uid),
          orderBy(sortField, sortOrder) // Use sortField and sortOrder
        );
        const querySnapshot = await getDocs(q);
        const fetchedHistory = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(fetchedHistory);
      } catch (err) {
        console.error("Error fetching quiz history:", err);
        setError("無法載入遊戲紀錄，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [user, sortField, sortOrder]); // Add sortField and sortOrder to dependencies

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending when changing sort field
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-white-50 mt-2">載入遊戲紀錄中...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="info">請登入以查看您的遊戲紀錄。</Alert>
      </Container>
    );
  }

  if (user.isAnonymous) {
    return (
      <Container className="mt-5">
        <Alert variant="info">您目前以訪客模式登入。如需查看並儲存遊戲紀錄，請使用 Google 帳戶登入。</Alert>
      </Container>
    );
  }

  // Calculate statistics
  const totalGames = history.length;
  const highestScore = history.reduce((max, record) => Math.max(max, record.score), 0);
  const averageScore = totalGames > 0 ? (history.reduce((sum, record) => sum + record.score, 0) / totalGames).toFixed(2) : 0;

  return (
    <Container className="mt-5 leaderboard-container">
      <h2>我的遊戲紀錄</h2>
      <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#343a40', color: '#e9ecef' }}>
        <p><strong>總遊戲次數:</strong> {totalGames}</p>
        <p><strong>最高分數:</strong> {highestScore}</p>
        <p><strong>平均分數:</strong> {averageScore}</p>
      </div>
      {history.length === 0 ? (
        <Alert variant="info">您還沒有任何遊戲紀錄。</Alert>
      ) : (
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                日期 {sortField === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('score')} style={{ cursor: 'pointer' }}>
                分數 {sortField === 'score' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>作答結果</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id}>
                <td>{record.createdAt?.toDate().toLocaleDateString()}</td>
                <td>{record.score}</td>
                <td>
                  <Accordion className="quiz-history-accordion">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>查看詳情</Accordion.Header>
                      <Accordion.Body>
                        {record.userAnswers && record.userAnswers.length > 0 ? (
                          record.userAnswers.map((answer, idx) => (
                            <div key={idx} className="mb-2 p-2 border rounded">
                              <p><strong>問題:</strong> {answer.question}</p>
                              <p><strong>你的答案:</strong> <span style={{ color: answer.isCorrect ? '#28a745' : '#dc3545' }}>
                                {answer.userAnswer} {answer.isCorrect ? <FaCheckCircle color="#28a745" /> : <FaTimesCircle color="#dc3545" />}
                              </span></p>
                              {!answer.isCorrect && (
                                <p><strong>正確答案:</strong> <span style={{ color: '#28a745' }}>{answer.correctAnswer}</span></p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>無詳細作答結果。</p>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default QuizHistory;
