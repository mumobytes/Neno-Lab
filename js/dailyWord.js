document.addEventListener("DOMContentLoaded", () => {

  const START_DATE = new Date("2026-01-01");

  window.getDailyWord = function() {
    const today = new Date();
    const diffDays = Math.floor((today - START_DATE) / (1000*60*60*24));
    return WORDS[diffDays % WORDS.length].toUpperCase();
  };

  window.secretWord = getDailyWord();
  window.gameOver = false;

  const todayKey = new Date().toDateString();
  const lastPlayed = localStorage.getItem("nenolab-last-played");

  if (lastPlayed === todayKey) {
    if (window.showMessage) showMessage("Umemaliza Neno la Leo. Rudi kesho");
    gameOver = true;
  } else {
    localStorage.setItem("nenolab-last-played", todayKey);
  }

});
