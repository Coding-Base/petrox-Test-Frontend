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
          <Link to="/dashboard" style={{color: '#302AF3', marginRight: '1rem'}}>Dashboard</Link>
          <Link to="/history" style={{color: '#302AF3'}}>History</Link> <br></br>
          <Link to="https://petrox-test-frontend-7cep.onrender.com" style={{color: '#302AF3'}}>Main Dashboard</Link>
        </nav>
      </header>
      
      <div className="container">
     <h1 style={{ color: '#302AF3' }}>
  Welcome buddy, Start a test, click on the Dashboard Link After{' '}
  <Link to="/login">Login</Link> in!!!
</h1>

        <Routes>
          <Route path="/Login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Register />} />
          <Route path="/test/:sessionId" element={<Test />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
