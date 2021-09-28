/* eslint-disable array-callback-return */
import Piece from "./piece";

export default function execute(oldState) {
  const state = getNextStateBoard(oldState);
  state.board = checkKing(state.board);
  return state;
}

export function getNextStateBoard(oldState) {
  const state = JSON.parse(JSON.stringify(oldState));
  const {
    board,
    turn,
    clickedNow,
    clickedBefore,
    possibleMove,
    possibleJumpMove,
  } = state;
  const [row, column] = clickedNow;
  const piece = board[row][column].color;
  const isKing = board[row][column].isKing;

  // check valid click
  if (
    (piece === "0" && clickedBefore.length === 0) ||
    (piece === "b" && turn !== 1) ||
    (piece === "r" && turn !== 2)
  ) {
    return state;
  }

  // click piece that wanto move
  if (clickedBefore.length === 0) {
    const possibleClick = getPossibleClick(piece, board);

    // check if piece clicked is possible to move or not
    if (possibleClick.find((el) => el[0] === row && el[1] === column)) {
      state.clickedBefore = [row, column];
      state.clickedNow = [];
      state.possibleMove = checkPossibleMove(row, column, piece, isKing, board);
      state.possibleJumpMove = checkPossibleJumpMove(
        row,
        column,
        piece,
        isKing,
        board
      );

      return state;
    }

    return state;
  }

  const [rowBefore, columnBefore] = clickedBefore;

  // if double click at the same piece
  if (rowBefore === row && columnBefore === column) {
    state.clickedBefore = [];
    state.clickedNow = [];
    state.possibleJumpMove = [];
    state.possibleMove = [];

    return state;
  }

  // force jump if can jump
  if (possibleJumpMove.length > 0) {
    const canJump = possibleJumpMove.find(
      (el) => el[0] === row && el[1] === column
    );

    // check if move for jump is valid
    if (canJump) {
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[row][column] = board[rowBefore][columnBefore];
      newBoard[rowBefore][columnBefore] = new Piece("0");
      newBoard[canJump[2]][canJump[3]] = new Piece("0");
      state.board = newBoard;

      // counting piece
      if (turn === 1) {
        state.piecePlayerRed -= 1;
      } else {
        state.piecePlayerBlue -= 1;
      }

      const nextJump = checkPossibleJumpMove(
        row,
        column,
        newBoard[row][column].color,
        newBoard[row][column].isKing,
        newBoard
      );

      if (nextJump.length > 0) {
        state.clickedBefore = [row, column];
        state.clickedNow = [];
        state.possibleJumpMove = nextJump;

        return state;
      }

      state.clickedBefore = [];
      state.clickedNow = [];
      state.possibleJumpMove = [];
      state.possibleMove = [];
      state.turn = turn === 1 ? 2 : 1;

      return state;
    }

    state.clickedBefore = [];
    state.clickedNow = [];
    return state;
  }

  if (possibleMove.find((el) => el[0] === row && el[1] === column)) {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][column] = board[rowBefore][columnBefore];
    newBoard[rowBefore][columnBefore] = new Piece("0");
    state.board = newBoard;

    state.possibleJumpMove = [];
    state.possibleMove = [];
    state.clickedBefore = [];
    state.clickedNow = [];
    state.turn = turn === 1 ? 2 : 1;

    return state;
  }

  return state;
}

export function checkPossibleMove(row, column, piece, isKing, board) {
  const move = [];

  if (piece === "b" || isKing) {
    if (
      row - 1 >= 0 &&
      column - 1 >= 0 &&
      board[row - 1][column - 1].color === "0"
    ) {
      move.push([row - 1, column - 1]);
    }
    if (
      row - 1 >= 0 &&
      column + 1 <= 7 &&
      board[row - 1][column + 1].color === "0"
    ) {
      move.push([row - 1, column + 1]);
    }
  }

  if (piece === "r" || isKing) {
    if (
      row + 1 <= 7 &&
      column - 1 >= 0 &&
      board[row + 1][column - 1].color === "0"
    ) {
      move.push([row + 1, column - 1]);
    }
    if (
      row + 1 <= 7 &&
      column + 1 <= 7 &&
      board[row + 1][column + 1].color === "0"
    ) {
      move.push([row + 1, column + 1]);
    }
  }

  return move;
}

export function checkPossibleJumpMove(row, column, piece, isKing, board) {
  const move = [];
  if (piece === "b") {
    if (
      row - 2 >= 0 &&
      column - 2 >= 0 &&
      board[row - 1][column - 1].color === "r" &&
      board[row - 2][column - 2].color === "0"
    ) {
      move.push([row - 2, column - 2, row - 1, column - 1]);
    }
    if (
      row - 2 >= 0 &&
      column + 2 <= 7 &&
      board[row - 1][column + 1].color === "r" &&
      board[row - 2][column + 2].color === "0"
    ) {
      move.push([row - 2, column + 2, row - 1, column + 1]);
    }

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

  if (piece === "r") {
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

  return move;
}

export function checkKing(board) {
  const newBoard = JSON.parse(JSON.stringify(board));
  const firstRow = newBoard[0];
  const lastRow = newBoard[7];

  for (let ii = 0; ii < firstRow.length; ii++) {
    if (firstRow[ii].color === "b") {
      firstRow[ii].isKing = true;
    }
  }

  for (let ii = 0; ii < lastRow.length; ii++) {
    if (lastRow[ii].color === "r") {
      lastRow[ii].isKing = true;
    }
  }

  return newBoard;
}

export function numberOfKings(board) {
  let redKings = 0,
    blueKings = 0;

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

  return [redKings, blueKings];
}

export function getPossibleClick(piece, board) {
  let click = [];
  let clickJump = [];

  for (let ii = 0; ii <= 7; ii++) {
    for (let jj = 0; jj <= 7; jj++) {
      if (board[ii][jj].color === piece) {
        const possibleJumpMove = checkPossibleJumpMove(
          ii,
          jj,
          board[ii][jj].color,
          board[ii][jj].isKing,
          board
        );
        const possibleMove = checkPossibleMove(
          ii,
          jj,
          board[ii][jj].color,
          board[ii][jj].isKing,
          board
        );

        if (possibleJumpMove.length > 0) {
          clickJump.push([ii, jj]);
        }

        if (possibleMove.length > 0) {
          click.push([ii, jj]);
        }
      }
    }
  }

  if (clickJump.length > 0) {
    return clickJump;
  }

  return click;
}
