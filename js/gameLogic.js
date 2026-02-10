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

  window.checkGuess = function(guess) {
    const secretLetters = secretWord.split("");
    const guessLetters = guess.split("");

    const rowTiles = document.querySelectorAll(`.tile[data-row='${currentRow}']`);

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

    const stats = getStats();

    if (guess.toUpperCase() === secretWord) {
      window.gameOver = true;
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

    if (currentRow === ROWS) {
      window.gameOver = true;
      stats.gamesPlayed++;
      stats.currentStreak = 0;
      saveStats(stats);
      showStatsPopup(stats);
      showMessage(`Umeshindwa. Neno lilikuwa: ${secretWord}`, null);
    }
  };

});
