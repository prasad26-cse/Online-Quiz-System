// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Container, Card, Button, Form, ProgressBar, Spinner, Navbar } from "react-bootstrap";
// import axios from "axios";

// const QuizPage = () => {
//     const { quizId } = useParams();
//     const navigate = useNavigate();
//     const [questions, setQuestions] = useState([]);
//     const [selectedAnswers, setSelectedAnswers] = useState({});
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [score, setScore] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [timeLeft, setTimeLeft] = useState(null);
//     const [quizFinished, setQuizFinished] = useState(false);
//     const [quizStarted, setQuizStarted] = useState(false); 

//     useEffect(() => {
//         if (!quizId) {
//             setError("Quiz ID is missing! Please check your URL.");
//             setLoading(false);
//             return;
//         }

//         axios.get(`http://localhost:8000/quizzes/${quizId}/questions`)
//             .then((response) => {
//                 const fetchedQuestions = response.data.questions || [];
//                 setQuestions(fetchedQuestions);
//                 setLoading(false);

//                 if (fetchedQuestions.length > 0 && fetchedQuestions[0].duration) {
//                     setTimeLeft(fetchedQuestions[0].duration * 60);
//                 } else {
//                     setTimeLeft(5 * 60);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching questions:", error);
//                 setError("Failed to load quiz questions. Please try again later.");
//                 setLoading(false);
//             });
//     }, [quizId]);

//     useEffect(() => {
//         if (timeLeft !== null && timeLeft > 0 && !isSubmitted) {
//             const timer = setInterval(() => {
//                 setTimeLeft((prevTime) => prevTime - 1);
//             }, 1000);
//             return () => clearInterval(timer);
//         }
//         if (timeLeft === 0 && !isSubmitted) {
//             handleSubmit();
//         }
//     }, [timeLeft, isSubmitted]);

//     const handleOptionChange = (questionId, option) => {
//         if (!isSubmitted) {
//             setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
//         }
//     };

//     const handleSubmit = async () => {
//         let correctCount = questions.reduce(
//             (count, q) => count + (selectedAnswers[q.id] === q.correct_option ? 1 : 0),
//             0
//         );
//         setScore(correctCount);
//         setIsSubmitted(true);
//         setQuizFinished(true);
    
//         // ✅ Store Quiz Result in Database
//         try {
//             await axios.post("http://localhost:8000/participation", {
//                 user_name: "Test User",  // Change this dynamically if you have authentication
//                 quiz_id: quizId,
//                 score: correctCount
//             });
//         } catch (error) {
//             console.error("❌ Error saving quiz participation:", error);
//         }
//     };
    

//     const handleRetake = () => {
//         setSelectedAnswers({});
//         setIsSubmitted(false);
//         setScore(0);
//         setTimeLeft(questions.length > 0 ? questions[0].duration * 60 : 5 * 60);
//         setQuizFinished(false);
//         setQuizStarted(false);
//     };

//     const handleStartQuiz = () => {
//         if (questions.length > 0) {
//             setQuizStarted(true);
//         } else {
//             alert("No questions available to start the quiz.");
//         }
//     };

//     return (
//         <Container className={`mt-4 ${quizFinished ? "bg-secondary text-white" : "bg-dark text-info"} p-4`}>
            
//             {/* ✅ Top Navbar with Home Button */}
//             <Navbar bg="dark" variant="dark" className="mb-4 p-3 d-flex justify-content-between">
//                 <Navbar.Brand>Quiz Page</Navbar.Brand>
//                 <Button variant="light" onClick={() => navigate("/home")}>🏠 Home</Button>
//             </Navbar>

//             <Card className="p-4 shadow-lg">
//                 <h2 className="text-center mb-4">Quiz Questions</h2>

//                 {!quizStarted && !loading && !error && (
//                     <div className="text-center mb-3">
//                         <Button variant="success" size="lg" onClick={handleStartQuiz}>
//                             Start Quiz
//                         </Button>
//                     </div>
//                 )}

