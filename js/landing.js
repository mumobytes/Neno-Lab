document.addEventListener("DOMContentLoaded", () => {

  const overlay = document.getElementById("landing-overlay");
  const startBtn = document.getElementById("start-game-btn");
  const howBtn = document.getElementById("how-to-play-btn");

  window.gameEnabled = false;

  window.showLanding = function() {
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  startBtn.addEventListener("click", () => {
  console.log("Start button clicked!");
  overlay.classList.add("hidden");
  overlay.style.display = "none";
  document.body.style.overflow = "";
  window.gameEnabled = true;
  window.gameOver = false;
  console.log("Typing enabled:", window.gameEnabled);
  });

  howBtn.addEventListener("click", () => {
    const popup = document.getElementById("how-to-play-popup");
    popup.classList.remove("hidden");
  });

});
