document.addEventListener("DOMContentLoaded", () => {

  window.getStats = function() {
    return JSON.parse(localStorage.getItem("nenolab-stats")) || {
      gamesPlayed: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
      distribution: [0,0,0,0,0,0]
    };
  };

  window.saveStats = function(stats) {
    localStorage.setItem("nenolab-stats", JSON.stringify(stats));
  };

  const statsPopup = document.getElementById("stats-popup");
  const statsClose = document.getElementById("stats-close");

  const currentStreakEl = document.getElementById("current-streak");
  const maxStreakEl = document.getElementById("max-streak");
  const distributionBars = document.getElementById("distribution-bars");

  window.showStatsPopup = function(stats) {
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
  };

  statsClose.addEventListener("click", () => statsPopup.classList.add("hidden"));

});
