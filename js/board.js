
window.ROWS = 6;
window.COLS = 5;


window.currentRow = 0;
window.currentCol = 0;
window.guesses = Array.from({ length: window.ROWS }, () => Array(window.COLS).fill(""));


document.addEventListener("DOMContentLoaded", () => {

  const board = document.getElementById("board");

  function createBoard() {
    for (let r = 0; r < window.ROWS; r++) {
      const row = document.createElement("div");
      row.classList.add("row");

      for (let c = 0; c < window.COLS; c++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.row = r;
        tile.dataset.col = c;
        row.appendChild(tile);
      }

      board.appendChild(row);
    }
  }

  createBoard();
});


// =========================
// LETTER INPUT (DISPLAY)
// =========================

window.addLetter = function(letter) {
  if (window.currentCol >= window.COLS) return;

  window.guesses[window.currentRow][window.currentCol] = letter;

  const tile = document.querySelector(
    `.tile[data-row='${window.currentRow}'][data-col='${window.currentCol}']`
  );

  tile.textContent = letter;
  tile.classList.add("filled");

  window.currentCol++;
};

window.removeLetter = function() {
  if (window.currentCol === 0) return;

  window.currentCol--;

  window.guesses[window.currentRow][window.currentCol] = "";

  const tile = document.querySelector(
    `.tile[data-row='${window.currentRow}'][data-col='${window.currentCol}']`
  );

  tile.textContent = "";
  tile.classList.remove("filled");
};
