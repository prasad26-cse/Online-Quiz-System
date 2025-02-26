
![image](https://github.com/user-attachments/assets/bd44a0bc-3588-4204-97c0-54d7138e5cd4)
![image](https://github.com/user-attachments/assets/a46e90f1-8c32-421b-a270-8226fac962d1)
![image](https://github.com/user-attachments/assets/eed71f55-99b7-4c5c-b026-fee6f6582465)
![image](https://github.com/user-attachments/assets/294fd9f4-41eb-4484-ae7e-c97bd1811825)
![image](https://github.com/user-attachments/assets/c9ffa457-277a-49cf-807f-bd552e5dfd02)


# 📌 Online Quiz System
**FastAPI + MySQL + React.js** based Online Quiz System that allows users to take quizzes, and admins to create/manage quizzes.

---

## 🚀 Tech Stack
- **Backend:** FastAPI, SQLAlchemy, MySQL  
- **Frontend:** React.js, Tailwind CSS  
- **Database:** MySQL  
- **Authentication:** JWT (JSON Web Tokens)  
- **Rate Limiting:** SlowAPI (100 requests/sec per user)  
- **Version Control:** Git & GitHub  

---

## 📋 Features
✅ **User Authentication** (JWT-based login/logout)  
✅ **Quiz Management** (Create, Update, Delete quizzes)  
✅ **Quiz Attempt** (Start and submit quizzes)  
✅ **Admin Panel** (Manage users and track quiz attempts)  
✅ **Database Schema for Questions, Options, Users, and Quizzes**  
✅ **Rate Limiting** (Prevents excessive API requests)  

---

## 🛠 Prerequisites
Make sure you have the following installed:  
- **Python 3.8+**  
- **Node.js 16+**  
- **MySQL Server**  
- **Git**  

---

## 📌 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/prasad26-cse/Online-Quiz-System.git
cd Online-Quiz-System
```

## Database Used
- **Database:** MySQL  
- **ORM:** SQLAlchemy (For FastAPI)  
- **Authentication:** JWT (Stored securely in backend)  


## Database Setup
### 1️⃣ Install MySQL Server
Ensure **MySQL Server** is installed on your system. You can download it from:  
🔗 [Download MySQL](https://dev.mysql.com/downloads/installer/)

---

### 2️⃣ Start MySQL Server
Start the MySQL server and log in:
```sh
mysql -u root -p
```
-- 📌 Create Database
CREATE DATABASE quiz_system;
USE quiz_system;

-- 1️⃣ Create Users Table
CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

-- 🔹 Insert Sample Users
INSERT INTO users (username, password_hash, is_admin) VALUES
('admin', 'hashed_password_here', TRUE),
('user1', 'hashed_password_here', FALSE);

-- 2️⃣ Create Quizzes Table
CREATE TABLE quizzes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    total_questions INT NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY (id)
);

-- 🔹 Insert Sample Quizzes
INSERT INTO quizzes (title, total_questions, duration) VALUES
('JavaScript Basics', 10, 15),
('Python Fundamentals', 12, 20);

-- 3️⃣ Create Questions Table
CREATE TABLE questions (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    quiz_id INT UNSIGNED NOT NULL,
    question TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 🔹 Insert Sample Questions
INSERT INTO questions (quiz_id, question) VALUES
(1, 'What does CSS stand for?'),
(1, 'Which HTTP status code means "Not Found"?'),
(2, 'Who invented Java?');

-- 4️⃣ Create Question Options Table
CREATE TABLE question_options (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    question_id INT UNSIGNED NOT NULL,
    option_text TEXT NOT NULL,
    is_correct TINYINT UNSIGNED DEFAULT '0',
    PRIMARY KEY (id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);
#
-- 🔹 Insert Sample Options
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(1, 'Computer Style Sheets', 0),
(1, 'Creative Style Sheets', 0),
(1, 'Cascading Style Sheets', 1),
(1, 'Colorful Style Sheets', 0),
(2, '404', 1),
(2, '500', 0),
(2, '200', 0),
(2, '301', 0);
#
-- 5️⃣ Create Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    quiz_id INT UNSIGNED NOT NULL,
    score INT DEFAULT 0,
    status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
#
-- 🔹 Insert Sample Quiz Attempts
INSERT INTO quiz_attempts (user_id, quiz_id, score, status) VALUES
(2, 1, 8, 'completed'),
(2, 2, 10, 'in_progress');

#
-- 6️⃣ Create Responses Table
CREATE TABLE responses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    attempt_id INT UNSIGNED NOT NULL,
    question_id INT UNSIGNED NOT NULL,
    chosen_option_id INT UNSIGNED,
    is_correct BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (chosen_option_id) REFERENCES question_options(id) ON DELETE CASCADE
);

-- 🔹 Insert Sample Responses
INSERT INTO responses (attempt_id, question_id, chosen_option_id, is_correct) VALUES
(1, 1, 3, 1),
(1, 2, 1, 1),
(2, 3, 2, 0);
-- 📌 Create Database
CREATE DATABASE quiz_system;
USE quiz_system;
#
-- 1️⃣ Create Users Table
CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

-- 🔹 Insert Sample Users
INSERT INTO users (username, password_hash, is_admin) VALUES
('admin', 'hashed_password_here', TRUE),
('user1', 'hashed_password_here', FALSE);

#
-- 2️⃣ Create Quizzes Table
CREATE TABLE quizzes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    total_questions INT NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY (id)
);

#

-- 🔹 Insert Sample Quizzes
INSERT INTO quizzes (title, total_questions, duration) VALUES
('JavaScript Basics', 10, 15),
('Python Fundamentals', 12, 20);

-- 3️⃣ Create Questions Table
CREATE TABLE questions (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    quiz_id INT UNSIGNED NOT NULL,
    question TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 🔹 Insert Sample Questions
INSERT INTO questions (quiz_id, question) VALUES
(1, 'What does CSS stand for?'),
(1, 'Which HTTP status code means "Not Found"?'),
(2, 'Who invented Java?');

-- 4️⃣ Create Question Options Table
CREATE TABLE question_options (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    question_id INT UNSIGNED NOT NULL,
    option_text TEXT NOT NULL,
    is_correct TINYINT UNSIGNED DEFAULT '0',
    PRIMARY KEY (id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 🔹 Insert Sample Options
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(1, 'Computer Style Sheets', 0),
(1, 'Creative Style Sheets', 0),
(1, 'Cascading Style Sheets', 1),
(1, 'Colorful Style Sheets', 0),
(2, '404', 1),
(2, '500', 0),
(2, '200', 0),
(2, '301', 0);

-- 5️⃣ Create Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    quiz_id INT UNSIGNED NOT NULL,
    score INT DEFAULT 0,
    status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 🔹 Insert Sample Quiz Attempts
INSERT INTO quiz_attempts (user_id, quiz_id, score, status) VALUES
(2, 1, 8, 'completed'),
(2, 2, 10, 'in_progress');

-- 6️⃣ Create Responses Table
CREATE TABLE responses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    attempt_id INT UNSIGNED NOT NULL,
    question_id INT UNSIGNED NOT NULL,
    chosen_option_id INT UNSIGNED,
    is_correct BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (chosen_option_id) REFERENCES question_options(id) ON DELETE CASCADE
);

-- 🔹 Insert Sample Responses
INSERT INTO responses (attempt_id, question_id, chosen_option_id, is_correct) VALUES
(1, 1, 3, 1),
(1, 2, 1, 1),
(2, 3, 2, 0);
