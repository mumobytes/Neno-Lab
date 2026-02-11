document.addEventListener("DOMContentLoaded", () => {

  const messageEl = document.getElementById("message");

  window.showMessage = function(text, duration = 2000) {
    messageEl.textContent = text;
    if (duration) {
      setTimeout(() => (messageEl.textContent = ""), duration);
    }
  };

  function colorKey(letter, status) {
    const key = [...document.querySelectorAll(".key")].find(k => k.textContent === letter);
    if (!key) return;

    key.classList.remove("correct", "present", "absent");
    key.classList.add(status);
  }

  window.checkGuess = function(guess, restoring = false) {

    const secretLetters = secretWord.split("");
    const guessLetters = guess.split("");

    const rowTiles = document.querySelectorAll(`.tile[data-row='${currentRow}']`);

    if (!restoring) {
      rowTiles.forEach((tile, i) => {
        setTimeout(() => {
          tile.classList.add("flip");
          setTimeout(() => tile.classList.remove("flip"), 200);
        }, i * 150);
      });
    }


    const letterCount = {};
    secretLetters.forEach(l => (letterCount[l] = (letterCount[l] || 0) + 1));

    const delay = restoring ? 0 : rowTiles.length * 150;

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
    }, delay);
  };

  window.submitGuess = function() {

    if (window.gameOver) return;

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

    // Save progress to session
    window.updateSession("in-progress");

    // --- WIN ---
    if (guess.toUpperCase() === secretWord) {

      window.gameOver = true;

      // attempts = currentRow (0-based index)
      updateStatsAfterGame(true, currentRow);

      window.updateSession("won");

      showWinPopup(getStats().currentStreak);
      showStatsPopup();

      return;
    }

    // Move to next row
    currentRow++;
    currentCol = 0;

    window.updateSession("in-progress");

    // --- LOSS ---
    if (currentRow === ROWS) {

      window.gameOver = true;

      updateStatsAfterGame(false);

      window.updateSession("lost");

      showStatsPopup();
      showMessage(`Umeshindwa. Neno lilikuwa: ${secretWord}`, null);
    }

  };


});
