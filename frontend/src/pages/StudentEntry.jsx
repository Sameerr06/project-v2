import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentEntry.css'

export default function StudentEntry() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    college: '',
    year: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/student/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          college: formData.college,
          year: formData.year,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('studentId', data.id)
        localStorage.setItem('studentEntry', JSON.stringify(formData))
        navigate('/instructions')
      } else {
        const msg = data.error || data.email?.[0] || data.detail || JSON.stringify(data)
        setError(msg)
      }
    } catch (err) {
      setError('Network error — please check your connection and try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="student-entry-container">
      {/* Left Section */}
      <div className="left-section">
        <h1>Code Debugging</h1>
        {/* Replace the src with your own image or illustration */}
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a40ec2efcca9415fd356de77acd9ce1778e08d45613e8ad1a8a4ab9be110e201?placeholderIfAbsent=true&apiKey=30fa825763e947d5bf1994fb75e7e9e2"
          alt="Code Debugging Illustration" 
          className="illustration"
        />
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2>Student Details</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
          />
          <input
            type="text"
            name="college"
            placeholder="College"
            value={formData.college}
            onChange={handleChange}
          />
          <select name="year" value={formData.year} onChange={handleChange}>
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          {error && (
            <div style={{
              color: '#dc2626',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              marginTop: '0.5rem'
            }}>
              ⚠️ {error}
            </div>
          )}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
