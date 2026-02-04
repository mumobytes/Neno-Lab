/* =========================
   THEME TOGGLE
========================= */
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "Light mode" : "Dark mode";

  localStorage.setItem("nenolab-theme", isLight ? "light" : "dark");
});

const savedTheme = localStorage.getItem("nenolab-theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "Light mode";
}

const landingOverlay = document.getElementById("landing-overlay");
const landingTitle = document.getElementById("landing-title");
const landingSubtitle = document.getElementById("landing-subtitle");
const exampleSection = document.getElementById("example-section");
const userIdentity = document.getElementById("user-identity");

const startGameBtn = document.getElementById("start-game-btn");
const howToBtn = document.getElementById("how-to-play-btn");

const howPopup = document.getElementById("how-to-play-popup");
const howClose = document.getElementById("how-close");
const hasSeenIntro = localStorage.getItem("nenolab-intro");
const userEmail = localStorage.getItem("nenolab-user-email"); // future login


//Landing page
function showLanding() {

  const todayKey = new Date().toDateString();
  const lastPlayed = localStorage.getItem("nenolab-last-played");

  // If already played today → skip landing entirely
  if (lastPlayed === todayKey) {
    landingOverlay.style.display = "none";
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "hidden";
  landingOverlay.style.display = "flex";

  if (!hasSeenIntro) {
    // 🆕 First-time user
    landingTitle.textContent = "Karibu NenoLab 👋";
    landingSubtitle.textContent = "Jifunze na ucheze fumbo la maneno ya Kiswahili";

    exampleSection.classList.remove("hidden");
    howToBtn.classList.remove("hidden");
    userIdentity.classList.add("hidden");
  } else {
    // 🔁 Returning user
    landingTitle.textContent = "Karibu tena 👋";
    landingSubtitle.textContent = "Neno la Leo lipo tayari";

    exampleSection.classList.add("hidden");
    howToBtn.classList.add("hidden");

    if (userEmail) {
      userIdentity.textContent = `Umeingia kama ${userEmail}`;
      userIdentity.classList.remove("hidden");
    } else {
      userIdentity.textContent = "Unaendelea kama mgeni";
      userIdentity.classList.remove("hidden");
    }
  }
}
//Start Game Action
startGameBtn.addEventListener("click", () => {
  localStorage.setItem("nenolab-intro", "true");
  landingOverlay.style.display = "none";
  document.body.style.overflow = "";
});

//Button behaviors

startGameBtn.addEventListener("click", () => {
  localStorage.setItem("nenolab-intro", "true");
  landingOverlay.style.display = "none";
  document.body.style.overflow = "";
});

howToBtn.addEventListener("click", () => {
  howPopup.classList.remove("hidden");
});

howClose.addEventListener("click", () => {
  howPopup.classList.add("hidden");
});



/* =========================
   STATS ENGINE
========================= */
function getStats() {
  return JSON.parse(localStorage.getItem("nenolab-stats")) || {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0]
  };
}

function saveStats(stats) {
  localStorage.setItem("nenolab-stats", JSON.stringify(stats));
}

/* =========================
   STATS POPUP
========================= */
const statsPopup = document.getElementById("stats-popup");
const statsClose = document.getElementById("stats-close");

const currentStreakEl = document.getElementById("current-streak");
const maxStreakEl = document.getElementById("max-streak");
const distributionBars = document.getElementById("distribution-bars");

function showStatsPopup(stats) {
  currentStreakEl.textContent = stats.currentStreak;
  maxStreakEl.textContent = stats.maxStreak;

  distributionBars.innerHTML = "";

  const maxCount = Math.max(...stats.distribution, 1);

  stats.distribution.forEach((count, index) => {
    const row = document.createElement("div");
    row.className = "dist-row";

    const label = document.createElement("span");
    label.textContent = index + 1;

    const bar = document.createElement("div");
    bar.className = "dist-bar";
    bar.style.width = `${(count / maxCount) * 100}%`;

    row.appendChild(label);
    row.appendChild(bar);
    distributionBars.appendChild(row);
  });

  statsPopup.classList.remove("hidden");
}

statsClose.addEventListener("click", () => {
  statsPopup.classList.add("hidden");
});

/* =========================
   WIN POPUP
========================= */
const winPopup = document.getElementById("win-popup");
const streakDisplay = document.getElementById("streak-count");
const popupClose = document.getElementById("popup-close");

function showWinPopup(streak) {
  streakDisplay.textContent = streak;
  winPopup.classList.remove("hidden");
}

popupClose.addEventListener("click", () => {
  winPopup.classList.add("hidden");
});

/* =========================
   DAILY WORD SYSTEM
========================= */
const START_DATE = new Date("2026-01-01");

function getDailyWord() {
  const today = new Date();
  const diffDays = Math.floor(
    (today - START_DATE) / (1000 * 60 * 60 * 24)
  );
  const index = diffDays % WORDS.length;
  return WORDS[index].toUpperCase();
}

const secretWord = getDailyWord();
console.log("Daily Neno:", secretWord);

/* =========================
   PREVENT REPLAY SAME DAY
========================= */
let gameOver = false;

const todayKey = new Date().toDateString();
const lastPlayed = localStorage.getItem("nenolab-last-played");

