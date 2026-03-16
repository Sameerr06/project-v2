import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Instructions from './pages/Instructions'
import Quiz from './pages/Quiz'
import Round1Results from './pages/Round1Results'
import Round2Instructions from './pages/Round2Instructions'
import Round2 from './pages/Round2'
import ThankYou from './pages/ThankYou'
import StudentEntry from './pages/StudentEntry'
import AdminQuestions from './pages/AdminQuestions'

function App() {
  return (
    <Routes>
      <Route path="/"                    element={<Welcome />} />
      <Route path="/student-entry"       element={<StudentEntry />} />
      <Route path="/instructions"        element={<Instructions />} />
      <Route path="/quiz"                element={<Quiz />} />
      <Route path="/round1-results"      element={<Round1Results />} />
      <Route path="/round2-instructions" element={<Round2Instructions />} />
      <Route path="/round2"              element={<Round2 />} />
      <Route path="/thank-you"           element={<ThankYou />} />
      <Route path="/admin/questions"     element={<AdminQuestions />} />
    </Routes>
  )
}

export default App
