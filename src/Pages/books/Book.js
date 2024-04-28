import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Book.css';
import profileImage from '../../Assets/profile-placeholder.jpeg';
import Pagination from '../../Components/pagination/Pagination';
import ChatModal from '../../Components/chatmodal/ChatModal';
import PracticeQuestionsModal from '../../Components/practiceQuestionsModal/PracticeQuestionsModal';


const Book = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullText, setShowFullText] = useState({});
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPracticeQuestionsModal, setShowPracticeQuestionsModal] = useState(false);

  const resultsPerPage = 10;
  const navigate = useNavigate();
  const maxPreviewLength = 200; // Maximum number of characters to display in the preview


  const handleGeneratePracticeQuestions = (book) => {
    setSelectedBook(book);
    setShowPracticeQuestionsModal(true);
  };

  const handleClosePracticeQuestionsModal = () => {
    setShowPracticeQuestionsModal(false);
    setSelectedBook(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch('http://150.136.47.221:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setCurrentPage(1);
      } else {
        console.error('Error searching textbooks:', response.status);
      }
    } catch (error) {
      console.error('Error searching textbooks:', error);
    }

    setIsLoading(false); // Set loading state to false
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleChatbotClick = () => {
    navigate('/chatbot');
  };

  const handleDiscussionClick = () => {
    navigate('/discussion');
  };

  const toggleFullText = (bookIndex) => {
    setShowFullText((prevState) => ({
      ...prevState,
      [bookIndex]: !prevState[bookIndex],
    }));
  };

  const handleChatWithPage = (book) => {
    setSelectedBook(book);
    setShowChatModal(true);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setSelectedBook(null);
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
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search textbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button type="submit">Search</button>
          </div>
        </form>
        {isLoading ? (
          <div className="loading-animation">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="search-results">
            {currentResults.map((book, index) => (
              <div key={index} className="book-card">
                <div className="book-details">
                  <h3>{book.Title}</h3>
                  <p>Page Number: {book.Page_Number}</p>
                  <p>
                    Page Text Preview:{' '}
                    {showFullText[index] ? book.Page_Text : `${book.Page_Text.slice(0, maxPreviewLength)}...`}
                    {book.Page_Text.length > maxPreviewLength && (
                      <span
                        className="read-more"
                        onClick={() => toggleFullText(index)}
                      >
                        {showFullText[index] ? 'Read Less' : 'Read More'}
                      </span>
                    )}
                  </p>
                  <div className="book-actions">
                    <a href={book.URL} target="_blank" rel="noopener noreferrer" className="action-button">
                      View PDF
                    </a>
                    <button
                      className="action-button"
                      onClick={() => handleChatWithPage(book)}
                      style={{ marginTop: '9.2px' }}
                    >
                      Chat With Page
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleGeneratePracticeQuestions(book)}
                      style={{ marginTop: '9.2px' }}
                    >
                      Generate Practice Questions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {searchResults.length > 0 && (
          <Pagination
            itemsPerPage={resultsPerPage}
            totalItems={searchResults.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      {showChatModal && (
        <ChatModal
          book={selectedBook}
          onClose={handleCloseChatModal}
        />
      )}
      {showPracticeQuestionsModal && (
      <PracticeQuestionsModal
        book={selectedBook}
        onClose={handleClosePracticeQuestionsModal}
      />
    )}
    </div>
  );
};

export default Book;