if (lastPlayed === todayKey) {
  showMessage("Umemaliza Neno la Leo. Rudi kesho 🌅", null);
  gameOver = true;
} else {
  localStorage.setItem("nenolab-last-played", todayKey);
}

/* =========================
   MESSAGE SYSTEM
========================= */
const messageEl = document.getElementById("message");

function showMessage(text, duration = 2000) {
  messageEl.textContent = text;
  if (duration) {
    setTimeout(() => (messageEl.textContent = ""), duration);
  }
}

/* =========================
   KEYBOARD INPUT
========================= */
const keys = document.querySelectorAll(".key");

keys.forEach(key => {
  key.addEventListener("click", () => {
    if (gameOver) return;

    const value = key.dataset.key || key.textContent;
    if (value === "ENTER") submitGuess();
    else if (value === "BACKSPACE") removeLetter();
    else addLetter(value);
  });
});

document.addEventListener("keydown", e => {
  if (gameOver) return;

  const key = e.key.toUpperCase();
  if (key === "BACKSPACE") removeLetter();
  else if (key === "ENTER") submitGuess();
  else if (/^[A-Z]$/.test(key)) addLetter(key);
});

/* =========================
   BOARD SETUP
========================= */
const ROWS = 6;
const COLS = 5;

let currentRow = 0;
let currentCol = 0;

let guesses = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
const board = document.getElementById("board");

function createBoard() {
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.row = r;
      tile.dataset.col = c;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

createBoard();

/* =========================
   LETTER INPUT
========================= */
function addLetter(letter) {
  if (currentCol >= COLS) return;

  guesses[currentRow][currentCol] = letter;
  const tile = document.querySelector(
    `.tile[data-row='${currentRow}'][data-col='${currentCol}']`
  );

  tile.textContent = letter;
  tile.classList.add("filled");
  currentCol++;
}

function removeLetter() {
  if (currentCol === 0) return;

  currentCol--;
  guesses[currentRow][currentCol] = "";

  const tile = document.querySelector(
    `.tile[data-row='${currentRow}'][data-col='${currentCol}']`
  );

  tile.textContent = "";
  tile.classList.remove("filled");
}

/* =========================
   CHECK GUESS + COLORS
========================= */
function checkGuess(guess) {
  const secretLetters = secretWord.split("");
  const guessLetters = guess.split("");
  const rowTiles = document.querySelectorAll(
    `.tile[data-row='${currentRow}']`
  );

  rowTiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("flip");
      setTimeout(() => tile.classList.remove("flip"), 200);
    }, i * 150);
  });

  const letterCount = {};
  secretLetters.forEach(l => (letterCount[l] = (letterCount[l] || 0) + 1));

  setTimeout(() => {
    guessLetters.forEach((l, i) => {
      if (l === secretLetters[i]) {
        rowTiles[i].classList.add("correct");
        colorKey(l, "correct");
        letterCount[l]--;
        guessLetters[i] = null;
      }
    });

    guessLetters.forEach((l, i) => {
      if (!l) return;
      if (letterCount[l] > 0) {
        rowTiles[i].classList.add("present");
        colorKey(l, "present");
        letterCount[l]--;
      } else {
        rowTiles[i].classList.add("absent");
        colorKey(l, "absent");
      }
    });
  }, rowTiles.length * 150);
}

function colorKey(letter, status) {
  const key = [...document.querySelectorAll(".key")].find(
    k => k.textContent === letter
  );
  if (!key) return;

  if (status === "correct") {
    key.classList.remove("present", "absent");
    key.classList.add("correct");
  } else if (
    status === "present" &&
    !key.classList.contains("correct")
  ) {
    key.classList.add("present");
  } else if (
    status === "absent" &&
    !key.classList.contains("correct") &&
    !key.classList.contains("present")
  ) {
    key.classList.add("absent");
  }
}

/* =========================
   SUBMIT GUESS
========================= */
function submitGuess() {
  if (gameOver) return;

  if (currentCol < COLS) {
    showMessage("Andika neno lenye herufi 5");
    return;
  }

  const guess = guesses[currentRow].join("").toLowerCase();
  if (!WORDS.includes(guess)) {
    showMessage("Neno halipo kwenye kamusi");
    return;
  }

  checkGuess(guess.toUpperCase());
  const stats = getStats();

  // WIN
  if (guess.toUpperCase() === secretWord) {
    gameOver = true;
    document.body.classList.add("game-over");

    stats.gamesPlayed++;
    stats.wins++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.distribution[currentRow]++;

    saveStats(stats);
    showWinPopup(stats.currentStreak);
    showStatsPopup(stats);
    return;
  }

  currentRow++;
  currentCol = 0;

  // ❌ LOSS
  if (currentRow === ROWS) {
    gameOver = true;
    document.body.classList.add("game-over");

    stats.gamesPlayed++;
    stats.currentStreak = 0;

    saveStats(stats);
    showStatsPopup(stats);
    showMessage(`Umeshindwa. Neno lilikuwa: ${secretWord}`, null);
  }
}

/* =========================
   FUTURE BUTTONS
========================= */
document.querySelectorAll(".future-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showMessage("Hii itakuja hivi karibuni 👀", 2000);
  });
});


showLanding();
