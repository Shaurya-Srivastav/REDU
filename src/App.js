import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignupPage from './Pages/account-creation/LoginSignupPage';
import Dashboard from './Pages/dashboard/Dashboard';
import Preference from './Pages/preference/Preference';
import Chatbot from './Pages/chatbot/Chatbot';
import Book from './Pages/books/Book';
import DiscussionBoard from './Pages/discussion/DiscussionBoard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preferences" element={<Preference />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/books" element={<Book />} />
        <Route path="/discussion" element={<DiscussionBoard />} />
        {/* Add other routes for your application */}
      </Routes>
    </Router>
  );
};

export default App;