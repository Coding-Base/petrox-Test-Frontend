// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import History from './components/History';
import './App.css';
import image from './Logo.png'
function App() {
  return (
    <Router>
      <header className="header">
        <img src={image} alt='Petroxlogo'/>
        <h1>Test Portal</h1>
        <nav>
          <Link to="/" style={{color: '#302AF3', marginRight: '1rem'}}>Dashboard</Link>
          <Link to="/history" style={{color: '#302AF3'}}>History</Link>
        </nav>
      </header>
      
      <div className="container">
      <h1 style={{color:' #302AF3'}}>Welcome buddy, Start a test, click on the Dashboard Link  After <a href='http://localhost:3000/login'>Login </a>in !!!</h1>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test/:sessionId" element={<Test />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
