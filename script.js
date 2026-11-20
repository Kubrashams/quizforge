
let selectedSubject = "";
let selectedFile = null;
let extractedNotes = "";
let questions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let selectedAnswerIndex = -1;

// PDF setup
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

// Select subject
function selectSubject(subject, element) {
    selectedSubject = subject;

    document.querySelectorAll(".subject-card").forEach(card => {
        card.classList.remove("selected");
    });

    if (element) {
        element.classList.add("selected");
    }

    const subjectText = document.getElementById("selected-subject");

    if (subjectText) {
        subjectText.textContent = subject;
    }
}

// File upload
const fileInput = document.getElementById("notes-file");

if (fileInput) {
    fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            handleFile(this.files[0]);
        }
    });
}

// Read uploaded file
async function handleFile(file) {
    selectedFile = file;
    extractedNotes = "";

    const fileInfo = document.getElementById("file-info");

    if (fileInfo) {
        fileInfo.textContent = "Reading " + file.name + "...";
    }

    try {
        extractedNotes = await readFileContent(file);

        if (extractedNotes.trim().length < 20) {
            throw new Error("Not enough text found in this file.");
        }

        if (fileInfo) {
            fileInfo.textContent = "✓ " + file.name + " uploaded successfully";
        }

    } catch (error) {
        extractedNotes = "";
        selectedFile = null;

        if (fileInfo) {
            fileInfo.textContent = "Could not read this file.";
        }

        alert(error.message);
    }
}

// Extract text
async function readFileContent(file) {
    const extension = file.name.split(".").pop().toLowerCase();

    if (extension === "txt") {
        return await file.text();
    }

    if (extension === "docx") {
        if (!window.mammoth) {
            throw new Error("DOCX reader could not load.");
        }

        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({
            arrayBuffer: buffer
        });

        return result.value;
    }

    if (extension === "pdf") {
        if (!window.pdfjsLib) {
            throw new Error("PDF reader could not load.");
        }

        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({
            data: buffer
        }).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            text += content.items.map(item => item.str).join(" ") + "\n";
        }

        return text;
    }

    throw new Error("Please upload PDF, DOCX or TXT files.");
}

// Remove file
function removeFile() {
    selectedFile = null;
    extractedNotes = "";

    if (fileInput) {
        fileInput.value = "";
    }

    const fileInfo = document.getElementById("file-info");

    if (fileInfo) {
        fileInfo.textContent = "";
    }
}

// Drag and drop
const uploadBox = document.getElementById("upload-box");

if (uploadBox) {
    uploadBox.addEventListener("dragover", function (event) {
        event.preventDefault();
        uploadBox.classList.add("dragging");
    });

    uploadBox.addEventListener("dragleave", function () {
        uploadBox.classList.remove("dragging");
    });

    uploadBox.addEventListener("drop", function (event) {
        event.preventDefault();
        uploadBox.classList.remove("dragging");

        if (event.dataTransfer.files.length > 0) {
            handleFile(event.dataTransfer.files[0]);
        }
    });
}

