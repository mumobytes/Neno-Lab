document.addEventListener("DOMContentLoaded", () => {

  function todayString() {
    return new Date().toISOString().split("T")[0];
  }

  function yesterdayString() {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return y.toISOString().split("T")[0];
  }

  window.getStats = function() {
    return JSON.parse(localStorage.getItem("nenolab-stats")) || {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastPlayedDate: null,
      distribution: [0,0,0,0,0,0]
    };
  };

  window.saveStats = function(stats) {
    localStorage.setItem("nenolab-stats", JSON.stringify(stats));
  };

  // --- Validate streak on load ---
  (function validateStreakOnLoad() {
    const stats = getStats();
    const today = todayString();
    const yesterday = yesterdayString();

    if (
      stats.lastPlayedDate &&
      stats.lastPlayedDate !== today &&
      stats.lastPlayedDate !== yesterday
    ) {
      stats.currentStreak = 0;
      saveStats(stats);
    }
  })();

  // --- Update after game ---
  window.updateStatsAfterGame = function(won, attempts) {

    const stats = getStats();
    const today = todayString();
    const yesterday = yesterdayString();

    // Prevent double counting same day
    if (stats.lastPlayedDate === today) return;

    stats.gamesPlayed++;

    if (won) {
      stats.wins++;
      stats.distribution[attempts]++;

      if (stats.lastPlayedDate === yesterday) {
        stats.currentStreak++;
      } else {
        stats.currentStreak = 1;
      }

      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);

    } else {
      stats.losses++;
      stats.currentStreak = 0;
    }

    stats.lastPlayedDate = today;
    saveStats(stats);
  };

  // --- Stats Popup ---
  const statsPopup = document.getElementById("stats-popup");
  const statsClose = document.getElementById("stats-close");
  const currentStreakEl = document.getElementById("current-streak");
  const maxStreakEl = document.getElementById("max-streak");
  const distributionBars = document.getElementById("distribution-bars");

  window.showStatsPopup = function() {
    const stats = getStats();

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
      bar.textContent = count;

      row.appendChild(label);
      row.appendChild(bar);
      distributionBars.appendChild(row);
    });

    statsPopup.classList.remove("hidden");
  };

  statsClose.addEventListener("click", () => {
    statsPopup.classList.add("hidden");
  });

});
