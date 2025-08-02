import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, getDocs, limit, startAfter, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Container, Alert, Table, Accordion, Button, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import useFirestoreDocument from '../hooks/useFirestoreDocument';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './QuizHistory.css';

const QuizHistory = () => {
  const [user, authLoading] = useAuthState(auth);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true); // Separate loading for history data
  const [errorHistory, setErrorHistory] = useState(null); // Separate error for history data
  const [dateError, setDateError] = useState(''); // State for date validation error
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [lastVisible, setLastVisible] = useState(null);
  const [pageHistory, setPageHistory] = useState([null]);
  const [hasMore, setHasMore] = useState(false);
  const [customItemsPerPage, setCustomItemsPerPage] = useState('');

  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Fetch user achievements data using useFirestoreDocument
  const { data: userAchievementsData, loading: userAchievementsLoading, error: userAchievementsError } = useFirestoreDocument(
    "userAchievements",
    user ? user.uid : null
  );

  // Combine loading and error states for the component
  const loading = authLoading || userAchievementsLoading || loadingHistory;
  const error = userAchievementsError || errorHistory;

  useEffect(() => {
    if (user) {
      setCurrentPage(1);
      setLastVisible(null);
      setPageHistory([null]);
      setHasMore(false);
      setErrorHistory(null);
    } else {
      setHistory([]);
      setLoadingHistory(false);
      setErrorHistory("請先登入以查看遊戲紀錄。");
      setCurrentPage(1);
      setLastVisible(null);
      setPageHistory([null]);
      setHasMore(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (authLoading || userAchievementsLoading) return; // Wait for auth and user achievements to load
      if (!user) return;

      setLoadingHistory(true);
      console.log("QuizHistory: Starting to fetch quiz history for user:", user.uid);

      try {
        let baseQuery = collection(db, "scores");
        let q = query(baseQuery, where("userId", "==", user.uid));

        if (filterStartDate) {
          const startTimestamp = Timestamp.fromDate(new Date(filterStartDate + 'T00:00:00'));
          q = query(q, where("createdAt", ">=", startTimestamp));
        }
        if (filterEndDate) {
          const endTimestamp = Timestamp.fromDate(new Date(filterEndDate + 'T23:59:59'));
          q = query(q, where("createdAt", "<=", endTimestamp));
        }

        q = query(q, orderBy(sortField, sortOrder));

        if (pageHistory[currentPage - 1]) {
          q = query(q, startAfter(pageHistory[currentPage - 1]));
        }

        q = query(q, limit(itemsPerPage + 1));

        const querySnapshot = await getDocs(q);
        const fetchedHistory = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setHasMore(fetchedHistory.length > itemsPerPage);
        const currentItems = fetchedHistory.slice(0, itemsPerPage);
        setHistory(currentItems);
        setLastVisible(querySnapshot.docs[currentItems.length - 1]);
        console.log("QuizHistory: Game history fetched successfully.");

      } catch (err) {
        console.error("QuizHistory: Error fetching quiz history:", err);
        setErrorHistory("無法載入遊戲紀錄，請稍後再試。");
      } finally {
        setLoadingHistory(false);
        console.log("QuizHistory: Finished fetching game history.");
      }
    };

    fetchQuizHistory();

  }, [user, authLoading, userAchievementsLoading, sortField, sortOrder, currentPage, itemsPerPage, filterStartDate, filterEndDate, pageHistory]);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
      setPageHistory(prevHistory => [...prevHistory, lastVisible]);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      const newPageHistory = [...pageHistory];
      newPageHistory.pop();
      setPageHistory(newPageHistory);
      setLastVisible(newPageHistory[newPageHistory.length - 1]);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
    setLastVisible(null);
    setPageHistory([null]);
    setHasMore(false);
  };

  const handleFilter = () => {
    setDateError(''); // Clear previous errors

    if (!startDateInput && !endDateInput) {
      setDateError('請至少選擇一個開始或結束日期。');
      return;
    }

    if (startDateInput && endDateInput && new Date(startDateInput) > new Date(endDateInput)) {
      setDateError('開始日期不能晚於結束日期。');
      return;
    }

    setFilterStartDate(startDateInput);
    setFilterEndDate(endDateInput);
    setCurrentPage(1);
    setLastVisible(null);
    setPageHistory([null]);
    setHasMore(false);
  };

  const handleClearFilter = () => {
    setStartDateInput('');
    setEndDateInput('');
    setFilterStartDate('');
    setFilterEndDate('');
    setDateError(''); // Also clear date error
    setCurrentPage(1);
    setLastVisible(null);
    setPageHistory([null]);
    setHasMore(false);
  };

  const handleItemsPerPageChange = (num) => {
    setItemsPerPage(num);
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
      setDateError('請輸入有效的數字。');
    }
  };

  if (authLoading) {
    console.log("QuizHistory: Loading user authentication status...");
    return (
      <Container className="mt-5 text-center">
        <LoadingSpinner loading={true} />
      </Container>
    );
  }

  if (loading) {
    console.log("QuizHistory: Loading game history data...");
    return (
      <Container className="mt-5 text-center">
        <LoadingSpinner loading={true} />
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

  const totalGamesOverall = userAchievementsData.totalQuizSessions || 0;
  const highestScore = history.reduce((max, record) => Math.max(max, record.score), 0);
  const averageScore = history.length > 0 ? (history.reduce((sum, record) => sum + record.score, 0) / history.length).toFixed(2) : 0;

  return (
    <Container className="mt-5 leaderboard-container">
      <h2>我的遊戲紀錄</h2>
      {/* The main container with a unified background */}
      <div className="p-3 rounded mb-3" style={{ backgroundColor: '#343a40' }}>
        <Row className="align-items-center gy-3"> {/* gy-3 adds vertical gap on mobile */}
          {/* Left Column: Stats */}
          <Col md={6} style={{ color: '#e9ecef' }}>
            {/* Use a responsive grid for better alignment across all devices */}
            <Row>
              <Col xs={12}><p className="mb-1"><strong>總遊戲次數:</strong> {totalGamesOverall}</p></Col>
              <Col xs={12}><p className="mb-1"><strong>本頁遊戲次數:</strong> {history.length}</p></Col>
              <Col xs={12}><p className="mb-1"><strong>最高分數 (本頁):</strong> {highestScore}</p></Col>
              <Col xs={12}><p className="mb-0"><strong>平均分數 (本頁):</strong> {averageScore}</p></Col>
            </Row>
          </Col>

          {/* Right Column: Filters - now with a vertical layout */}
          <Col md={6} className="filter-controls">
            <div className="d-flex flex-column">
              {/* Items per page dropdown - full width */}
              <Dropdown className="w-100 mb-2">
                <Dropdown.Toggle variant="primary" id="dropdown-items-per-page" size="sm" className="w-100">
                  每頁顯示: {itemsPerPage}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="div" onClick={(e) => e.stopPropagation()}>
                    <InputGroup size="sm" className="p-2">
                      <Form.Control
                        type="number"
                        placeholder="自訂"
                        value={customItemsPerPage}
                        onChange={(e) => setCustomItemsPerPage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleCustomItemsPerPageSubmit();
                        }}
                      />
                      <Button variant="outline-secondary" onClick={handleCustomItemsPerPageSubmit}>
                        設定
                      </Button>
                    </InputGroup>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Date filters - each on its own line */}
              <InputGroup size="sm" className="mb-2">
                <InputGroup.Text>開始</InputGroup.Text>
                <Form.Control
                  type="date"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </InputGroup>
              <InputGroup size="sm" className="mb-2">
                <InputGroup.Text>結束</InputGroup.Text>
                <Form.Control
                  type="date"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </InputGroup>

              {/* Filter buttons - grouped on one line and aligned to the right */}
              <div className="d-flex justify-content-end">
                <Button onClick={handleFilter} className="me-2 btn-theme-gradient" size="sm">
                  篩選
                </Button>
                <Button variant="outline-secondary" onClick={handleClearFilter} size="sm">
                  清除
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {dateError && (
        <Alert variant="warning" onClose={() => setDateError('')} dismissible>
          {dateError}
        </Alert>
      )}
      {history.length === 0 && !loading ? (
        <Alert variant="info">您還沒有任何遊戲紀錄。</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive variant="dark" style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
            <thead>
              <tr>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer', width: '25%' }}>
                  日期 {sortField === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('score')} style={{ cursor: 'pointer', width: '20%' }}>
                  分數 {sortField === 'score' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{ width: '55%' }}>作答結果</th>
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