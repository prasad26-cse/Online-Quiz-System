import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/quizzes/${quizId}/questions`)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, [quizId]);

  return (
    <div>
      <h2>Attempt Quiz</h2>
      {questions.length > 0 ? (
        questions.map((q, index) => (
          <div key={index}>
            <p>{q.text}</p>
            {/* Render options if available */}
            {q.options && q.options.map((option, idx) => (
              <div key={idx}>
                <input type="radio" name={`question-${index}`} value={option} />
                <label>{option}</label>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default QuizAttempt;
