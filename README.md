# QuizForge — Turn Your Notes into Quizzes

**QuizForge is a simple and user-friendly study application that converts uploaded lecture notes into multiple-choice quizzes to help students prepare for exams more effectively.**

Live Demo: https://kubrashams.github.io/quizforge/ 
Demo Video:** Coming Soon

---

## 📌 Problem Statement

Students often have lengthy lecture notes and limited time to prepare for examinations. Creating practice questions manually is time-consuming and makes revision difficult.

QuizForge addresses this problem by providing a simple way to turn study notes into practice quizzes.

##  Our Solution

QuizForge allows students to upload their lecture notes, select a subject and quiz settings, and generate multiple-choice questions for quick and convenient practice.

##  Features (MVP)

### 1. Upload Notes
- Upload notes in PDF, DOCX, and TXT formats.
- Extract text from uploaded documents.
- Simple file upload interface.

### 2.  Generate Quiz
- Select from four subjects:
  - Machine Learning
  - Database
  - Artificial Intelligence
  - Compiler Construction
- Choose quiz difficulty.
- Select the desired number of questions.
- Generate multiple-choice questions from uploaded notes.

### 3.  Results and Answer Review
- Answer MCQs interactively.
- Get immediate feedback on answers.
- View final score and percentage.
- Review correct answers.
- Try the quiz again.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML | Application structure |
| CSS | Styling and responsive interface |
| JavaScript | Quiz generation and application logic |
| PDF.js | Extracting text from PDF files |
| Mammoth.js | Extracting text from DOCX files |
| GitHub | Version control and collaboration |
| GitHub Pages | Website deployment |

**Note:** The current quiz generator uses JavaScript-based keyword extraction and question generation. It does not currently connect to an external AI model or API.

## 🚀 How to Run Locally

Follow these steps to run QuizForge on your computer:

1. Clone or download this repository.
2. Open the `quizforge` folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Open `index.html`.
5. Right-click and select **Open with Live Server**.
6. Select a subject.
7. Upload your PDF, DOCX, or TXT notes.
8. Choose the difficulty and question count.
9. Click **Generate Quiz** and start practicing!

**Requirements:**
- A modern web browser.
- Internet connection for loading PDF.js and Mammoth.js libraries through CDN.
- Visual Studio Code with Live Server for local development.

## 👥 Team Members

**Team Name:** QuizForge Team

| Name | Student ID | Role |
|---|---|---|
| Kubra Shams | 023-24-0004 | Product Lead / Frontend |
| Kanwal Gul | 023-24-0001 | Frontend / UI |
| Sineha Kumari | 023-24-0024 | Logic / Testing |

## 🤖 AI Log

AI tools were used as development assistants. Their suggestions were tested and adjusted during implementation.

| AI Tool | What We Used It For | What It Got Wrong / What We Fixed |
|---|---|---|
| ChatGPT | JavaScript quiz generation | An earlier version generated fewer questions than the selected count. We improved the question-generation logic and added validation for insufficient content. |
| ChatGPT | Question display and formatting | Generated questions were too long. We adjusted the question text to make it shorter and easier to read. |
| ChatGPT | Quiz navigation and result functionality | The Try Again button did not restart the quiz correctly. We updated the retry functionality to generate a new quiz. |
| ChatGPT | HTML and CSS interface improvements | We aligned the CSS classes with the JavaScript-generated quiz elements to improve the interface consistency. |

## 🖼️ Application Screenshots
### Home Page
![alt text](image-1.png)
### Quiz Interface
![alt text](image-2.png)

### Quiz Results
![alt text](image-3.png)

## 📝 Individual Reflection

### Kubra Shams
**What I personally built and learned:**  
I worked on the JavaScript part of QuizForge, including subject selection, notes upload functionality, and quiz generation. I learned how JavaScript makes a web application interactive and how to handle user input, generate questions, and debug problems during development.

**Where AI helped and where it misled me:**  
AI helped me write code faster, understand errors, and improve the application. However, some initial code generated fewer questions than selected, and some questions were too long. I tested the application, identified these issues, and improved the code.

**What I would change about our teamwork:**  
I would divide tasks more clearly from the beginning, test each feature earlier, and communicate progress more frequently to make better use of hackathon time.

### Kanwal Gul
**What I personally built and learned:**  
I contributed to the HTML structure of QuizForge, including organizing the page elements and creating the basic structure of the user interface. I learned how HTML provides the foundation of a web application and how proper page structure improves usability.

**Where AI helped and where it misled me:**  
AI helped us brainstorm ideas and speed up development, but its initial suggestions sometimes needed testing, correction, and improvement before they worked as expected.

**What I would change about our teamwork:**  
I would plan tasks in advance, assign responsibilities clearly, and make sure every team member contributes code and tests their part.

### Sineha Kumari
**What I personally built and learned:**  
I contributed to the CSS styling of QuizForge, including the visual appearance, layout, and presentation of the application. I learned how CSS works with HTML to create a user-friendly interface and how styling can improve the overall user experience.

**Where AI helped and where it misled me:**  
AI helped us with coding suggestions and troubleshooting. I learned that AI-generated code should always be checked, tested, and understood instead of blindly accepting it.

**What I would change about our teamwork:**  
I would improve coordination between team members, divide the workload efficiently, and keep testing and communication consistent throughout the project.
## 🔮 Future Improvements

We plan to improve QuizForge with the following features:

- More intelligent question generation using advanced language processing.
- Better context-based MCQs and relevant answer options.
- Quiz history and performance tracking.
- More question types, such as True/False.
- Improved user experience and interface animations.
- User accounts and saved quiz results.

## 📚 Learning Outcomes

Through this project, we gained practical experience in:

- Building a web application using HTML, CSS, and JavaScript.
- Extracting text from different document formats.
- Implementing interactive quiz functionality.
- Debugging and improving application logic.
- Using AI tools during software development.
- Managing a project using GitHub.





**QuizForge — Making exam preparation easier, one quiz at a time!**

Developed as part of the **Build Like a Pro: 3-Hour Mini Hackathon**.