// Clean notes
function cleanNotes(text) {
    return text
        .replace(/\bslide\s*\d+\b/gi, "")
        .replace(/\bpage\s*\d+\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

// Get sentences
function getSentences(text) {
    return cleanNotes(text)
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length >= 15);
}

// Get useful keywords
function getKeywords(text) {
    const stopWords = [
        "this", "that", "with", "from", "have", "has",
        "were", "which", "their", "there", "about",
        "these", "those", "then", "than", "they",
        "them", "when", "where", "what", "will",
        "would", "could", "should", "also", "into",
        "over", "under", "between", "through",
        "because", "such", "some", "more", "most",
        "very", "each", "been", "being", "are",
        "was", "and", "the", "for", "but", "not",
        "you", "your", "its", "our", "can", "may",
        "one", "two", "all", "any", "use", "used",
        "using", "how", "why", "who", "is", "in",
        "on", "of", "to", "a", "an", "as", "by",
        "or", "it", "we", "he", "she", "do",
        "does", "did", "while", "after", "before"
    ];

    const words = text.toLowerCase().match(/\b[a-z][a-z0-9-]{3,}\b/g) || [];

    return [...new Set(words)].filter(word =>
        !stopWords.includes(word)
    );
}

// Shuffle
function shuffleArray(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

// Escape special characters
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Make short question
function makeShortQuestion(sentence, answer) {
    let text = sentence;
    const position = sentence.toLowerCase().indexOf(answer.toLowerCase());

    if (sentence.length > 95 && position !== -1) {
        const start = Math.max(0, position - 35);
        const end = Math.min(sentence.length, position + answer.length + 40);

        text =
            (start > 0 ? "..." : "") +
            sentence.substring(start, end) +
            (end < sentence.length ? "..." : "");
    }

    const pattern = new RegExp(
        "\\b" + escapeRegExp(answer) + "\\b",
        "i"
    );

    text = text.replace(pattern, "______");

    return "Complete: " + text;
}

// Generate quiz
function generateQuiz() {
    if (!selectedSubject) {
        alert("Please select a subject first!");
        return;
    }

    if (!extractedNotes) {
        alert("Please upload your notes first!");
        return;
    }

    const count = parseInt(
        document.getElementById("question-count").value
    );

    const difficulty = document.getElementById("difficulty").value;

    const sentences = getSentences(extractedNotes);
    const allWords = getKeywords(extractedNotes);

    if (allWords.length < 4 || sentences.length === 0) {
        alert("Please upload more detailed notes!");
        return;
    }

    let candidates = [];

    sentences.forEach(sentence => {
        const words = getKeywords(sentence);

        words.forEach(answer => {
            candidates.push({
                sentence: sentence,
                answer: answer
            });
        });
    });

    candidates = shuffleArray(candidates);

    questions = [];
    const usedPairs = new Set();

    for (let item of candidates) {
        if (questions.length >= count) {
            break;
        }

        const pairKey = item.sentence + "|" + item.answer;

        if (usedPairs.has(pairKey)) {
            continue;
        }

        let distractors = shuffleArray(
            allWords.filter(word => word !== item.answer)
        ).slice(0, 3);

        if (distractors.length < 3) {
            continue;
        }

        let options = shuffleArray([
            item.answer,
            ...distractors
        ]);

        questions.push({
            question: makeShortQuestion(
                item.sentence,
                item.answer
            ),
            options: options,
            answer: options.indexOf(item.answer),
            difficulty: difficulty
        });

        usedPairs.add(pairKey);
    }

    if (questions.length < count) {
        alert(
            "Only " + questions.length +
            " suitable questions could be created. Please upload more notes."
        );
        return;
    }

    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    selectedAnswerIndex = -1;

    showQuestion();
}

// Show question
function showQuestion() {
    const quizArea = document.getElementById("quiz-area");
    const resultArea = document.getElementById("result-area");

    resultArea.innerHTML = "";

    const q = questions[currentQuestion];

    selectedAnswerIndex = -1;

    quizArea.innerHTML = `
        <div class="quiz-card">

            <div class="quiz-top">
                <span>Question ${currentQuestion + 1} of ${questions.length}</span>
                <span>${escapeHTML(selectedSubject)}</span>
            </div>

            <div class="progress-track">
                <div class="progress-fill"
                style="width:${((currentQuestion + 1) / questions.length) * 100}%">
                </div>
            </div>

            <h2 class="question-text">
                ${escapeHTML(q.question)}
            </h2>

            <div class="options-container">
                ${q.options.map((option, index) => `
                    <button class="option-btn"
                    onclick="selectAnswer(${index})">

                        <span class="option-letter">
                            ${String.fromCharCode(65 + index)}
                        </span>

                        ${escapeHTML(option)}

                    </button>
                `).join("")}
            </div>

            <div id="answer-feedback"></div>

            <button class="next-btn" id="next-btn"
            onclick="nextQuestion()" disabled>

                ${currentQuestion === questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question →"}

            </button>

        </div>
    `;

    quizArea.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Select answer
function selectAnswer(index) {
    if (selectedAnswerIndex !== -1) {
        return;
    }

    selectedAnswerIndex = index;

    const q = questions[currentQuestion];

    const buttons = document.querySelectorAll(".option-btn");
    const feedback = document.getElementById("answer-feedback");

    userAnswers[currentQuestion] = index;

    buttons.forEach((button, i) => {
        button.disabled = true;

        if (i === q.answer) {
            button.classList.add("correct");
        }

        if (i === index && index !== q.answer) {
            button.classList.add("wrong");
        }
    });

    if (index === q.answer) {
        score++;

        feedback.innerHTML = `
            <p class="correct-feedback">✓ Correct Answer!</p>
        `;
    } else {
        feedback.innerHTML = `
            <p class="wrong-feedback">
                Correct answer: ${escapeHTML(q.options[q.answer])}
            </p>
        `;
    }

    document.getElementById("next-btn").disabled = false;
}

// Next question
function nextQuestion() {
    if (selectedAnswerIndex === -1) {
        return;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// Show result
function showResult() {
    const quizArea = document.getElementById("quiz-area");
    const resultArea = document.getElementById("result-area");

    quizArea.innerHTML = "";

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    resultArea.innerHTML = `
        <div class="result-card">

            <h2>Quiz Completed! 🎉</h2>

            <div class="score-circle">
                <span>${score}/${questions.length}</span>
            </div>

            <h3>${percentage}% Score</h3>

            <p>You completed your ${escapeHTML(selectedSubject)} quiz!</p>

            <button class="review-btn" onclick="reviewAnswers()">
                Review Answers
            </button>

            <button class="next-btn" onclick="resetQuiz()">
                Try Again ↻
            </button>

        </div>
    `;

    resultArea.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Review answers
function reviewAnswers() {
    const resultArea = document.getElementById("result-area");

    resultArea.innerHTML = `
        <div class="result-card">

            <h2>Answer Review 📚</h2>

            ${questions.map((q, index) => `
                <div class="review-card">

                    <h4>
                        Q${index + 1}. ${escapeHTML(q.question)}
                    </h4>

                    <p>
                        Your answer:
                        ${escapeHTML(
                            userAnswers[index] !== undefined
                                ? q.options[userAnswers[index]]
                                : "Not answered"
                        )}
                    </p>

                    <p>
                        Correct answer:
                        ${escapeHTML(q.options[q.answer])}
                    </p>

                </div>
            `).join("")}

            <button class="next-btn" onclick="resetQuiz()">
                Try Again ↻
            </button>

        </div>
    `;
}

// Try again
function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    selectedAnswerIndex = -1;

    generateQuiz();
}

// Prevent HTML injection
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}
