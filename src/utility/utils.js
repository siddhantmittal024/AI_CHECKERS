/* eslint-disable array-callback-return */
import GamePiece from "../components/BoardPieces/piece";

// helper function to get next board state and execute it
// returns current updated state after checking existing kings
export const ExecuteMove = (oldState) => {
  // check for draw
  let prevRedPiece = oldState.redPiecesLeft;
  let prevBluePiece = oldState.bluePiecesLeft;
  let prevKings = numberOfKings(oldState.board);

  const state = getUpdatedState(oldState);
  let newKings = numberOfKings(state.board);
  // checks number of kings
  state.board = checkKingStatus(state.board);
  if (
    state.redPiecesLeft !== prevRedPiece ||
    state.bluePiecesLeft !== prevBluePiece ||
    prevKings[0] !== newKings[0] ||
    prevKings[1] !== newKings[1]
  ) {
    state.checkNumberForDrawMoves = 0;
    prevRedPiece = state.redPiecesLeft;
    prevBluePiece = state.bluePiecesLeft;
  } else {
    state.checkNumberForDrawMoves += 1;
  }

  return state;
};

// initialized the board with the current clicked pieces
// and king status
export const getUpdatedState = (oldState) => {
  const state = JSON.parse(JSON.stringify(oldState));
  const {
    board,
    turn,
    currentClick,
    previousClick,
    possibleMove,
    possibleJumpMove,
  } = state;

  // updates current selected piece, color and kings
  const [row, column] = currentClick;
  const piece = board[row][column].color;
  const isKing = board[row][column].isKing;

  // validates the click done by the user, and checks turn of user
  if (
    (piece === "0" && previousClick.length === 0) ||
    (piece === "b" && turn !== 1) ||
    (piece === "r" && turn !== 2)
  ) {
    return state;
  }

  // to click the piece that we require to be moved
  // gets possible options for next play
  if (previousClick.length === 0) {
    const possibleClick = getPossibleMoves(piece, board);

    // to check if the click is valid or not
    // if it falls within the required boundaries
    if (possibleClick.find((el) => el[0] === row && el[1] === column)) {
      state.previousClick = [row, column];
      state.currentClick = [];
      // updates the state according to possible moves and jumps
      state.possibleMove = checkPossibleMove(row, column, piece, isKing, board);
      state.possibleJumpMove = checkPossibleJumpMove(
        row,
        column,
        piece,
        isKing,
        board
      );

      state.numberOfMoves += 1;

      return state;
    }

    return state;
  }

  // stores the moves of the previous click
  const [rowBefore, columnBefore] = previousClick;

  // block to handle a double click on the same piece
  if (rowBefore === row && columnBefore === column) {
    state.previousClick = [];
    state.currentClick = [];
    state.possibleJumpMove = [];
    state.possibleMove = [];

    return state;
  }

  // if a jump is possible, forces the user to jump
  // cannot play any other move, according to the rules of the game
  if (possibleJumpMove.length > 0) {
    const canJump = possibleJumpMove.find(
      (el) => el[0] === row && el[1] === column
    );

    // after forcing the jump, checking if the move for the jump was valid
    if (canJump) {
      const newBoard = JSON.parse(JSON.stringify(board));
      // transfers old board state to new board and sets it
      newBoard[row][column] = board[rowBefore][columnBefore];
      newBoard[rowBefore][columnBefore] = new GamePiece("0");
      newBoard[canJump[2]][canJump[3]] = new GamePiece("0");
      state.board = newBoard;

      // to count how many pieces of each player are left on the board
      if (turn === 1) {
        state.redPiecesLeft -= 1;
      } else {
        state.bluePiecesLeft -= 1;
      }
      // checks for possible next jump moves, when input with coordinates of
      // next move and turn of player, and how many kings on the current board
      const nextJump = checkPossibleJumpMove(
        row,
        column,
        newBoard[row][column].color,
        newBoard[row][column].isKing,
        newBoard
      );

      // if a jump is possible, updates possible jump move with the same
      if (nextJump.length > 0) {
        state.previousClick = [row, column];
        state.currentClick = [];
        state.possibleJumpMove = nextJump;

        return state;
      }

      // after preliminary checks, updates the state of the board
      // and according to previous turn, updates the next player turn
      state.previousClick = [];
      state.currentClick = [];
      state.possibleJumpMove = [];
      state.possibleMove = [];
      state.turn = turn === 1 ? 2 : 1;

      return state;
    }

    state.previousClick = [];
    state.currentClick = [];
    return state;
  }

  // if jump is not possible, finds other possible moves
  if (possibleMove.find((el) => el[0] === row && el[1] === column)) {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][column] = board[rowBefore][columnBefore];
    newBoard[rowBefore][columnBefore] = new GamePiece("0");
    state.board = newBoard;

    // after preliminary checks, updates the state of the board
    // and according to previous turn, updates the next player turn
    state.possibleJumpMove = [];
    state.possibleMove = [];
    state.previousClick = [];
    state.currentClick = [];
    state.turn = turn === 1 ? 2 : 1;

    return state;
  }

  return state;
};