//                 {quizStarted && !quizFinished && (
//                     <div className="text-center mb-3">
//                         <h5 className="bg-warning text-dark p-2 d-inline-block rounded">
//                             Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
//                         </h5>
//                     </div>
//                 )}

//                 {loading && (
//                     <div className="text-center">
//                         <Spinner animation="border" variant="light" />
//                         <p>Loading quiz...</p>
//                     </div>
//                 )}

//                 {error && <p className="text-danger text-center">{error}</p>}

//                 {quizStarted && !loading && !error && (
//                     questions.length > 0 ? (
//                         questions.map((q) => (
//                             <Card key={q.id} className="mb-3 p-3 bg-secondary text-light">
//                                 <Card.Body>
//                                     <Card.Title className="mb-3">{q.text}</Card.Title>
//                                     <Form>
//                                         {[q.option1, q.option2, q.option3, q.option4].map((option, index) => (
//                                             <Form.Check
//                                                 key={index}
//                                                 type="radio"
//                                                 label={option}
//                                                 name={`question-${q.id}`}
//                                                 value={option}
//                                                 className="mb-2"
//                                                 checked={selectedAnswers[q.id] === option}
//                                                 onChange={() => handleOptionChange(q.id, option)}
//                                                 disabled={isSubmitted}
//                                             />
//                                         ))}
//                                     </Form>
//                                 </Card.Body>
//                             </Card>
//                         ))
//                     ) : (
//                         <p className="text-warning text-center">No questions available.</p>
//                     )
//                 )}

//                 {!loading && !error && (
//                     <div className="text-center">
//                         {!isSubmitted ? (
//                             <>
//                                 <Button variant="primary" size="lg" className="me-3" onClick={handleSubmit} disabled={questions.length === 0}>
//                                     Submit Quiz
//                                 </Button>
//                                 <Button variant="danger" size="lg" onClick={handleSubmit} disabled={questions.length === 0}>
//                                     Finish Quiz
//                                 </Button>
//                             </>
//                         ) : (
//                             <>
//                                 <h4 className="mt-4">
//                                     Your Score: {score} / {questions.length}
//                                 </h4>
//                                 <ProgressBar
//                                     now={(score / questions.length) * 100}
//                                     label={`${Math.round((score / questions.length) * 100)}%`}
//                                     className="mt-3"
//                                     variant="success"
//                                 />
//                                 <Button variant="warning" className="mt-3" onClick={handleRetake}>
//                                     Retake Quiz
//                                 </Button>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </Card>
//         </Container>
//     );
// };

// export default QuizPage;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Button, Form, ProgressBar, Spinner, Navbar } from "react-bootstrap";
import axios from "axios";

