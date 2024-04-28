// Preference.js
import React, { useState } from 'react';
import './Preference.css';

const Preference = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit the form data to the server or perform any necessary actions
    console.log('Form submitted:', { name, country, language, photo });
  };

  return (
    <div className="preference-container">
      <h2 className="preference-title">Set Preferences</h2>
      <form className="preference-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Preferred Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
            placeholder="Enter your preferred name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={handleCountryChange}
            required
            placeholder="Enter your country"
          />
        </div>
        <div className="form-group">
          <label htmlFor="language">Preferred Language </label>
          <select id="language" value={language} onChange={handleLanguageChange} required>
            <option value="">Select a language</option>
            {/* Add language options here */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="photo">Account Photo</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        <button type="submit" className="submit-button">Save Preferences</button>
      </form>
    </div>
  );
};

export default Preference;