import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Test.css';
import image from '../Logo.png';

const Test = () => {
  const { sessionId } = useParams();
  const [testSession, setTestSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // Default value; will update based on API response.
  const [failedAnswers, setFailedAnswers] = useState([]);
  const [review, setReview] = useState(false);

  // Fetch test session details and update the timer.
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/test-session/${sessionId}/`)
      .then((response) => {
        setTestSession(response.data);
        setTimeLeft(response.data.duration ?? 300); // Default to 300 if duration is not provided
      })
      .catch((err) => console.error(err));
  }, [sessionId]);

  // Handle test submission
  const handleSubmit = useCallback(async () => {
    if (!window.confirm("Are you sure you want to submit the test?")) return;
    
    try {
      const response = await axios.post(`http://localhost:8000/api/submit-test/${sessionId}/`, { answers });
      alert(`Test submitted! Your score: ${response.data.score}`);

      if (testSession) {
        const failed = testSession.questions.filter(q => answers[q.id] !== q.correct_option);
        setFailedAnswers(failed);
      }

      setReview(true);
    } catch (error) {
      console.error(error);
      alert('Submission failed.');
    }
  }, [answers, sessionId, testSession]);

  // Timer countdown effect.
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, handleSubmit]);

  // Update an answer for a question.
  const handleAnswerChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  if (!testSession)
    return (
      <div>
        <img src={image} alt="Petroxlogo" /> Loading...
      </div>
    );

  return (
    <div className="test-container">
      {/* Header Section */}
      <div className="test-header">
        <h2>Test on {testSession.course.name}</h2>
        <div className="timer">
          <p>Time to Complete</p>
          <p className="time">
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
            {String(timeLeft % 60).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="test-main">
        {review ? (
          // Review Section: Display failed questions with correct answers
          <div className="review-section">
            <h3>Review Your Incorrect Answers</h3>
            {failedAnswers.length === 0 ? (
              <p>Congratulations! You answered all questions correctly.</p>
            ) : (
              failedAnswers.map((question, index) => (
                <div key={question.id} style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 'bold' }}>
                    Question {index + 1}: {question.question_text}
                  </p>
                  <textarea
                    readOnly
                    value={`Your Answer: ${answers[question.id] || "No answer"} | Correct Answer: ${question.correct_option}`}
                    style={{
                      width: '100%',
                      height: '50px',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      backgroundColor: '#f9f9f9',
                      color: '#333',
                    }}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            {/* Questions Section */}
            <div className="questions-section">
              {testSession.questions.map((question, index) => (
                <div key={question.id} className="question-block">
                  <p className="question-text">
                    Question {index + 1}: {question.question_text}
                  </p>
                  <div className="options">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="option">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={opt}
                          checked={answers[question.id] === opt}
                          onChange={() => handleAnswerChange(question.id, opt)}
                        />
                        {question[`option_${opt.toLowerCase()}`]}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleSubmit} className="submit-button">
                Submit Test
              </button>
            </div>

            {/* Progress Section */}
            <div className="progress-section">
              <h3>Question Progress</h3>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(Object.keys(answers).length / testSession.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="question-numbers">
                {testSession.questions.map((question, index) => (
                  <button
                    key={question.id}
                    className={`question-number ${answers[question.id] ? 'answered' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Test;
