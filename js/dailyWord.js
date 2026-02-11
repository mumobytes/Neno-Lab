document.addEventListener("DOMContentLoaded", () => {

  const START_DATE = new Date("2026-01-01");
  const today = new Date().toISOString().split("T")[0];

  // --- Get daily word ---
  window.getDailyWord = function() {
    const now = new Date();
    const diffDays = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
    return WORDS[diffDays % WORDS.length].toUpperCase();
  };

  window.secretWord = getDailyWord();

  // --- Session Handling ---
  function getSession() {
    return JSON.parse(localStorage.getItem("nenolab-session"));
  }

  function saveSession(session) {
    localStorage.setItem("nenolab-session", JSON.stringify(session));
  }

  function createNewSession() {
    return {
      date: today,
      status: "in-progress",
      currentRow: 0,
      guesses: Array.from({ length: 6 }, () => Array(5).fill(""))
    };
  }

  let session = getSession();

  // If no session OR session is from previous day → create new
  if (!session || session.date !== today) {
    session = createNewSession();
    saveSession(session);
  }

  // Apply session to global game state
  window.currentRow = session.currentRow;
  window.guesses = session.guesses;
  window.gameOver = session.status !== "in-progress";

  // If already completed today → lock game
  if (session.status === "won") {
    window.gameOver = true;
  }

  if (session.status === "lost") {
    window.gameOver = true;
  }

  // Expose session updater
  window.updateSession = function(status) {
    session.status = status;
    session.currentRow = window.currentRow;
    session.guesses = window.guesses;
    saveSession(session);
  };

});
