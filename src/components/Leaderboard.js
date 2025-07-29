import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Table } from 'react-bootstrap';
import { FaTrophy } from 'react-icons/fa';
import './Leaderboard.css';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const scoresCollection = collection(db, 'scores');
    const q = query(scoresCollection, orderBy('score', 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scoresData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setScores(scoresData);
    });

    return () => unsubscribe();
  }, []);

  const getRankClass = (index) => {
    if (index === 0) return 'rank-gold';
    if (index === 1) return 'rank-silver';
    if (index === 2) return 'rank-bronze';
    return '';
  };

  return (
    <div className="leaderboard-container mt-5">
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
          {scores.map((score, index) => (
            <tr key={score.id} className={getRankClass(index)}>
              <td className="rank-cell">
                {index < 3 ? <FaTrophy className="trophy-icon" /> : index + 1}
              </td>
              <td>{score.userName}</td>
              <td>{score.score}</td>
              <td>{new Date(score.createdAt?.toDate()).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Leaderboard;
