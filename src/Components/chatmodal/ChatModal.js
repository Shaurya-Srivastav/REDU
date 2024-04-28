import React, { useState, useEffect, useRef } from 'react';
import './ChatModal.css';

const ChatModal = ({ book, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(e);
    }
  };

  
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        isUser: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');

      try {
        const response = await fetch('http://150.136.47.221:5000/api/chatbot-page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage, bookId: book.id, pageText: book.Page_Text }),
        });

        const data = await response.json();
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          isUser: false,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-modal-header">
          <h2>Chat With Page</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="chat-modal-body">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-text">
                  {message.text && message.text.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            <div ref={chatMessagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage}>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;