import React, { useState, useEffect } from 'react';
import './PracticeQuestionsModal.css';

const PracticeQuestionsModal = ({ book, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState({});

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        const response = await fetch('http://150.136.47.221:5000/api/generate-practice-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pageText: book.Page_Text }),
        });
        const data = await response.json();
        setQuestions(data.questions || []); // Set questions to an empty array if data.questions is undefined
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };

    generateQuestions();
  }, [book.Page_Text]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitAnswer = async (questionId) => {
    setLoadingQuestions((prevLoadingQuestions) => ({
      ...prevLoadingQuestions,
      [questionId]: true,
    }));

    try {
      const response = await fetch('http://150.136.47.221:5000/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          answer: answers[questionId],
          pageText: book.Page_Text,
        }),
      });
      const data = await response.json();
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [questionId]: data.feedback,
      }));
    } catch (error) {
      console.error('Error:', error);
    }

    setLoadingQuestions((prevLoadingQuestions) => ({
      ...prevLoadingQuestions,
      [questionId]: false,
    }));
  };

  return (
    <div className="practice-questions-modal-overlay">
      <div className="practice-questions-modal">
        <div className="practice-questions-modal-header">
          <h2>Practice Questions</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="practice-questions-modal-body">
          {isLoading ? (
            <div className="loading-animation">
              <div className="loading-spinner"></div>
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="practice-questions-list">
              {questions.map((question, index) => (
                <div key={question.id} className="practice-question">
                  <p>{`${question.text}`}</p>
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                  <button onClick={() => handleSubmitAnswer(question.id)}>Submit</button>
                  {loadingQuestions[question.id] ? (
                    <div className="loading-animation">
                      <div className="loading-spinner"></div>
                    </div>
                  ) : feedback[question.id] ? (
                    <p className="feedback">{feedback[question.id]}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p>No practice questions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestionsModal;