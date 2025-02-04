// src/components/History.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [tests, setTests] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:8000/api/history/')
      .then(response => setTests(response.data))
      .catch(err => console.log(err));
  }, []);
  
  return (
    <div>
      <h2>Your Test History</h2>
      {tests.length === 0 ? (
        <p>No tests taken yet.</p>
      ) : (
        <ul>
          {tests.map(test => (
            <li key={test.id}>
              {test.course.name} - Score: {test.score} - Taken on: {new Date(test.start_time).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
