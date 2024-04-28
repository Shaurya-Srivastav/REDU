import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';
import './LoginSignupPage.css';

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, isAuthenticated } = useContext(AuthContext); // Using AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Redirect if already logged in
    }
  }, [isAuthenticated, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
      ...(isLogin ? {} : { name })
    };

    try {
      await login(userData, isLogin); // Login or signup
    } catch (error) {
      alert('Authentication error:', error);
      // Optionally handle errors, e.g., show notification
    }
  };

  return (
    <div className="login-signup-page">
      <header><h1 id="logo-title-top-left">REDU.EDU</h1></header>
      <div className={`form-container ${isLogin ? 'login' : 'signup'}`}>
        <h2 className="form-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="input-group">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="toggle-form">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span onClick={toggleForm} style={{ cursor: 'pointer' }}>{isLogin ? ' Sign Up' : ' Login'}</span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignupPage;