const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false); 
    const userId = 1; // Change this to dynamic user ID when authentication is implemented

    useEffect(() => {
        if (!quizId) {
            setError("Quiz ID is missing! Please check your URL.");
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:8000/quizzes/${quizId}/questions`)
            .then((response) => {
                const fetchedQuestions = response.data.questions || [];
                setQuestions(fetchedQuestions);
                setLoading(false);

                if (fetchedQuestions.length > 0 && fetchedQuestions[0].duration) {
                    setTimeLeft(fetchedQuestions[0].duration * 60);
                } else {
                    setTimeLeft(5 * 60);
                }
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                setError("Failed to load quiz questions. Please try again later.");
                setLoading(false);
            });
    }, [quizId]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted]);

    const handleOptionChange = (questionId, option) => {
        if (!isSubmitted) {
            setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
        }
    };

    const handleSubmit = async () => {
        let correctCount = questions.reduce(
            (count, q) => count + (selectedAnswers[q.id] === q.correct_option ? 1 : 0),
            0
        );
    
        setScore(correctCount);
        setIsSubmitted(true);
        setQuizFinished(true);
    
        // ✅ Get logged-in user from local storage (Assuming username is stored)
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (!user || !user.name) {
            alert("User not found! Please login.");
            return;
        }
    
        // ✅ Send participation data with user_name
        try {
            await axios.post("http://localhost:8000/participation/", {
                user_name: user.name,
                quiz_id: quizId,
                score: correctCount
            });
    
            alert("Quiz participation saved successfully!");
        } catch (error) {
            console.error("❌ Error saving quiz participation:", error);
        }
    };
    
    const handleRetake = () => {
        setSelectedAnswers({});
        setIsSubmitted(false);
        setScore(0);
        setTimeLeft(questions.length > 0 ? questions[0].duration * 60 : 5 * 60);
        setQuizFinished(false);
        setQuizStarted(false);
    };

    const handleStartQuiz = () => {
        if (questions.length > 0) {
            setQuizStarted(true);
        } else {
            alert("No questions available to start the quiz.");
        }
    };

    return (
        <Container className={`mt-4 ${quizFinished ? "bg-secondary text-white" : "bg-dark text-info"} p-4`}>
            
            {/* ✅ Top Navbar with Home Button */}
            <Navbar bg="dark" variant="dark" className="mb-4 p-3 d-flex justify-content-between">
                <Navbar.Brand>Quiz Page</Navbar.Brand>
                <Button variant="light" onClick={() => navigate("/home")}>🏠 Home</Button>
            </Navbar>

            <Card className="p-4 shadow-lg">
                <h2 className="text-center mb-4">Quiz Questions</h2>

                {!quizStarted && !loading && !error && (
                    <div className="text-center mb-3">
                        <Button variant="success" size="lg" onClick={handleStartQuiz}>
                            Start Quiz
                        </Button>
                    </div>
                )}

                {quizStarted && !quizFinished && (
                    <div className="text-center mb-3">
                        <h5 className="bg-warning text-dark p-2 d-inline-block rounded">
                            Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                        </h5>
                    </div>
                )}

                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" variant="light" />
                        <p>Loading quiz...</p>
                    </div>
                )}

                {error && <p className="text-danger text-center">{error}</p>}

                {quizStarted && !loading && !error && (
                    questions.length > 0 ? (
                        questions.map((q) => (
                            <Card key={q.id} className="mb-3 p-3 bg-secondary text-light">
                                <Card.Body>
                                    <Card.Title className="mb-3">{q.text}</Card.Title>
                                    <Form>
                                        {[q.option1, q.option2, q.option3, q.option4].map((option, index) => (
                                            <Form.Check
                                                key={index}
                                                type="radio"
                                                label={option}
                                                name={`question-${q.id}`}
                                                value={option}
                                                className="mb-2"
                                                checked={selectedAnswers[q.id] === option}
                                                onChange={() => handleOptionChange(q.id, option)}
                                                disabled={isSubmitted}
                                            />
                                        ))}
                                    </Form>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="text-warning text-center">No questions available.</p>
                    )
                )}

                {!loading && !error && (
                    <div className="text-center">
                        {!isSubmitted ? (
                            <>
                                <Button variant="primary" size="lg" className="me-3" onClick={handleSubmit} disabled={questions.length === 0}>
                                    Submit Quiz
                                </Button>
                                <Button variant="danger" size="lg" onClick={handleSubmit} disabled={questions.length === 0}>
                                    Finish Quiz
                                </Button>
                            </>
                        ) : (
                            <>
                                <h4 className="mt-4">
                                    Your Score: {score} / {questions.length}
                                </h4>
                                <ProgressBar
                                    now={(score / questions.length) * 100}
                                    label={`${Math.round((score / questions.length) * 100)}%`}
                                    className="mt-3"
                                    variant="success"
                                />
                                <Button variant="warning" className="mt-3" onClick={handleRetake}>
                                    Retake Quiz
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default QuizPage;
