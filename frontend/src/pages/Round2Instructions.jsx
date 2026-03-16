import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Round2Instructions.css';

export default function Round2Instructions() {
  const navigate = useNavigate();
  const studentData = JSON.parse(localStorage.getItem('studentEntry') || '{}');

  return (
    <main className="r2i-container">
      <div className="r2i-wrapper">
        <div className="r2i-badge">🏆 Round 2 Qualified</div>
        <h1 className="r2i-title">CODEVERSE 2K25 — Round 2</h1>
        <h2 className="r2i-subtitle">Code Debugging Challenge</h2>

        {/* Participant Info */}
        <section className="r2i-info-card">
          <h3>Participant</h3>
          <div className="r2i-info-grid">
            <div><span>Name</span><strong>{studentData.name}</strong></div>
            <div><span>College</span><strong>{studentData.college}</strong></div>
            <div><span>Department</span><strong>{studentData.department}</strong></div>
            <div><span>Year</span><strong>{studentData.year}</strong></div>
          </div>
        </section>

        {/* Instructions */}
        <section className="r2i-instructions">
          <h3>📋 Round 2 Instructions</h3>
          <ul>
            <li>🕐 You have <strong>25 minutes</strong> to complete Round 2</li>
            <li>🐛 Each question contains a <strong>buggy code snippet</strong> — identify and select the correct fix</li>
            <li>✅ Each correct answer earns <strong>20 points</strong></li>
            <li>⏱️ Each question has a <strong>5-minute</strong> time limit before auto-advancing</li>
            <li>💻 Use the built-in compiler to <strong>test and verify</strong> your fixes</li>
            <li>🔒 Fullscreen mode is enforced — exiting will trigger a warning</li>
            <li>🔒 Tab switching is monitored — 3 violations = auto-submit</li>
            <li>🏅 Your Round 1 score carries forward to the final ranking</li>
          </ul>
        </section>

        {/* Scoring */}
        <section className="r2i-scoring">
          <h3>🎯 Scoring</h3>
          <div className="r2i-scoring-grid">
            <div className="r2i-scoring-item">
              <div className="r2i-points">+20</div>
              <div>Correct Answer</div>
            </div>
            <div className="r2i-scoring-item">
              <div className="r2i-points zero">0</div>
              <div>Wrong Answer</div>
            </div>
            <div className="r2i-scoring-item">
              <div className="r2i-points carry">+R1</div>
              <div>Round 1 Carries Forward</div>
            </div>
          </div>
        </section>

        <button className="r2i-start-btn" onClick={() => navigate('/round2')}>
          🚀 Start Round 2
        </button>
      </div>
    </main>
  );
}
