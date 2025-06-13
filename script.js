let words = [];
let quizList = [];
let currentQuestion = 0;

document.getElementById("settingsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const start = parseInt(document.getElementById("startNum").value);
  const end = parseInt(document.getElementById("endNum").value);
  const count = parseInt(document.getElementById("quizCount").value);
  startQuiz(start, end, count);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizList.length) {
    showQuestion(quizList[currentQuestion]);
  } else {
    alert("クイズ終了！最初に戻ります。");
    location.reload();
  }
});

function startQuiz(start, end, count) {
  const rangeWords = words.slice(start - 1, end);
  if (rangeWords.length < count) {
    alert("指定範囲内に十分な単語がありません。");
    return;
  }

  quizList = [];
  const usedIndexes = new Set();

  while (quizList.length < count) {
    const index = Math.floor(Math.random() * rangeWords.length);
    if (!usedIndexes.has(index)) {
      usedIndexes.add(index);
      quizList.push(rangeWords[index]);
    }
  }

  currentQuestion = 0;
  document.getElementById("settingsForm").style.display = "none";
  document.getElementById("quizArea").style.display = "block";
  showQuestion(quizList[currentQuestion]);
}

function showQuestion(word) {
  const questionText = document.getElementById("questionText");
  const choicesDiv = document.getElementById("choices");
  const feedback = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");

  questionText.textContent = `「${word.Word}」の意味はどれ？`;
  feedback.textContent = "";
  nextBtn.style.display = "none";
  choicesDiv.innerHTML = "";

  const correct = word.Meaning;
  const choices = [correct];

  while (choices.length < 4) {
    const rand = words[Math.floor(Math.random() * words.length)].Meaning;
    if (!choices.includes(rand)) choices.push(rand);
  }

  shuffle(choices);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === correct) {
        feedback.textContent = "✅ 正解！";
      } else {
        feedback.textContent = `❌ 不正解！正解は「${correct}」`;
      }
      nextBtn.style.display = "inline";
    };
    choicesDiv.appendChild(btn);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// CSVを読み込む
Papa.parse("words.csv", {
  download: true,
  header: true,
  complete: (results) => {
    // 不正な行（空や未定義）を除外
    words = results.data.filter(w => w.Word && w.Meaning);
    document.getElementById("startBtn").disabled = false;
    console.log("読み込み完了：", words.length, "語");
  }
});
