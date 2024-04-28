// Book.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Book.css';
import profileImage from '../../Assets/profile-placeholder.jpeg';

const Book = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Perform the search based on the searchQuery and update the searchResults state
    // For demonstration purposes, let's assume we have a fixed set of search results
    const dummyResults = [
      { id: 1, title: 'Book 1', author: 'Author 1', description: 'Description 1' },
      { id: 2, title: 'Book 2', author: 'Author 2', description: 'Description 2' },
      // Add more dummy search results
    ];
    setSearchResults(dummyResults);
    setCurrentPage(1);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleChatbotClick = () => {
    navigate('/chatbot');
  };

  const handleDiscussionClick = () => {
    navigate('/discussion');
  };

  return (
    <div className="book-container">
      <div className="book-header">
        <div className="logo">REDU</div>
        <ul>
          <li onClick={handleDashboardClick}>Dashboard</li>
          <li onClick={handleChatbotClick}>Chatbot</li>
          <li onClick={handleDiscussionClick}>Discussion Board</li>
        </ul>
        <img src={profileImage} alt="Profile" className="profile-image" />
      </div>
      <div className="book-main">
        <h1>Textbook Search</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search textbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <br></br>
          <button type="submit">Search</button>
        </form>
        <div className="search-results">
          {currentResults.map((book, index) => (
            <div key={book.id} className="book-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Description: {book.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(searchResults.length / resultsPerPage) }).map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Book;
