import React, { useState } from 'react';
import { BrowserRouter as Router, useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';
import profileImage from '../../Assets/profile-placeholder.jpeg';

const Dashboard = () => {
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  const handleChatbotClick = () => {
    navigate('/chatbot');
  };

  const handleBookClick = () => {
    navigate('/books');
  };

  const handleDiscussionClick = () => {
    navigate('/discussion');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="logo">REDU</div>
        <ul>
          <li onClick={handleBookClick}>
            <i className="fas fa-book"></i>
            <span>Books</span>
          </li>
          <li onClick={handleChatbotClick}>
            <i className="fas fa-robot"></i>
            <span>Chatbot</span>
          </li>
          <li onClick={handleDiscussionClick}>
            <i className="fas fa-comments"></i>
            <span>Discussion Board</span>
          </li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <div className="profile-section">
          <img src={profileImage} alt="Profile" className="profile-image" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <div className="dropdown">
              <ul>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
        <div className="dashboard-text">
          <h1 className="animated-heading">Welcome to REDU</h1>
          <p className="animated-text">Empowering education through technology.</p>
          <Link to="/preferences" className="cta-button">Set Preferences</Link>
        </div>
        <div className="dashboard-image">
          <i className="fas fa-graduation-cap"></i>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;