// function to check possible moves for a click when input with the corrdinates
// of the click and the current state of the board
export const checkPossibleMove = (row, column, piece, isKing, board) => {
  // array to store the final allowed moves after checking
  const move = [];

  // for blue player or king
  if (piece === "b" || isKing) {
    if (
      row - 1 >= 0 &&
      column - 1 >= 0 &&
      board[row - 1][column - 1].color === "0"
    ) {
      // adds possible move to array
      move.push([row - 1, column - 1]);
    }
    if (
      row - 1 >= 0 &&
      column + 1 <= 7 &&
      board[row - 1][column + 1].color === "0"
    ) {
      // computes opposite direction possible move and adds
      move.push([row - 1, column + 1]);
    }
  }

  // for red piece or red kings
  if (piece === "r" || isKing) {
    if (
      row + 1 <= 7 &&
      column - 1 >= 0 &&
      board[row + 1][column - 1].color === "0"
    ) {
      // adds possible move to array
      move.push([row + 1, column - 1]);
    }
    if (
      row + 1 <= 7 &&
      column + 1 <= 7 &&
      board[row + 1][column + 1].color === "0"
    ) {
      // computes opposite direction possible move and adds
      move.push([row + 1, column + 1]);
    }
  }
  // returns array of all possible moves
  return move;
};

// function to check possible jump moves when input with coordinates and
// current state of the board
export const checkPossibleJumpMove = (row, column, piece, isKing, board) => {
  // array of possible jump moves is initialized
  const move = [];

  // blue player's turn
  // if the piece is not a king
  if (piece === "b") {
    if (
      row - 2 >= 0 &&
      column - 2 >= 0 &&
      board[row - 1][column - 1].color === "r" &&
      board[row - 2][column - 2].color === "0"
    ) {
      // instead of direct move, adds jump move to array
      move.push([row - 2, column - 2, row - 1, column - 1]);
    }
    if (
      row - 2 >= 0 &&
      column + 2 <= 7 &&
      board[row - 1][column + 1].color === "r" &&
      board[row - 2][column + 2].color === "0"
    ) {
      // adds opposite direction possible jump move
      move.push([row - 2, column + 2, row - 1, column + 1]);
    }

    // if the piece is a king
    if (isKing) {
      if (
        row + 2 <= 7 &&
        column - 2 >= 0 &&
        board[row + 1][column - 1].color === "r" &&
        board[row + 2][column - 2].color === "0"
      ) {
        move.push([row + 2, column - 2, row + 1, column - 1]);
      }
      if (
        row + 2 <= 7 &&
        column + 2 <= 7 &&
        board[row + 2][column + 2].color === "0" &&
        board[row + 1][column + 1].color === "r"
      ) {
        move.push([row + 2, column + 2, row + 1, column + 1]);
      }
    }
  }

  // red piece's turn
  if (piece === "r") {
    // if the piece is red but not a king:
    if (
      row + 2 <= 7 &&
      column - 2 >= 0 &&
      board[row + 1][column - 1].color === "b" &&
      board[row + 2][column - 2].color === "0"
    ) {
      move.push([row + 2, column - 2, row + 1, column - 1]);
    }
    if (
      row + 2 <= 7 &&
      column + 2 <= 7 &&
      board[row + 2][column + 2].color === "0" &&
      board[row + 1][column + 1].color === "b"
    ) {
      move.push([row + 2, column + 2, row + 1, column + 1]);
    }

    // if the piece is a king and red in colour
    if (isKing) {
      if (
        row - 2 >= 0 &&
        column - 2 >= 0 &&
        board[row - 1][column - 1].color === "b" &&
        board[row - 2][column - 2].color === "0"
      ) {
        move.push([row - 2, column - 2, row - 1, column - 1]);
      }
      if (
        row - 2 >= 0 &&
        column + 2 <= 7 &&
        board[row - 1][column + 1].color === "b" &&
        board[row - 2][column + 2].color === "0"
      ) {
        move.push([row - 2, column + 2, row - 1, column + 1]);
      }
    }
  }

  // returns the array of possible jump moves after a particular click
  return move;
};

// checks when a piece becomes a king after inputting the current board in play
export const checkKingStatus = (board) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const firstRow = newBoard[0];
  const lastRow = newBoard[7];

  // checks the colour of the piece that is on the opposite side of the board and
  // sets it as king accordingly
  for (let i = 0; i < firstRow.length; i++) {
    if (firstRow[i].color === "b") {
      firstRow[i].isKing = true;
    }
  }

  for (let i = 0; i < lastRow.length; i++) {
    if (lastRow[i].color === "r") {
      lastRow[i].isKing = true;
    }
  }

  // returns the new board state with updated king status
  return newBoard;
};

// function to check the number of kings on the board at a given point of time
// when input with the current board state
export const numberOfKings = (board) => {
  // initialize number of red kings and blue kings
  let redKings = 0,
    blueKings = 0;

  // input the row and index, check if the piece is a king and increase frequency
  board.map((row, idx) => {
    row.map((column) => {
      if (column.isKing) {
        if (column.color === "r") {
          redKings += 1;
        } else {
          blueKings += 1;
        }
      }
    });
  });

  // return number of red kings and blue kings
  return [redKings, blueKings];
};

// function to return possible moves that can be played when we input
// a particular piece and the current state of the board
export const getPossibleMoves = (piece, board) => {
  // store the current click and jump
  let click = [];
  let clickJump = [];

  //let limit = 7;
  for (let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      // gets possible jump moves for a particular click
      if (board[i][j].color === piece) {
        const possibleJumpMove = checkPossibleJumpMove(
          i,
          j,
          board[i][j].color,
          board[i][j].isKing,
          board
        );
        // if a jump move is not possible, checks ordinary move
        const possibleMove = checkPossibleMove(
          i,
          j,
          board[i][j].color,
          board[i][j].isKing,
          board
        );

        if (possibleJumpMove.length > 0) {
          clickJump.push([i, j]);
        }

        if (possibleMove.length > 0) {
          click.push([i, j]);
        }
      }
    }
  }

  // returns array of possible jumps and moves
  if (clickJump.length > 0) {
    return clickJump;
  }

  return click;
};
