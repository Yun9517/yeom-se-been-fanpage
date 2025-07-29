import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Table, Button, Form } from 'react-bootstrap';
import { FaTrophy } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Leaderboard.css';

const Leaderboard = () => {
  const [allScores, setAllScores] = useState([]); // Stores all scores fetched
  const [scores, setScores] = useState([]); // Scores for current page
  // eslint-disable-next-line no-unused-vars
  const [currentUser] = useAuthState(auth);
  const [loading, setLoading] = useState(true); // Loading state
  const [pageSize, setPageSize] = useState(10); // User customizable page size
  const [currentPage, setCurrentPage] = useState(1); // Current page number

  useEffect(() => {
    setLoading(true);
    const scoresCollection = collection(db, 'scores');
    const q = query(scoresCollection, orderBy('score', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedScores = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllScores(fetchedScores);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching scores:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Update scores for current page whenever allScores or pageSize changes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setScores(allScores.slice(startIndex, endIndex));
  }, [allScores, currentPage, pageSize]);

  const totalPages = Math.ceil(allScores.length / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const getRankClass = (index) => {
    // Adjust index for current page
    const globalIndex = (currentPage - 1) * pageSize + index;
    if (globalIndex === 0) return 'rank-gold';
    if (globalIndex === 1) return 'rank-silver';
    if (globalIndex === 2) return 'rank-bronze';
    return '';
  };

  return (
    <div className="leaderboard-container mt-5">
      <Form.Group controlId="pageSizeSelect" className="mb-3">
        <Form.Label>每頁顯示筆數:</Form.Label>
        <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Form.Control>
      </Form.Group>
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>玩家</th>
            <th>分數</th>
            <th>日期</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">載入中...</td>
            </tr>
          ) : (
            scores.map((score, index) => (
              <tr
                key={score.id}
                className={`${getRankClass( (currentPage - 1) * pageSize + index )} ${currentUser && score.userId === currentUser.uid ? 'current-user-row' : ''}`}
              >
                <td className="rank-cell">
                  {(currentPage - 1) * pageSize + index + 1 <= 3 ? (
                    <FaTrophy className="trophy-icon" />
                  ) : (
                    (currentPage - 1) * pageSize + index + 1
                  )}
                </td>
                <td>{score.userName}</td>
                <td>{score.score}</td>
                <td>{new Date(score.createdAt?.toDate()).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between mt-3">
        {currentPage > 1 && (
          <Button onClick={handlePrevPage} disabled={loading} variant="secondary">上一頁</Button>
        )}
        {currentPage < totalPages && (
          <Button onClick={handleNextPage} disabled={loading} variant="secondary">下一頁</Button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;