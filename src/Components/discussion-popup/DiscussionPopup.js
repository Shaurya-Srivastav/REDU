import React, { useState, useEffect  } from 'react';
import './DiscussionPopup.css';

const DiscussionPopup = ({ discussion, onClose }) => {
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);  // State to hold the replies

  // Function to fetch replies from the backend
  const fetchReplies = async () => {
    try {
      const response = await fetch(`http://150.136.47.221:5000/api/discussions/${discussion.id}/replies`);
      if (response.ok) {
        const data = await response.json();
        setReplies(data);  // Update the state with the fetched replies
      } else {
        console.error('Failed to fetch replies:', response.status);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  // Use useEffect to fetch replies initially when the component mounts
  useEffect(() => {
    fetchReplies();
  }, []);  // Empty dependency array ensures this runs only once on mount

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async () => {
    try {
      const response = await fetch(`http://150.136.47.221:5000/api/discussions/${discussion.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: reply }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reply created successfully:', data);
        setReply('');
        fetchReplies();  // Refresh replies after successfully posting a new one
      } else {
        console.error('Error creating reply:', response.status);
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  return (
    <div className="discussion-popup">
      <div className="discussion-popup-content">
        <div className="discussion-popup-header">
          <h2>{discussion.title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="discussion-popup-body">
          <div className="discussion-details">
            <p className="discussion-category">Category: {discussion.category}</p>
            <p>{discussion.content}</p>
          </div>
          <div className="discussion-images">
              {discussion.images.map((base64Image, index) => (
                  <img key={index} src={`${base64Image}`} alt={`Discussion image ${index + 1}`} />
              ))}
          </div>
          <div className="reply-section">
            <textarea
              value={reply}
              onChange={handleReplyChange}
              placeholder="Write a reply..."
              className="reply-textarea"
            ></textarea>
            <button onClick={handleReplySubmit}>Reply</button>
          </div>
          <div className="discussion-replies">
            <h3>Replies</h3>
            {replies.map((reply) => (
              <div key={reply.id} className="reply">
                <p>{reply.content}</p>
                <p className="reply-timestamp">{new Date(reply.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPopup;