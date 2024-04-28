// NewDiscussionModal.js
import React, { useState } from 'react';
import './NewDiscussionModal.css';

const NewDiscussionModal = ({ onSubmit, onClose, categories }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const readers = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      readers.push(new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      }));
    });

    Promise.all(readers).then(imagesBase64 => {
      setImages(imagesBase64);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      category_id: categories.indexOf(category) + 1,
      content,
      images
    };

    try {
      const response = await fetch('http://150.136.47.221:5000/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Discussion created successfully:', data);
        onSubmit();
        resetForm();
      } else {
        console.error('Error creating discussion:', response.status);
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setContent('');
    setImages([]);
  };

  return (
    <div className="new-discussion-modal-overlay">
      <div className="new-discussion-modal-container">
        <div className="new-discussion-modal-header">
          <h2>Post a New Discussion</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="new-discussion-modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="content">Discussion</label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              required
              rows="8"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-upload"></i> Choose Files
              </label>
              <input
                type="file"
                id="image-upload"
                multiple
                onChange={handleImageUpload}
                className="image-upload-input"
              />
              <span className="image-upload-text">No file chosen</span>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionModal;