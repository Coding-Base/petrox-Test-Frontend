import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Use the same CSS file as Login.js for consistency

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://petroxtestbackend.onrender.com/api/users/', { username, email, password });
      alert('Registration successful, please login');
      navigate('/login'); // Navigate to login on success
    } catch (error) {
      alert('Registration failed');
    }
  };

  const handleSignIn = () => {
    navigate('/login'); // Navigate programmatically to /login
  };

  return (
    <div className="login-container">
      <div className="background-shapes">
        <div className="circle yellow"></div>
        <div className="circle blue"></div>
        <div className="triangle"></div>
        <div className="square"></div>
      </div>
      <div className="login-box">
        <h2 className="login-title">Create an Account</h2>
        <p className="login-subtitle">
          By using our services, you are agreeing to our <br />
          <a href="#home">Terms and Privacy Statement</a>.
        </p>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" type="submit">
            Create Account
          </button>
        </form>
        <p className="login-footer">
          Already have an account?{' '}
          <span
            onClick={handleSignIn}
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
          >
            Sign in
          </span>.
        </p>
      </div>
    </div>
  );
};

export default Register;
