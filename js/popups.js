document.addEventListener("DOMContentLoaded", () => {

  const menuBtn = document.getElementById("menu-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const settingsClose = document.getElementById("settings-close");

  menuBtn.addEventListener("click", () => settingsPanel.classList.remove("hidden"));
  settingsClose.addEventListener("click", () => settingsPanel.classList.add("hidden"));

  const howPopup = document.getElementById("how-to-play-popup");
  const howClose = document.getElementById("how-close");
  const howToBtn = document.getElementById("how-to-play-btn");

  howToBtn.addEventListener("click", () => howPopup.classList.remove("hidden"));
  howClose.addEventListener("click", () => howPopup.classList.add("hidden"));

  const winPopup = document.getElementById("win-popup");
  const streakDisplay = document.getElementById("streak-count");
  const popupClose = document.getElementById("popup-close");

  window.showWinPopup = function(streak) {
    streakDisplay.textContent = streak;
    winPopup.classList.remove("hidden");
  };

  popupClose.addEventListener("click", () => winPopup.classList.add("hidden"));

  document.querySelectorAll(".future-btn").forEach(btn => {
    btn.addEventListener("click", () => showMessage("Hii itakuja hivi karibuni 👀", 2000));
  });

});
