/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push([]);
    for(let x= 0; x < WIDTH; x++) {
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");

  // Creating the top row of the board in HTML that the user will use to drop game pieces into the board
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Generating the rest of the gameboard and giving each cell a unique ID by looping through the constance config variables
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      const slotContainer = document.createElement("div");
      slotContainer.classList.add("slot-container");
      const emptySlot = document.createElement("div");
      emptySlot.classList.add("empty-slot");
      slotContainer.append(emptySlot);
      cell.append(slotContainer);
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let columnIdx = 0;

  // Whole column is full
  if(board[columnIdx][x] !== null)  {
    return null;
  }

  while (board[columnIdx][x] === null && columnIdx < HEIGHT - 1) {
    columnIdx++;
  }

  // Return the spot if it's empty, otherwise return the previous one
  return board[columnIdx][x] === null ? columnIdx : columnIdx - 1;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const gamePiece = document.createElement("div");
  gamePiece.classList.add("piece", `p${currPlayer}`);

  document.getElementById(`${y}-${x}`).appendChild(gamePiece);
  document.getElementById(`${y}-${x}`).firstElementChild.appendChild(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
  document.getElementById("board").classList.add("disabled");
  setTimeout(() => {
    document.getElementById("win-modal").classList.remove("hidden");
    const text = document.getElementById("win-msg");
    text.innerText = msg;
    text.classList.add(`p${currPlayer}-text`);
  }, 500);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let boardFull = board.every((row) => {
    for (let cell of row) {
      if (cell === null) return false;
    }
    return true;
  })

  if (boardFull) endGame("It's a tie!");

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // Checks if all cells are valid and if they match the color of the current player
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Checkt the entire board for a match
  for (let y = 0; y < HEIGHT; y++) {                                                  // Iterate through the rows
    for (let x = 0; x < WIDTH; x++) {                                                 // Iterate through the cells of each row
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];                     // Create an array with 4 cells in a row horizontally
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];                      // Create an array with 4 cells in a row vertically
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];        // Create an array with 4 cells in a row diagonally and to the right
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];        // Create an array with 4 cells in a row diagonally and to the left

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {                // Passes the various rows to the _win function to check if all cells match
        return true;                                                                  // If one of the 4 function calls returns true, return true
      }
    }
  }
}

function updateClass(evt) {
  if (evt.target.classList.contains("p1")) {
    evt.target.classList.remove("p1", "p2");
    return;
  } else if (evt.target.classList.contains("p2")) {
    evt.target.classList.remove("p1", "p2");
    return;
  }
  evt.target.classList.add(currPlayer === 1 ? "p1" : "p2");
}

function restartGame() {
  window.location.reload();
}

makeBoard();
makeHtmlBoard();

// Add player preview when dropping a game piece
const topRowCells = Array.from(document.querySelectorAll("#column-top td"));
for (let cell of topRowCells) {
  cell.addEventListener("mouseenter", (evt) => {
    updateClass(evt);
  });
  cell.addEventListener("mouseleave", (evt) => {
    updateClass(evt);
  })
}

document.getElementById("btn-play-again").addEventListener("click", restartGame);
document.getElementById("btn-restart").addEventListener("click", restartGame);

