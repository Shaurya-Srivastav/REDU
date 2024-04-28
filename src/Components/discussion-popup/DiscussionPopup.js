import React, { useState } from 'react';
import './DiscussionPopup.css';

const DiscussionPopup = ({ discussion, onClose }) => {
  const [reply, setReply] = useState('');

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
        // Optionally, you can refresh the discussion details to show the new reply
        // You can call a function here to fetch the updated discussion data and update the state
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
          {discussion.images && (
            <div className="discussion-images">
              {discussion.images.map((base64Image, index) => (
                <img key={index} src={base64Image} alt={`Discussion image ${index + 1}`} />
              ))}
            </div>
          )}
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
            {discussion.replies && discussion.replies.map((reply) => (
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