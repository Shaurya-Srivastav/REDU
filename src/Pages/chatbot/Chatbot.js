import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import './Chatbot.css';
import profileImage from '../../Assets/profile-placeholder.jpeg';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const navigate = useNavigate();
  const chatMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    window.location.reload(); // Reload the page
  };

  const handleDeleteChatSession = async (chatId) => {
    try {
      await fetch(`http://150.136.47.221:5000/api/delete-chat-session/${chatId}`, {
        method: 'DELETE',
      });
      fetchChatSessions(); // Fetch the updated chat sessions after deletion
      setSelectedChatId(null); // Reset the selected chat ID
      setMessages([]); // Clear the messages
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const handleChatHistoryItemClick = async (chatId) => {
    console.log('Selected chat ID in handleChatHistoryItemClick:', chatId);
    setSelectedChatId(chatId);
    await fetchChatHistory(chatId);
  };

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    try {
      const response = await fetch('http://150.136.47.221:5000/api/chat-sessions');
      const data = await response.json();
      setChatSessions(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await fetch(`http://150.136.47.221:5000/api/chat-history/${chatId}`);
      console.log('Response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Chat history data:', data);
        const chatMessages = data.map((message, index) => [
          {
            id: index * 2 + 1,
            text: message.user_message,
            isUser: true,
          },
          {
            id: index * 2 + 2,
            text: message.bot_response,
            isUser: false,
          },
        ]).flat();
        console.log('Chat messages:', chatMessages);
        setMessages(chatMessages);
      } else {
        console.error('Error fetching chat history:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        let chatId = selectedChatId;

        if (!selectedChatId) {
          const newChatSessionResponse = await fetch('http://150.136.47.221:5000/api/new-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_name: inputMessage.split(' ').slice(0, 3).join(' ') }),
          });

          const newChatSession = await newChatSessionResponse.json();
          setChatSessions((prevSessions) => [newChatSession, ...prevSessions]);
          setSelectedChatId(newChatSession.id);
          chatId = newChatSession.id;
        }

        console.log('Selected chat ID before /api/chatbot request:', chatId);

        const response = await fetch('http://150.136.47.221:5000/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage, selectedChatId: chatId }),
        });

        const data = await response.json();
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          isUser: false,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);

        await fetch('http://150.136.47.221:5000/api/update-chat-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedChatId: chatId,
            userMessage: inputMessage,
            botResponse: data.response,
          }),
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleBookClick = () => {
    navigate('/books');
  };

  const handleDiscussionClick = () => {
    navigate('/discussion');
  };

  const handleClearHistory = async () => {
    try {
      await fetch('http://150.136.47.221:5000/api/clear-all-history', {
        method: 'DELETE',
      });
      setMessages([]);
      setChatSessions([]);
      setSelectedChatId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="logo">REDU</div>
        <ul>
          <li onClick={handleDashboardClick}>Dashboard</li>
          <li onClick={handleBookClick}>Books</li>
          <li onClick={handleDiscussionClick}>Discussion Board</li>
        </ul>
        <img src={profileImage} alt="Profile" className="profile-image" />
      </div>
      <div className="chatbot-main">
        <div className="chat-history-sidebar">
          <button className="new-chat-button" onClick={handleNewChat}>
            New Chat
          </button>
          <button className="clear-history-button" onClick={handleClearHistory}>
            Clear History
          </button>

          <br></br>
          <br></br>
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`chat-history-item ${selectedChatId === session.id ? 'active' : ''}`}
              onClick={() => handleChatHistoryItemClick(session.id)}
            >
              <div className="chat-history-item-title">
                {session.session_name}...
              </div>
              <div className="chat-history-item-date">
                {new Date(session.timestamp).toLocaleDateString()}
              </div>
              <div className="chat-history-item-delete" onClick={() => handleDeleteChatSession(session.id)}>
                <FaTrashAlt />
              </div>
            </div>
          ))}
        </div>
        <div className="chat-window">
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

export default Chatbot;