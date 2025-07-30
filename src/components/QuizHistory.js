import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, getDocs, limit, startAfter, doc, getDoc as getSingleDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Container, Spinner, Alert, Table, Accordion, Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './QuizHistory.css';

const QuizHistory = () => {
  const [user, authLoading] = useAuthState(auth);
  const [history, setHistory] = useState([]);
  const [userAchievementsData, setUserAchievementsData] = useState({}); // New state for user achievements
  const [loading, setLoading] = useState(true); // For fetching quiz history data
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('createdAt'); // Default sort field
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page
  const [lastVisible, setLastVisible] = useState(null); // Last document of the current page
  const [pageHistory, setPageHistory] = useState([null]); // To store lastVisible for previous pages
  const [hasMore, setHasMore] = useState(false); // Indicates if there's a next page
  const [customItemsPerPage, setCustomItemsPerPage] = useState(''); // For custom input

  // Effect to reset pagination when user logs in/out
  useEffect(() => {
    if (user) {
      // User logged in or changed, reset pagination to first page
      setCurrentPage(1);
      setLastVisible(null);
      setPageHistory([null]);
      setHasMore(false);
      setError(null); // Clear any previous errors
    } else {
      // User logged out, clear history and reset states
      setHistory([]);
      setLoading(false); // Ensure loading is false when logged out
      setError("請先登入以查看遊戲紀錄。");
      setCurrentPage(1);
      setLastVisible(null);
      setPageHistory([null]);
      setHasMore(false);
    }
  }, [user]); // Only depends on user

  // Main effect to fetch quiz history
  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (authLoading) {
        // Still authenticating, don't fetch yet.
        return;
      }

      if (!user) {
        // User is not logged in (handled by the separate useEffect above), so just return.
        // The UI will show "請先登入..."
        return;
      }

      setLoading(true); // Start loading for data fetch

      try {
        // Fetch user achievements for total quizzes answered
        const userAchievementsRef = doc(db, "userAchievements", user.uid);
        const userAchievementsSnap = await getSingleDoc(userAchievementsRef);
        if (userAchievementsSnap.exists()) {
          setUserAchievementsData(userAchievementsSnap.data());
        } else {
          setUserAchievementsData({});
        }

        let q;
        if (pageHistory[currentPage - 1] === null) { // First page or going back to a page without a startAfter doc
          q = query(
            collection(db, "scores"),
            where("userId", "==", user.uid),
            orderBy(sortField, sortOrder),
            limit(itemsPerPage + 1) // Fetch one more to check if there's a next page
          );
        } else {
          // For subsequent pages, use startAfter
          q = query(
            collection(db, "scores"),
            where("userId", "==", user.uid),
            orderBy(sortField, sortOrder),
            startAfter(pageHistory[currentPage - 1]), // Start after the last document of the previous page
            limit(itemsPerPage + 1)
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedHistory = [];
        querySnapshot.forEach(doc => {
          fetchedHistory.push({ id: doc.id, ...doc.data() });
        });

        // Determine if there's a next page
        setHasMore(fetchedHistory.length > itemsPerPage);

        // Slice the array to get only the items for the current page
        const currentItems = fetchedHistory.slice(0, itemsPerPage);
        setHistory(currentItems);

        // Update lastVisible for pagination
        setLastVisible(querySnapshot.docs[currentItems.length - 1]);

      } catch (err) {
        console.error("Error fetching quiz history:", err);
        setError("無法載入遊戲紀錄，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();

  }, [user, authLoading, sortField, sortOrder, currentPage, itemsPerPage, pageHistory]);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
      setPageHistory(prevHistory => [...prevHistory, lastVisible]); // Store lastVisible for current page
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      const newPageHistory = [...pageHistory];
      newPageHistory.pop(); // Remove the current page's lastVisible
      setPageHistory(newPageHistory);
      setLastVisible(newPageHistory[newPageHistory.length - 1]); // Set lastVisible to the one for the previous page
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending when changing sort field
    }
    // Reset pagination when sort changes
    setCurrentPage(1);
    setLastVisible(null);
    setPageHistory([null]);
    setHasMore(false);
  };

  const handleItemsPerPageChange = (num) => {
    setItemsPerPage(num);
    // Reset pagination when items per page changes
    setCurrentPage(1);
    setLastVisible(null);
    setPageHistory([null]);
    setHasMore(false);
  };

  const handleCustomItemsPerPageSubmit = () => {
    const num = parseInt(customItemsPerPage, 10);
    if (num > 0) {
      handleItemsPerPageChange(num);
    } else {
      alert('請輸入有效的數字。');
    }
  };

  if (authLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-white-50 mt-2">載入使用者狀態...</p>
      </Container>
    );
  }

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
  const totalGamesOverall = userAchievementsData.totalQuizSessions || 0; // Use total quiz sessions from achievements
  const highestScore = history.reduce((max, record) => Math.max(max, record.score), 0);
  const averageScore = history.length > 0 ? (history.reduce((sum, record) => sum + record.score, 0) / history.length).toFixed(2) : 0;

  return (
    <Container className="mt-5 leaderboard-container">
      <h2>我的遊戲紀錄</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#343a40', color: '#e9ecef' }}>
          <p><strong>總遊戲次數:</strong> {totalGamesOverall}</p>
          <p><strong>本頁遊戲次數:</strong> {history.length}</p>
          <p><strong>最高分數 (本頁):</strong> {highestScore}</p>
          <p><strong>平均分數 (本頁):</strong> {averageScore}</p>
        </div>
        <Dropdown className="ms-auto">
          <Dropdown.Toggle variant="secondary" id="dropdown-items-per-page">
            每頁顯示: {itemsPerPage}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
            <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
            <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as="div" onClick={(e) => e.stopPropagation()}>
              <InputGroup className="p-2">
                <Form.Control
                  type="number"
                  placeholder="自訂"
                  value={customItemsPerPage}
                  onChange={(e) => setCustomItemsPerPage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomItemsPerPageSubmit();
                    }
                  }}
                />
                <Button variant="outline-secondary" onClick={handleCustomItemsPerPageSubmit}>
                  設定
                </Button>
              </InputGroup>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {history.length === 0 ? (
        <Alert variant="info">您還沒有任何遊戲紀錄。</Alert>
      ) : (
        <>
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
          <div className="d-flex justify-content-between mt-3">
            {currentPage > 1 && (
              <Button onClick={handlePreviousPage} disabled={loading} variant="secondary">
                上一頁
              </Button>
            )}
            {hasMore && (
              <Button onClick={handleNextPage} disabled={loading} variant="secondary" className="ms-auto">
                下一頁
              </Button>
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default QuizHistory;