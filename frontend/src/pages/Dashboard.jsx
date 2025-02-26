import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Modal, Container } from "react-bootstrap";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newScore, setNewScore] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");

  // Fetch quizzes from the backend
  useEffect(() => {
    axios.get("http://localhost:8000/quizzes/")
      .then(response => setQuizzes(response.data.quizzes || []))
      .catch(error => console.error("Error fetching quizzes:", error));
  }, []);

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setNewTitle(quiz.title);
    setNewDescription(quiz.description || "");
    setNewDuration(quiz.duration);
    setNewScore(quiz.score);
    setQuestions(quiz.questions || []);
    setShowModal(true);
  };

  const handleSave = () => {
    const updatedQuiz = {
      id: selectedQuiz ? selectedQuiz.id : Date.now(),
      title: newTitle,
      description: newDescription,
      duration: newDuration,
      score: newScore,
      questions,
    };

    if (selectedQuiz) {
      // Update existing quiz
      axios.put(`http://localhost:8000/quizzes/${selectedQuiz.id}`, updatedQuiz)
        .then(() => {
          // Update the quizzes state with the updated quiz
          setQuizzes(quizzes.map(q => q.id === selectedQuiz.id ? updatedQuiz : q));
          setShowModal(false);
        })
        .catch(error => {
          console.error("Error updating quiz:", error);
          alert(`Error updating quiz: ${error.response ? error.response.data : error.message}`);
        });
    } else {
      // Create new quiz
      axios.post("http://localhost:8000/quizzes/", updatedQuiz)
        .then(response => {
          setQuizzes([...quizzes, response.data]);
          setShowModal(false);
        })
        .catch(error => {
          console.error("Error creating quiz:", error);
          alert(`Error creating quiz: ${error.response ? error.response.data : error.message}`);
        });
    }
  };

  const addQuestion = () => {
    if (!newQuestion || !correctOption || newOptions.some((opt) => opt === "")) {
      alert("Please complete all fields before adding a question.");
      return;
    }
    setQuestions([...questions, { text: newQuestion, option1: newOptions[0], option2: newOptions[1], option3: newOptions[2], option4: newOptions[3], correct_option: correctOption }]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setCorrectOption("");
  };

  const handleViewQuestions = async (quiz) => {
    setSelectedQuiz(quiz);

    try {
      const response = await axios.get(`http://localhost:8000/quizzes/${quiz.id}/questions`);
      const fetchedQuestions = response.data.questions || [];  // Ensure it's always an array

      console.log("Fetched Questions:", fetchedQuestions);  // Debugging

      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    }

    setShowQuestionsModal(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/quizzes/${quizId}`);
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
      alert("Quiz deleted successfully!");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Admin Dashboard</h3>
        <div>
          <Button variant="success" onClick={() => navigate("/home")} className="me-2">Home</Button>
          <Button variant="primary" onClick={() => { setSelectedQuiz(null); setShowModal(true); }}>Create Quiz</Button>
        </div>
      </div>
      
      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Quiz</th>
            <th>Duration (min)</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.title}</td>
              <td>{quiz.duration}</td>
              <td>{quiz.score}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(quiz)}>Edit</Button>{" "}
                <Button variant="info" size="sm" onClick={() => handleViewQuestions(quiz)}>View Questions</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Questions Modal */}
      <Modal show={showQuestionsModal} onHide={() => setShowQuestionsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Questions for {selectedQuiz ? selectedQuiz.title : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {questions.length === 0 ? (
            <p className="text-center text-danger">No questions available for this quiz.</p>
          ) : (
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Question</th>
                  <th>Options</th>
                  <th>Correct Option</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr key={index}>
                    <td>{q.text}</td>
                    <td>{q.option1}, {q.option2}, {q.option3}, {q.option4}</td>
                    <td>{q.correct_option}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuestionsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit/Create Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedQuiz ? "Edit Quiz" : "Create Quiz"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Quiz Title</Form.Label>
              <Form.Control type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration (min)</Form.Label>
              <Form.Control type="number" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Score</Form.Label>
              <Form.Control type="text" value={newScore} onChange={(e) => setNewScore(e.target.value)} />
            </Form.Group>

            <hr />
            <h5>Add Questions</h5>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
            </Form.Group>
            {newOptions.map((opt, index) => (
              <Form.Group key={index} className="mb-2">
                <Form.Label>Option {index + 1}</Form.Label>
                <Form.Control type="text" value={opt} onChange={(e) => {
                  const updatedOptions = [...newOptions];
                  updatedOptions[index] = e.target.value;
                  setNewOptions(updatedOptions);
                }} />
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Label>Correct Option</Form.Label>
              <Form.Control type="text" value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} />
            </Form.Group>
            <Button variant="info" onClick={addQuestion} className="mb-3">Add Question</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;