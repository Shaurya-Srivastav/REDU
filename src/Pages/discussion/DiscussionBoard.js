// DiscussionBoard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscussionBoard.css';
import profileImage from '../../Assets/profile-placeholder.jpeg';
import NewDiscussionModal from '../../Components/newdiscussionmodal/NewDiscussionModal';
import DiscussionCard from '../../Components/discussion-card/DiscussionCard';
import DiscussionPopup from '../../Components/discussion-popup/DiscussionPopup';
import Pagination from '../../Components/pagination/Pagination';

const DiscussionBoard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'Geography',
    'Political Science',
    'Art',
    'Education',
    'Economics',
    'Science',
    'Mathematics',
    'History',
    'Philosophy',
    'Biology',
    'Chemistry',
    'Physics',
    'Computer Science',
    'Engineering',
    'Medicine',
    'Business',
    'Finance',
    'Literature',
    'Psychology',
    'Sociology',
  ];

  const itemsPerPage = 8;

  useEffect(() => {
    fetchDiscussions(searchQuery, selectedCategory);
  }, [currentPage]);

  const fetchDiscussions = async (searchQuery = '', category = '') => {
    setLoading(true);
    try {
      let url = 'http://150.136.47.221:5000/api/discussions';
      const params = [];

      if (category) {
        params.push(`category=${category}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched discussions:', data);

        // Filter the discussions based on the search query
        const filteredDiscussions = data.filter((discussion) => {
          const lowercaseTitle = discussion.title.toLowerCase();
          const lowercaseContent = discussion.content.toLowerCase();
          const lowercaseQuery = searchQuery.toLowerCase();

          return (
            lowercaseTitle.includes(lowercaseQuery) ||
            lowercaseContent.includes(lowercaseQuery)
          );
        });

        setDiscussions(filteredDiscussions);
      } else {
        console.error('Error fetching discussions:', response.status);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory('');
    setCurrentPage(1);
    fetchDiscussions(searchQuery, '');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    const filteredDiscussions = discussions.filter((discussion) => {
      return discussion.category === category;
    });

    if (filteredDiscussions.length === 0) {
      alert('No results found for the selected category.');
      return;
    }

    setDiscussions(filteredDiscussions);
  };

  const handlePostDiscussion = () => {
    setShowNewDiscussionModal(true);
  };

  const handleNewDiscussionSubmit = () => {
    setShowNewDiscussionModal(false);
    fetchDiscussions(searchQuery, selectedCategory);
  };

  const handleCloseNewDiscussionModal = () => {
    setShowNewDiscussionModal(false);
  };

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  const handleCloseDiscussionPopup = () => {
    setSelectedDiscussion(null);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleBookClick = () => {
    navigate('/books');
  };

  const handleChatbotClick = () => {
    navigate('/chatbot');
  };

  const handleClearDiscussions = async () => {
    try {
      const response = await fetch('http://150.136.47.221:5000/api/clear-discussions', {
        method: 'DELETE',
      });

      if (response.ok) {
        setDiscussions([]);
      } else {
        console.error('Error clearing discussions:', response.status);
      }
    } catch (error) {
      console.error('Error clearing discussions:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDiscussions = discussions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="discussion-board-container">
      <div className="discussion-board-header">
        <div className="logo">REDU</div>
        <ul>
          <li onClick={handleDashboardClick}>Dashboard</li>
          <li onClick={handleBookClick}>Textbooks</li>
          <li onClick={handleChatbotClick}>Chatbot</li>
        </ul>
        <img src={profileImage} alt="Profile" className="profile-image" />
      </div>
      <div className="discussion-board-main">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Categories</h3>
            <button className="reset-button" onClick={() => window.location.reload()}>
              Reset
            </button>
          </div>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="discussion-board-content">
          <br />
          <br />
          {/* <button className="clear-discussions-button" onClick={handleClearDiscussions}>
            Clear Discussions
          </button> */}
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <br />
              <button type="submit">Search</button>
            </form>
            <button className="post-discussion-button" onClick={handlePostDiscussion}>
              Post Discussion
            </button>
          </div>
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="discussions">
              {currentDiscussions.map((discussion) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  onDiscussionClick={() => handleDiscussionClick(discussion)}
                />
              ))}
            </div>
          )}
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={discussions.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {showNewDiscussionModal && (
        <NewDiscussionModal
          onSubmit={handleNewDiscussionSubmit}
          onClose={handleCloseNewDiscussionModal}
          categories={categories}
        />
      )}
      {selectedDiscussion && (
        <DiscussionPopup
          discussion={selectedDiscussion}
          onClose={handleCloseDiscussionPopup}
        />
      )}
    </div>
  );
};

export default DiscussionBoard;