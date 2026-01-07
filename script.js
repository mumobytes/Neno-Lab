
const secretWord = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
console.log("Secret word:", secretWord);

let gameOver = false;

const messageEl = document.getElementById("message");

function showMessage(text, duration = 2000) {
  messageEl.textContent = text;

  if (duration) {
    setTimeout(() => {
      messageEl.textContent = "";
    }, duration);
  }
}


//Keyboard funtionality
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



//Type of game(the tiles)
const ROWS = 6;
const COLS = 5;

let currentRow = 0;
let currentCol = 0;

// Stores guesses as 2D array
let guesses = Array.from({ length: ROWS }, () =>
  Array(COLS).fill("")
);

const board = document.getElementById("board");

//Creating a grid
function createBoard() {
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.setAttribute("data-row", r);
      tile.setAttribute("data-col", c);
      row.appendChild(tile);
    }

    board.appendChild(row);
  }
}

createBoard();

//Handle values input from the keyboard
document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
  if (gameOver) return;

  const key = e.key.toUpperCase();

  if (key === "BACKSPACE") {
    removeLetter();
  } else if (key === "ENTER") {
    submitGuess();
  } else if (/^[A-Z]$/.test(key)) {
    addLetter(key);
  }
}



//Add the letters picked into the tiles
function addLetter(letter) {
  if (currentCol >= COLS) return;

  guesses[currentRow][currentCol] = letter;

  const tile = document.querySelector(
    `.tile[data-row='${currentRow}'][data-col='${currentCol}']`
  );
  tile.textContent = letter;

  currentCol++;
}

//Allow backspace to delete a letter
function removeLetter() {
  if (currentCol === 0) return;

  currentCol--;
  guesses[currentRow][currentCol] = "";

  const tile = document.querySelector(
    `.tile[data-row='${currentRow}'][data-col='${currentCol}']`
  );
  tile.textContent = "";
}

//colouring logic
function checkGuess(guess) {
  const secretLetters = secretWord.split("");
  const guessLetters = guess.split("");

  const rowTiles = document.querySelectorAll(
    `.tile[data-row='${currentRow}']`

  );

  const letterCount = {};

  // Count letters in secret word
  for (let letter of secretLetters) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  // First pass: greens
  guessLetters.forEach((letter, index) => {
    if (letter === secretLetters[index]) {
      rowTiles[index].classList.add("correct");
      letterCount[letter]--;
      guessLetters[index] = null;
    }
  });

  // Second pass: yellows and grays
  guessLetters.forEach((letter, index) => {
    if (letter === null) return;

    if (letterCount[letter] > 0) {
      rowTiles[index].classList.add("present");
      letterCount[letter]--;
    } else {
      rowTiles[index].classList.add("absent");
    }
  });

  function colorKey(letter, status) {
  const key = document.querySelector(`.key:not([data-key])[textContent="${letter}"]`);
  if (!key) return;

  if (
    key.classList.contains("correct") ||
    (key.classList.contains("present") && status === "absent")
  ) return;

  key.classList.remove("present", "absent");
  key.classList.add(status);
}

}



function submitGuess() {
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

  if (guess.toUpperCase() === secretWord) {
    gameOver = true;
    setTimeout(() => {
      showMessage("Hongera! Umefanikiwa ", null);
    }, 100);
    return;
  }

  currentRow++;
  currentCol = 0;

  checkLoss();
}




function submitGuess() {
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

  if (guess.toUpperCase() === secretWord) {
    gameOver = true;
    setTimeout(() => {
      showMessage("Hongera! Umefanikiwa ", null);
    }, 100);
    return;
  }

  currentRow++;
  currentCol = 0;

  checkLoss();

  if (currentRow === ROWS - 1) {
  checkLoss();
}

}



function checkLoss() {
  if (currentRow === ROWS) {
    gameOver = true;
    setTimeout(() => {
      showMessage(`Umeshindwa  Neno lilikuwa: ${secretWord}`, null);
    }, 100);
  }
}


document.body.classList.add("game-over");
