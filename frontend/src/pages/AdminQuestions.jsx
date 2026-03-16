import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminQuestions.css";

const ROUND_LABELS = { 1: "Round 1 — MCQ", 2: "Round 2 — Code Debugging" };

const EMPTY_FORM = {
  text: "",
  code_snippet: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "A",
  round_number: 1,
  points: 5,
};

function AdminQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | '1' | '2'
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // question id pending delete
  const [showForm, setShowForm] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/");
  }, [navigate]);

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? "/api/admin/questions/"
          : `/api/admin/questions/?round=${filter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` },
      });
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "round_number" || name === "points" ? Number(value) : value,
    }));
  };

  // Submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["text", "option_a", "option_b", "option_c", "option_d", "correct_option"];
    for (const f of required) {
      if (!form[f].trim()) {
        showToast("error", `Field "${f}" is required.`);
        return;
      }
    }
    try {
      const res = await fetch("/api/admin/questions/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("success", "✅ Question added successfully!");
        setForm(EMPTY_FORM);
        setShowForm(false);
        fetchQuestions();
      } else {
        const err = await res.json();
        showToast("error", "Error: " + JSON.stringify(err));
      }
    } catch {
      showToast("error", "Network error. Try again.");
    }
  };

  // Delete question
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/admin/questions/delete/${deleteConfirm}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` },
      });
      if (res.ok) {
        showToast("success", "🗑️ Question deleted.");
        fetchQuestions();
      } else {
        showToast("error", "Failed to delete question.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const filteredQuestions =
    filter === "all"
      ? questions
      : questions.filter((q) => q.round_number === Number(filter));

  const r1Count = questions.filter((q) => q.round_number === 1).length;
  const r2Count = questions.filter((q) => q.round_number === 2).length;

  return (
    <div className="aq-root">
      {/* Toast */}
      {toast && (
        <div className={`aq-toast aq-toast--${toast.type}`}>{toast.msg}</div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="aq-modal-overlay">
          <div className="aq-modal">
            <div className="aq-modal-icon">🗑️</div>
            <h3>Delete Question?</h3>
            <p>This action cannot be undone.</p>
            <div className="aq-modal-actions">
              <button className="aq-btn aq-btn--ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="aq-btn aq-btn--danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="aq-header">
        <div className="aq-header-left">
          <button className="aq-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h1 className="aq-header-title">Question Manager</h1>
            <p className="aq-header-sub">CODEVERSE 2K25 — Admin Panel</p>
          </div>
        </div>
        <button className="aq-btn aq-btn--primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "✕ Close Form" : "+ Add Question"}
        </button>
      </header>

      {/* Stats Bar */}
      <div className="aq-stats">
        <div className="aq-stat aq-stat--blue">
          <span className="aq-stat-num">{questions.length}</span>
          <span className="aq-stat-label">Total Questions</span>
        </div>
        <div className="aq-stat aq-stat--purple">
          <span className="aq-stat-num">{r1Count}</span>
          <span className="aq-stat-label">Round 1 (MCQ)</span>
        </div>
        <div className="aq-stat aq-stat--orange">
          <span className="aq-stat-num">{r2Count}</span>
          <span className="aq-stat-label">Round 2 (Debug)</span>
        </div>
      </div>

      {/* Add Question Form */}
      {showForm && (
        <div className="aq-form-card">
          <h2 className="aq-form-title">➕ Add New Question</h2>
          <form onSubmit={handleSubmit} className="aq-form">
            {/* Round + Points row */}
            <div className="aq-form-row">
              <div className="aq-field">
                <label>Round</label>
                <select name="round_number" value={form.round_number} onChange={handleChange}>
                  <option value={1}>Round 1 — MCQ</option>
                  <option value={2}>Round 2 — Code Debugging</option>
                </select>
              </div>
              <div className="aq-field">
                <label>Points</label>
                <input
                  type="number"
                  name="points"
                  value={form.points}
                  onChange={handleChange}
                  min={1}
                  max={100}
                />
              </div>
              <div className="aq-field">
                <label>Correct Option</label>
                <select name="correct_option" value={form.correct_option} onChange={handleChange}>
                  {["A", "B", "C", "D"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question text */}
            <div className="aq-field aq-field--full">
              <label>Question Text <span className="aq-required">*</span></label>
              <textarea
                name="text"
                value={form.text}
                onChange={handleChange}
                rows={3}
                placeholder="Enter the question..."
              />
            </div>

            {/* Code snippet */}
            <div className="aq-field aq-field--full">
              <label>Code Snippet <span className="aq-optional">(optional)</span></label>
              <textarea
                name="code_snippet"
                value={form.code_snippet}
                onChange={handleChange}
                rows={5}
                className="aq-code-input"
                placeholder="# Paste code here if applicable..."
              />
            </div>

            {/* Options */}
            <div className="aq-options-grid">
              {["a", "b", "c", "d"].map((opt) => (
                <div key={opt} className={`aq-field aq-option-field ${form.correct_option === opt.toUpperCase() ? "aq-option-field--correct" : ""}`}>
                  <label>
                    Option {opt.toUpperCase()}
                    {form.correct_option === opt.toUpperCase() && (
                      <span className="aq-correct-badge">✓ Correct</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name={`option_${opt}`}
                    value={form[`option_${opt}`]}
                    onChange={handleChange}
                    placeholder={`Option ${opt.toUpperCase()}...`}
                  />
                </div>
              ))}
            </div>

            <div className="aq-form-actions">
              <button type="button" className="aq-btn aq-btn--ghost" onClick={() => { setForm(EMPTY_FORM); setShowForm(false); }}>
                Cancel
              </button>
              <button type="submit" className="aq-btn aq-btn--primary">
                💾 Save Question
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="aq-filter-bar">
        {[["all", "All Questions"], ["1", "Round 1 — MCQ"], ["2", "Round 2 — Debug"]].map(
          ([val, label]) => (
            <button
              key={val}
              className={`aq-tab ${filter === val ? "aq-tab--active" : ""}`}
              onClick={() => setFilter(val)}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="aq-loading">
          <div className="aq-spinner" />
          <p>Loading questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="aq-empty">
          <div className="aq-empty-icon">📭</div>
          <p>No questions found. Add some using the button above.</p>
        </div>
      ) : (
        <div className="aq-questions-list">
          {filteredQuestions.map((q, idx) => (
            <div key={q.id} className={`aq-question-card aq-question-card--r${q.round_number}`}>
              <div className="aq-question-header">
                <div className="aq-question-meta">
                  <span className={`aq-round-badge aq-round-badge--r${q.round_number}`}>
                    {ROUND_LABELS[q.round_number]}
                  </span>
                  <span className="aq-points-badge">{q.points} pts</span>
                  <span className="aq-id-badge">#{q.id}</span>
                </div>
                <button
                  className="aq-delete-btn"
                  onClick={() => setDeleteConfirm(q.id)}
                  title="Delete question"
                >
                  🗑️
                </button>
              </div>

              <p className="aq-question-text">
                <span className="aq-q-num">Q{idx + 1}.</span> {q.text}
              </p>

              {q.code_snippet && (
                <pre className="aq-code-snippet">{q.code_snippet}</pre>
              )}

              <div className="aq-options-display">
                {["A", "B", "C", "D"].map((opt) => {
                  const txt = q[`option_${opt.toLowerCase()}`];
                  if (!txt) return null;
                  const isCorrect = q.correct_option.toUpperCase() === opt;
                  return (
                    <div
                      key={opt}
                      className={`aq-opt ${isCorrect ? "aq-opt--correct" : ""}`}
                    >
                      <span className="aq-opt-label">{opt}</span>
                      <span className="aq-opt-text">{txt}</span>
                      {isCorrect && <span className="aq-opt-check">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminQuestions;
