import { getApiUrl } from '../services/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Round1Results.css';

export default function Round1Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) { navigate('/'); return; }

    // Fetch round 1 completion result
    const storedResult = localStorage.getItem('round1Result');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }

    // Fetch leaderboard for round 1
    fetch(getApiUrl('/api/leaderboard/?round=1')
      .then(r => r.json())
      .then(data => {
        setLeaderboard(data.slice(0, 10)); // top 10
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleContinueRound2 = async () => {
    const studentId = localStorage.getItem('studentId');
    try {
      await fetch(getApiUrl('/api/start-round2/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId }),
      });
      localStorage.setItem('currentRound', '2');
      navigate('/round2-instructions');
    } catch (err) {
      console.error(err);
    }
  };

  const studentId = parseInt(localStorage.getItem('studentId'));

  if (loading) return <div className="r1r-loading">Loading results...</div>;

  return (
    <div className="r1r-container">
      {/* Header */}
      <div className="r1r-header">
        <h1>🏆 Round 1 Results</h1>
        <p className="r1r-subtitle">CODEVERSE 2K25 — Code Debugging Challenge</p>
      </div>

      {/* Score Card */}
      {result && (
        <div className={`r1r-scorecard ${result.qualifies_for_round2 ? 'qualified' : 'not-qualified'}`}>
          <div className="r1r-score-main">
            <div className="r1r-score-value">{result.round1_score}</div>
            <div className="r1r-score-label">Your Score</div>
          </div>
          <div className="r1r-score-details">
            <div className="r1r-detail">
              <span className="r1r-detail-label">Your Rank</span>
              <span className="r1r-detail-value">#{result.rank}</span>
            </div>
            <div className="r1r-detail">
              <span className="r1r-detail-label">Total Participants</span>
              <span className="r1r-detail-value">{result.total_participants}</span>
            </div>
            <div className="r1r-detail">
              <span className="r1r-detail-label">Cutoff Score</span>
              <span className="r1r-detail-value">{result.cutoff_score}</span>
            </div>
          </div>

          {result.qualifies_for_round2 ? (
            <div className="r1r-qualify-badge">
              <span className="r1r-badge-icon">🎉</span>
              <span>Congratulations! You qualify for Round 2!</span>
            </div>
          ) : (
            <div className="r1r-eliminated-badge">
              <span className="r1r-badge-icon">😔</span>
              <span>Thank you for participating! You did not qualify for Round 2.</span>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className="r1r-leaderboard">
        <h2>📊 Round 1 Top 10</h2>
        <div className="r1r-table-wrapper">
          <table className="r1r-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>College</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((s, idx) => (
                <tr
                  key={s.id}
                  className={s.id === studentId ? 'r1r-my-row' : ''}
                >
                  <td>
                    {idx === 0 && '🥇'}
                    {idx === 1 && '🥈'}
                    {idx === 2 && '🥉'}
                    {idx > 2 && `#${idx + 1}`}
                  </td>
                  <td>{s.name} {s.id === studentId && <span className="r1r-you">(You)</span>}</td>
                  <td>{s.college}</td>
                  <td className="r1r-score-cell">{s.round1_score}</td>
                  <td>
                    {s.round2_qualified
                      ? <span className="r1r-tag qualified">✅ Qualified</span>
                      : <span className="r1r-tag eliminated">❌ Eliminated</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="r1r-actions">
        {result?.qualifies_for_round2 ? (
          <button className="r1r-btn-round2" onClick={handleContinueRound2}>
            🚀 Continue to Round 2
          </button>
        ) : (
          <button className="r1r-btn-finish" onClick={() => navigate('/thank-you')}>
            Finish — Go to Results
          </button>
        )}
      </div>
    </div>
  );
}

