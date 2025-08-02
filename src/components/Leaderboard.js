import React, { useState, useEffect, useMemo } from 'react';
import { auth } from '../firebase';
import { orderBy } from 'firebase/firestore';
import { Table, Button, Dropdown } from 'react-bootstrap';
import { FaTrophy } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Leaderboard.css';

import LoadingSpinner from './LoadingSpinner';
import useFirestoreCollection from '../hooks/useFirestoreCollection';

const Leaderboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentUser] = useAuthState(auth);
  const [pageSize, setPageSize] = useState(10); // User customizable page size
  const [currentPage, setCurrentPage] = useState(1); // Current page number

  const leaderboardQueryConstraints = useMemo(() => [
    orderBy('score', 'desc')
  ], []);

  // eslint-disable-next-line no-unused-vars
  const { data: allScores, loading, error } = useFirestoreCollection(
    'scores',
    leaderboardQueryConstraints,
    true // Enable live updates for leaderboard
  );

  const [scores, setScores] = useState([]); // Scores for current page

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
      {/* Header Section with Title and Page Size Selector */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="leaderboard-title mb-0">排行榜</h2>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-pagesize" size="sm" className="btn-theme-gradient">
            每頁 {pageSize} 筆
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setPageSize(10)}>10</Dropdown.Item>
            <Dropdown.Item onClick={() => setPageSize(20)}>20</Dropdown.Item>
            <Dropdown.Item onClick={() => setPageSize(50)}>50</Dropdown.Item>
            <Dropdown.Item onClick={() => setPageSize(100)}>100</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Leaderboard Table */}
      <Table striped bordered responsive variant="dark">
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
              <td colSpan="4" className="text-center">
                <LoadingSpinner loading={loading} />
              </td>
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
          <Button onClick={handleNextPage} disabled={loading} variant="secondary" className="ms-auto">下一頁</Button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;