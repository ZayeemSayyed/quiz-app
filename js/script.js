const questions = [
  { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: 0, explanation: "HTML stands for Hyper Text Markup Language — the standard language for web pages." },
  { q: "Which language is used for styling web pages?", options: ["Java", "Python", "CSS", "C++"], answer: 2, explanation: "CSS (Cascading Style Sheets) is used to style and design web pages." },
  { q: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], answer: 0, explanation: "CPU stands for Central Processing Unit — the brain of the computer." },
  { q: "Which of these is a programming language?", options: ["HTML", "Microsoft Word", "Java", "Google Chrome"], answer: 2, explanation: "Java is a programming language. HTML is a markup language, not a programming language." },
  { q: "What does 'www' stand for in a website address?", options: ["World Wide Web", "World Web Works", "Wide World Web", "Web World Wide"], answer: 0, explanation: "WWW stands for World Wide Web." },
  { q: "Which company created the Android operating system?", options: ["Apple", "Microsoft", "Google", "Samsung"], answer: 2, explanation: "Android was created by Google and released in 2008." },
  { q: "What is the full form of RAM?", options: ["Random Access Memory", "Read Access Memory", "Run Application Memory", "Random Application Module"], answer: 0, explanation: "RAM stands for Random Access Memory — temporary storage used by your computer." },
  { q: "Which of these is NOT a web browser?", options: ["Chrome", "Firefox", "Linux", "Safari"], answer: 2, explanation: "Linux is an operating system, not a web browser." },
  { q: "What does 'OOP' stand for in programming?", options: ["Object Oriented Programming", "Open Online Platform", "Output Oriented Processing", "Object Operation Program"], answer: 0, explanation: "OOP stands for Object Oriented Programming — a style of coding using objects and classes." },
  { q: "Which symbol is used for comments in JavaScript?", options: ["#", "//", "/* */", "Both // and /* */"], answer: 3, explanation: "JavaScript supports both // for single line and /* */ for multi-line comments." }
];

let current = 0, score = 0, answered = false, timer, timeLeft = 15, questionTimes = [], questionStart;

function startQuiz() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('quizScreen').style.display = 'block';
  current = 0; score = 0; questionTimes = [];
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  timeLeft = 15;
  questionStart = Date.now();

  const q = questions[current];
  document.getElementById('questionCount').textContent = `Question ${current + 1} of ${questions.length}`;
  document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
  document.getElementById('progressFill').style.width = `${(current / questions.length) * 100}%`;
  document.getElementById('question').textContent = q.q;
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('feedback').textContent = '';
  document.getElementById('nextBtn').style.display = 'none';

  document.getElementById('options').innerHTML = q.options.map((opt, i) =>
    `<button class="option" onclick="selectAnswer(${i})">${opt}</button>`
  ).join('');

  updateTimer();
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) { clearInterval(timer); timeUp(); }
  }, 1000);
}

function updateTimer() {
  const el = document.getElementById('timer');
  el.textContent = `⏱ ${timeLeft}`;
  el.className = timeLeft <= 5 ? 'timer urgent' : 'timer';
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timer);
  questionTimes.push(Math.round((Date.now() - questionStart) / 1000));

  const q = questions[current];
  const options = document.querySelectorAll('.option');
  options.forEach(o => o.disabled = true);
  options[q.answer].classList.add('correct');

  const feedback = document.getElementById('feedback');
  if (index === q.answer) {
    score++;
    options[index].classList.add('correct');
    feedback.className = 'feedback correct';
    feedback.textContent = '✅ Correct! ' + q.explanation;
  } else {
    options[index].classList.add('wrong');
    feedback.className = 'feedback wrong';
    feedback.textContent = '❌ Wrong! ' + q.explanation;
  }

  document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
  document.getElementById('nextBtn').style.display = 'block';
}

function timeUp() {
  if (answered) return;
  answered = true;
  questionTimes.push(15);
  const q = questions[current];
  const options = document.querySelectorAll('.option');
  options.forEach(o => o.disabled = true);
  options[q.answer].classList.add('correct');
  const feedback = document.getElementById('feedback');
  feedback.className = 'feedback wrong';
  feedback.textContent = '⏰ Time up! ' + q.explanation;
  document.getElementById('nextBtn').style.display = 'block';
}

function nextQuestion() {
  current++;
  if (current < questions.length) loadQuestion();
  else showResult();
}

function showResult() {
  document.getElementById('quizScreen').style.display = 'none';
  document.getElementById('resultScreen').style.display = 'block';

  const pct = Math.round((score / questions.length) * 100);
  const avgTime = Math.round(questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length);

  let emoji, title, message;
  if (pct === 100) { emoji = '🏆'; title = 'Perfect Score!'; message = 'Outstanding! You got every question right!'; }
  else if (pct >= 80) { emoji = '🎉'; title = 'Excellent!'; message = 'Great job! You really know your stuff!'; }
  else if (pct >= 60) { emoji = '👍'; title = 'Good Job!'; message = "Solid performance! Keep learning and you'll ace it next time!"; }
  else if (pct >= 40) { emoji = '📚'; title = 'Keep Studying!'; message = 'Not bad, but there\'s room to improve. Review the topics and try again!'; }
  else { emoji = '💪'; title = 'Keep Practicing!'; message = "Don't give up! Every expert was once a beginner."; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultScore').textContent = pct + '%';
  document.getElementById('correctCount').textContent = score;
  document.getElementById('wrongCount').textContent = questions.length - score;
  document.getElementById('timeStat').textContent = avgTime + 's';
  document.getElementById('resultMessage').textContent = message;
}

function restartQuiz() {
  document.getElementById('resultScreen').style.display = 'none';
  startQuiz();
}