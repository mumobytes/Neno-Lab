console.log("input.js loaded");

// On-screen keyboard
document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    if (!window.gameEnabled || window.gameOver) {
      console.log("Typing blocked (gameDisabled/gameOver)");
      return;
    }

    const value = key.dataset.key || key.textContent.toUpperCase();
    console.log("Key clicked:", value);

    if (value === "ENTER") submitGuess();
    else if (value === "BACKSPACE") removeLetter();
    else addLetter(value);
  });
});

// Physical keyboard
document.addEventListener("keydown", e => {
  if (!window.gameEnabled || window.gameOver) {
    console.log("Typing blocked (gameDisabled/gameOver)");
    return;
  }

  const key = e.key.toUpperCase();
  console.log("KEYDOWN:", key);

  if (key === "ENTER") submitGuess();
  else if (key === "BACKSPACE") removeLetter();
  else if (/^[A-Z]$/.test(key)) addLetter(key);
});
