// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Custom CSS file

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [testDuration, setTestDuration] = useState(300);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/courses/")
      .then((response) => setCourses(response.data))
      .catch((error) => {
        console.error("Error fetching courses:", error);
        alert("Failed to load courses.");
      });
  }, []);

  const handleStartTest = async () => {
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/start-test/",
        {
          course_id: selectedCourse,
          question_count: parseInt(questionCount, 10),
          duration: parseInt(testDuration, 10),
        }
      );

      if (response.data && response.data.id) {
        navigate(`/test/${response.data.id}`);
      } else {
        alert("Test session creation failed. No session ID returned.");
      }
    } catch (error) {
      console.error("Error starting test:", error.response?.data || error);
      alert(
        error.response?.data?.error ||
          "There was an error starting the test. Please try again."
      );
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Test Dashboard</h2>
        <div className="dashboard-input-group">
          <label>Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="dashboard-select"
          >
            <option value="">--Select a Course--</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="dashboard-input-group">
          <label>Number of Questions:</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            min="1"
            className="dashboard-input"
          />
        </div>
        <div className="dashboard-input-group">
          <label>Test Duration (seconds):</label>
          <input
            type="number"
            value={testDuration}
            onChange={(e) => setTestDuration(e.target.value)}
            min="10"
            className="dashboard-input"
          />
        </div>
        <button className="dashboard-button" onClick={handleStartTest}>
          Begin Test
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
