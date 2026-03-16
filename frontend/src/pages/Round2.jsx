"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";
import "./Round2.css";

// Round 2 total time: 25 minutes
const ROUND2_TOTAL_SECONDS = 25 * 60;
const QUESTION_TIME = 5 * 60;  // 5 min per question
const MAX_TAB_SWITCHES = 3;

function Round2() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [questionTimer, setQuestionTimer] = useState(QUESTION_TIME);
  const [totalTimer, setTotalTimer] = useState(ROUND2_TOTAL_SECONDS);
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Security state
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const warningTimerRef = useRef(null);

  // ── FULLSCREEN ──────────────────────────────────────────────────────────────
  const enterFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  }, []);

  const handleFullscreenChange = useCallback(() => {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    setShowFullscreenPrompt(!fsEl);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    enterFullscreen();
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [enterFullscreen, handleFullscreenChange]);

  // ── TAB SWITCH DETECTION ────────────────────────────────────────────────────
  const triggerWarning = useCallback((msg) => {
    setWarningMessage(msg);
    setShowWarning(true);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => setShowWarning(false), 4000);
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setTabSwitchCount(prev => {
        const n = prev + 1;
        if (n >= MAX_TAB_SWITCHES) {
          finishRound2(true);
        } else {
          triggerWarning(`⚠️ Tab switch! Warning ${n}/${MAX_TAB_SWITCHES}. Exam will terminate on next switch.`);
        }
        return n;
      });
    }
  }, [triggerWarning]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [handleVisibilityChange]);

  // ── ANTI-CHEAT ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const preventCopy = (e) => { e.preventDefault(); triggerWarning('🚫 Copying is not allowed.'); };
    const preventCtx = (e) => e.preventDefault();
    const preventShortcuts = (e) => {
      if (e.target.classList.contains('code-editor') || e.target.classList.contains('answer-textarea')) return;
      const blocked = (e.ctrlKey && ['c','a','v','x','u','s','p'].includes(e.key.toLowerCase())) || e.key === 'PrintScreen';
      if (blocked) { e.preventDefault(); triggerWarning('🚫 Keyboard shortcut disabled.'); }
    };
    document.addEventListener('copy', preventCopy);
    document.addEventListener('contextmenu', preventCtx);
    document.addEventListener('keydown', preventShortcuts);
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('contextmenu', preventCtx);
      document.removeEventListener('keydown', preventShortcuts);
      document.body.style.userSelect = '';
    };
  }, [triggerWarning]);

  // ── FETCH ROUND 2 QUESTIONS ─────────────────────────────────────────────────
  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) { navigate('/'); return; }

    fetch('/api/questions/?round=2')
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          setProgress((1 / data.length) * 100);
        }
      })
      .catch(err => console.error('Error fetching Round 2 questions:', err));
  }, [navigate]);

  // ── FINISH ROUND 2 ──────────────────────────────────────────────────────────
  const finishRound2 = useCallback(async (forced = false) => {
    const studentId = localStorage.getItem('studentId');
    try {
      const res = await fetch('/api/complete-round2/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId }),
      });
      const data = await res.json();
      localStorage.setItem('round2Result', JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
    navigate('/thank-you', { replace: true });
  }, [navigate]);

  // ── TOTAL TIMER ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimer(prev => {
        if (prev <= 1) { clearInterval(interval); finishRound2(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finishRound2]);

  // ── QUESTION TIMER ──────────────────────────────────────────────────────────
  useEffect(() => {
    setQuestionTimer(QUESTION_TIME);
    const interval = setInterval(() => {
      setQuestionTimer(prev => {
        if (prev <= 1) { clearInterval(interval); handleNext(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // ── SUBMIT ANSWER ───────────────────────────────────────────────────────────
  const submitAnswer = useCallback(async (option) => {
    if (!option || !questions.length) return;
    const studentId = localStorage.getItem('studentId');
    const question = questions[currentIndex];

    try {
      const res = await fetch('/api/submit-answer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          question_id: question.id,
          chosen_option: option,
          round_number: 2,
        }),
      });
      const data = await res.json();
      if (data.is_correct) {
        setScore(data.round2_score);
      }
      setAnsweredCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  }, [questions, currentIndex]);

  // ── NEXT QUESTION ───────────────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    if (selectedOption) await submitAnswer(selectedOption);

    if (currentIndex + 1 >= questions.length) {
      finishRound2(false);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption('');
      setOutput('');
      setCode('');
      setLanguage('python');
      setProgress(((currentIndex + 2) / questions.length) * 100);
    }
  }, [selectedOption, currentIndex, questions.length, submitAnswer, finishRound2]);

  // ── COMPILER ────────────────────────────────────────────────────────────────
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (e.target.value === 'c') {
      setCode('#include <stdio.h>\n\nint main() {\n    // Fix the bug here\n    return 0;\n}');
    } else if (e.target.value === 'python') {
      setCode('# Fix the bug here\n');
    } else if (e.target.value === 'java') {
      setCode('public class Main {\n    public static void main(String[] args) {\n        // Fix the bug here\n    }\n}');
    }
  };

  const compileAndRun = async () => {
    setIsCompiling(true);
    setOutput('Compiling and running...');
    try {
      const res = await fetch('/api/compile/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const result = await res.json();
      setOutput(result.output || 'No output');
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  // ── FORMAT TIME ─────────────────────────────────────────────────────────────
  const fmtTime = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  if (!questions.length) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading Round 2 questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalTimePercent = (totalTimer / ROUND2_TOTAL_SECONDS) * 100;
  const questionTimePercent = (questionTimer / QUESTION_TIME) * 100;

  return (
    <div className="quiz-container r2-container">

      {/* FULLSCREEN OVERLAY */}
      {showFullscreenPrompt && (
        <div className="security-overlay">
          <div className="security-modal">
            <h2>⛶ Fullscreen Required</h2>
            <p>Round 2 must be taken in fullscreen mode.</p>
            <button className="security-action-btn" onClick={enterFullscreen}>Re-enter Fullscreen</button>
          </div>
        </div>
      )}

      {/* WARNING TOAST */}
      {showWarning && (
        <div className="warning-toast">
          <span>{warningMessage}</span>
          <div className="warning-progress"></div>
        </div>
      )}

      {/* VIOLATION BADGE */}
      {tabSwitchCount > 0 && (
        <div className={`tab-switch-badge ${tabSwitchCount >= MAX_TAB_SWITCHES - 1 ? 'danger' : 'warn'}`}>
          ⚠️ Violations: {tabSwitchCount}/{MAX_TAB_SWITCHES}
        </div>
      )}

      {/* ROUND 2 HEADER */}
      <div className="r2-header-bar">
        <div className="r2-round-badge">🏆 ROUND 2</div>
        <div className="r2-score-live">Score: <strong>{score}</strong></div>
        <div className="r2-answered">Answered: {answeredCount}/{questions.length}</div>
      </div>

      {/* DUAL TIMERS */}
      <div className="r2-timers">
        <div className="r2-timer-block">
          <div className="r2-timer-label">Total Time Left</div>
          <div className={`r2-timer-value ${totalTimer < 300 ? 'danger' : ''}`}>{fmtTime(totalTimer)}</div>
          <div className="r2-timer-bar">
            <div className="r2-timer-fill total" style={{ width: `${totalTimePercent}%` }}></div>
          </div>
        </div>
        <div className="r2-timer-block">
          <div className="r2-timer-label">This Question</div>
          <div className={`r2-timer-value ${questionTimer < 60 ? 'danger' : ''}`}>{fmtTime(questionTimer)}</div>
          <div className="r2-timer-bar">
            <div className="r2-timer-fill question" style={{ width: `${questionTimePercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-section">
        <div className="progress-text">Question {currentIndex + 1} of {questions.length}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* QUESTION */}
      <div className="question-section r2-question">
        <div className="r2-question-tag">🐛 Debug the Code</div>
        <h2>{currentQuestion.text}</h2>

        {currentQuestion.code_snippet && (
          <pre className="code-box r2-buggy-code">{currentQuestion.code_snippet}</pre>
        )}

        {/* MCQ Options */}
        <div className="r2-options">
          {['A', 'B', 'C', 'D'].map(opt => {
            const optText = currentQuestion[`option_${opt.toLowerCase()}`];
            if (!optText) return null;
            return (
              <button
                key={opt}
                className={`r2-option ${selectedOption === opt ? 'r2-selected' : ''}`}
                onClick={() => setSelectedOption(opt)}
              >
                <span className="r2-opt-label">{opt}</span>
                <span className="r2-opt-text">{optText}</span>
                {selectedOption === opt && <span className="r2-check">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="question-navigation">
          <button
            className="skip-btn"
            onClick={() => {
              setCurrentIndex(prev => prev + 1);
              setSelectedOption('');
              setOutput('');
              setCode('');
              setProgress(((currentIndex + 2) / questions.length) * 100);
            }}
            disabled={currentIndex >= questions.length - 1}
          >Skip</button>
          <button className="next-btn" onClick={handleNext}>
            {currentIndex === questions.length - 1 ? '🏁 Finish Round 2' : 'Next →'}
          </button>
        </div>
      </div>

      {/* COMPILER */}
      <div className="compiler-section r2-compiler">
        <h3>🖥️ Test Your Fix — Online Compiler</h3>
        <div className="compiler-controls">
          <select value={language} onChange={handleLanguageChange} className="language-selector">
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
          </select>
          <button className="run-btn" onClick={compileAndRun} disabled={isCompiling}>
            {isCompiling ? '⏳ Running...' : '▶ Run Code'}
          </button>
        </div>
        <div className="code-editor-container">
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write or paste your fixed code here to test it..."
            spellCheck="false"
            onCopy={(e) => e.stopPropagation()}
            onCut={(e) => e.stopPropagation()}
            onPaste={(e) => e.stopPropagation()}
            style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
          />
        </div>
        <div className="output-container">
          <div className="output-header">Output:</div>
          <pre className="output">{output}</pre>
        </div>
      </div>

      {/* FINISH BUTTON */}
      <button className="submit-btn r2-submit-btn" onClick={handleNext}>
        {currentIndex === questions.length - 1 ? '🏁 Finish Round 2' : 'Next Question →'}
      </button>
    </div>
  );
}

export default Round2;
