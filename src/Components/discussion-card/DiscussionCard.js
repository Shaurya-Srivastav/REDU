// DiscussionCard.js
import React from 'react';
import './DiscussionCard.css';

const DiscussionCard = ({ discussion, onDiscussionClick }) => {
  const getFirstTwoSentences = (text) => {
    const sentences = text.split('. ');
    return sentences.slice(0, 2).join('. ') + '.';
  };

  return (
    <div className="discussion-card" onClick={() => onDiscussionClick(discussion)}>
      <h3 className="discussion-title">{discussion.title}</h3>
      <p className="discussion-category">{discussion.category}</p>
      <p className="discussion-excerpt">{getFirstTwoSentences(discussion.content)}</p>
    </div>
  );
};

export default DiscussionCard;