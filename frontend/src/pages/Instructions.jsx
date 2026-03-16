
"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Instructions.css";

function Instructions() {
  const navigate = useNavigate();
  const studentData = JSON.parse(localStorage.getItem('studentEntry'));

  const handleStart = () => {
    navigate('/quiz');
  };

  return (
    <main className="container">
      <div className="contentWrapper">
        <h1 className="title">CODEVERSE 2K25</h1>
        <section className="formContainer">
          <h2 className="formTitle">Participant Information</h2>
          <form className="formFields">
            <div className="formGroup">
              <label className="formLabel">NAME:</label>
              <input className="formInput" value={studentData?.name || ''} readOnly />
            </div>
            <div className="formGroup">
              <label className="formLabel">COLLEGE:</label>
              <input className="formInput" value={studentData?.college || ''} readOnly />
            </div>
            <div className="formGroup">
              <label className="formLabel">YEAR:</label>
              <input className="formInput" value={studentData?.year || ''} readOnly />
            </div>
            <div className="formGroup">
              <label className="formLabel">EMAIL:</label>
              <input className="formInput" value={studentData?.email || ''} readOnly />
            </div>
            <div className="formGroup">
              <label className="formLabel">DEPARTMENT</label>
              <input className="formInput" value={studentData?.department || ''} readOnly />
            </div>
          </form>
        </section>

        <header className="instructionsHeader">
          <h2 className="instructionsTitle">Instructions</h2>
          <span className="instructionsTime">60 minutes</span>
        </header>

        <section className="instructionsList">
          <p className="instructionItem">1. You will face 20 challenging problems divided into 4 categories: syntax debugging, logic debugging, missing code elements, and efficiency optimization</p>
          <p className="instructionItem">2. For each missing code elements question, you must identify what's missing (variables, loops, conditions, etc.) and select the correct implementation</p>
          <p className="instructionItem">3. Each question has a time limit of 2 min after this time, the challenge automatically advances to the next question</p>
          <p className="instructionItem">4. Each correct answer earns you 5 points. There is no negative marking for wrong answers</p>
          <p className="instructionItem">5. The entire challenge must be completed within 60min, your timer will be displayed at the top of your screen</p>
          <p className="instructionItem">6. For "Missing Code Elements" problems, look for missing variables, function parameters, loop conditions or return statements that would make the code work</p>
          <p className="instructionItem" style={{color:"#dc2626",fontWeight:"600"}}>7. 🔒 The exam runs in FULLSCREEN mode. Exiting fullscreen will pause your exam until you return.</p>
          <p className="instructionItem" style={{color:"#dc2626",fontWeight:"600"}}>8. 🔒 Tab/window switching is monitored. After 3 violations your exam will be auto-submitted.</p>
          <p className="instructionItem" style={{color:"#dc2626",fontWeight:"600"}}>9. 🔒 Copying, right-clicking, and shortcuts like Ctrl+C are disabled during the exam.</p>
          <p className="instructionItem" style={{color:"#dc2626",fontWeight:"600"}}>10. 🔒 Questions and answer options are randomized for every participant.</p>
        </section>

        <h2 className="challengeTypesHeader">Challenge Types</h2>
        <div className="challengeTypesGrid">
          <article className="challengeType">
            <header className="challengeTypeHeader">
              <div className="challengeTypeDot"></div>
              <h3 className="challengeTypeTitle">Syntax Debugging</h3>
            </header>
            <p className="challengeTypeDescription">Find and fix syntax errors in code snippets across different programming languages</p>
          </article>

          <article className="challengeType">
            <header className="challengeTypeHeader">
              <div className="challengeTypeDot"></div>
              <h3 className="challengeTypeTitle">Logic Debugging</h3>
            </header>
            <p className="challengeTypeDescription">Identify logical errors that cause incorrect results or unexpected behavior</p>
          </article>

          <article className="challengeType">
            <header className="challengeTypeHeader">
              <div className="challengeTypeDot"></div>
              <h3 className="challengeTypeTitle">Missing Code Elements</h3>
            </header>
            <p className="challengeTypeDescription">Find the missing pieces of code needed to complete a function or algorithm</p>
          </article>

          <article className="challengeType">
            <header className="challengeTypeHeader">
              <div className="challengeTypeDot"></div>
              <h3 className="challengeTypeTitle">Efficiency Optimization</h3>
            </header>
            <p className="challengeTypeDescription">Improve inefficient code by optimizing algorithms or data structures</p>
          </article>
        </div>

        <button onClick={handleStart} className="startButton">Start Quiz</button>
      </div>
    </main>
  );
}

export default Instructions;