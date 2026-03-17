import { getApiUrl } from '../services/api';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ThankYou.css";

export default function ThankYou() {
  const navigate = useNavigate();
  const [finalScore, setFinalScore] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Block back button
    window.history.pushState(null, '', window.location.href);
    const blockBack = () => window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', blockBack);

    // Load scores from localStorage
    const round1Result = JSON.parse(localStorage.getItem('round1Result') || '{}');
    const round2Result = JSON.parse(localStorage.getItem('round2Result') || '{}');
    const studentData = JSON.parse(localStorage.getItem('studentEntry') || '{}');

    setFinalScore({
      name: studentData.name || 'Participant',
      round1: round1Result.round1_score ?? 0,
      round2: round2Result.round2_score ?? 0,
      total: round2Result.total_score ?? round1Result.round1_score ?? 0,
      qualified: round1Result.qualifies_for_round2 ?? false,
      rank: round1Result.rank ?? '—',
    });

    // Clear session
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEntry');
    localStorage.removeItem('round1Result');
    localStorage.removeItem('round2Result');
    localStorage.removeItem('currentRound');

    // Fetch overall leaderboard
    fetch(getApiUrl('/api/leaderboard/'))
      .then(r => r.json())
      .then(data => setLeaderboard(data.slice(0, 5)))
      .catch(() => {});

    return () => window.removeEventListener('popstate', blockBack);
  }, []);

  return (
    <div className="ty-page">
      {/* Header */}
      <header className="ty-header">
        <div className="ty-header-content">
          <h1 className="ty-brand">CODEVERSE 2K25</h1>
          <p className="ty-tagline">Code Debugging Challenge</p>
        </div>
      </header>

      <main className="ty-main">

        {/* Celebration */}
        <div className="ty-hero">
          <div className="ty-trophy">🏆</div>
          <h2 className="ty-title">
            {finalScore?.name ? `Great job, ${finalScore.name}!` : 'Thank You!'}
          </h2>
          <p className="ty-subtitle">You have successfully completed the challenge.</p>
        </div>

        {/* Score breakdown */}
        {finalScore && (
          <div className="ty-scoreboard">
            <h3>Your Results</h3>
            <div className="ty-score-grid">
              <div className="ty-score-card r1">
                <div className="ty-sc-label">Round 1</div>
                <div className="ty-sc-value">{finalScore.round1}</div>
                <div className="ty-sc-sub">MCQ Score</div>
              </div>
              {finalScore.qualified && (
                <div className="ty-score-card r2">
                  <div className="ty-sc-label">Round 2</div>
                  <div className="ty-sc-value">{finalScore.round2}</div>
                  <div className="ty-sc-sub">Debugging Score</div>
                </div>
              )}
              <div className="ty-score-card total">
                <div className="ty-sc-label">Total</div>
                <div className="ty-sc-value">{finalScore.total}</div>
                <div className="ty-sc-sub">Final Score</div>
              </div>
            </div>
            {!finalScore.qualified && (
              <p className="ty-not-qualified">
                You participated in Round 1. Results will be announced soon.
              </p>
            )}
          </div>
        )}

        {/* Top 5 Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="ty-leaderboard">
            <h3>🏅 Top Scores So Far</h3>
            <div className="ty-lb-list">
              {leaderboard.map((s, i) => (
                <div key={s.id} className={`ty-lb-row ${i === 0 ? 'ty-first' : ''}`}>
                  <span className="ty-lb-rank">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <span className="ty-lb-name">{s.name}</span>
                  <span className="ty-lb-college">{s.college}</span>
                  <span className="ty-lb-score">{s.total_score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="ty-footer-note">
          Results will be officially announced at the prize ceremony. Thank you for participating!
        </p>
      </main>

      {/* Footer */}
      <footer className="ty-footer">
        <div>
          <h3>Contact Us</h3>
          <p onClick={() => window.open('https://www.jct.ac.in/', '_blank')} style={{cursor:'pointer', color:'#60a5fa'}}>
            https://www.jct.ac.in/
          </p>
          <p>Phone: +91 9361488801</p>
        </div>
        <div>
          <h3>Follow Us</h3>
          <a href="https://www.facebook.com/jctgroups/" target="_blank" rel="noreferrer">Facebook</a>
          <br />
          <a href="https://www.instagram.com/jct_college/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </div>
  );
}

