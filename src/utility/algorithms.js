import { ExecuteMove, getPossibleMoves, numberOfKings } from "./utils";

// function to ExecuteMove the selected mode
export default function executeComputerMove(oldState) {
  const { gameMode } = oldState;
  let depth;
  if (gameMode === "Random") {
    return Random(oldState);
  } else if (gameMode === "Mini-Max") {
    depth = 3;
    return miniMax(oldState, depth);
  } else if (gameMode === "Alpha-Beta") {
    depth = 4;
    return alphaBetaPruning(oldState, depth, -10000, 10000);
  }

  return oldState;
}

// random function
const Random = (oldState) => {
  // get all possible peices that can be clicked
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleMoves("r", state.board);

  if (possibleClick.length === 0) {
    return { nextState: state };
  }

  let possibleState = [];
  // get all possible states of those pieces
  for (let ii = 0; ii < possibleClick.length; ii++) {
    const moveState = JSON.parse(JSON.stringify(state));
    moveState.currentClick = possibleClick[ii];

    const next = ExecuteMove(moveState);
    const possibleJumpMove = next.possibleJumpMove;
    const possibleMove = next.possibleMove;

    // check if it is a normal move
    if (possibleJumpMove.length === 0) {
      for (let jj = 0; jj < possibleMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleMove[jj];

        let result = ExecuteMove(jumpState);
        // add all possible next states
        possibleState.push({
          nextState: result,
        });
      }
    } else {
      // check for jump move

      for (let jj = 0; jj < possibleJumpMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleJumpMove[jj];

        let result = ExecuteMove(jumpState);

        // check if a piece can jump more than once
        while (result.turn === 2) {
          //console.log("RESULT:", result);
          result.currentClick = result.possibleJumpMove[0];
          result = ExecuteMove(result);
        }

        // add all possible move states
        possibleState.push({
          nextState: result,
        });
      }
    }
  }
  // generate a random move
  const randomState = Math.floor(Math.random() * possibleState.length);

  return possibleState[randomState].nextState;
};

// minimax function
const miniMax = (oldState, depth) => {
  const nextState = max(oldState, depth);
  return nextState.nextState;
};

// max function
const max = (oldState, depth) => {
  // get all possible peices that can be clicked
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleMoves("r", state.board);

  // number of kings in current board state
  const kings = numberOfKings(state.board);

  // check if there are no possible moves
  if (possibleClick.length === 0) {
    return { nextState: state, value: 0 };
  }

  let possibleState = [];

  // get all possible states of those pieces
  for (let ii = 0; ii < possibleClick.length; ii++) {
    const moveState = JSON.parse(JSON.stringify(state));
    moveState.currentClick = possibleClick[ii];

    const next = ExecuteMove(moveState);
    const possibleJumpMove = next.possibleJumpMove;
    const possibleMove = next.possibleMove;

    // check if it is a normal move
    if (possibleJumpMove.length === 0) {
      for (let jj = 0; jj < possibleMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleMove[jj];

        let result = ExecuteMove(jumpState);
        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.redPiecesLeft -
            kings[0] -
            (result.bluePiecesLeft - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = min(result, depth - 1);

          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
        }

        // add all possible next states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    } else {
      // for jump move

      for (let jj = 0; jj < possibleJumpMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleJumpMove[jj];

        let result = ExecuteMove(jumpState);

        // check if a piece can jump more than once
        while (result.turn === 2) {
          result.currentClick = result.possibleJumpMove[0];
          result = ExecuteMove(result);
        }

        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.redPiecesLeft -
            kings[0] -
            (result.bluePiecesLeft - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = min(result, depth - 1);

          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
        }

        // add all possible move states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    }
  }
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort in descending order of score
  possibleState.sort((x, y) => {
    return y.value - x.value;
  });

  return possibleState[0];
};

const min = (oldState, depth) => {
  // console.log("min", depth, "loading");

  // get all possible peices that can be clicked
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleMoves("b", state.board);

  //number of kings in current board state
  const kings = numberOfKings(state.board);

  // check if there are no possible movea
  if (possibleClick.length === 0) {
    return { nextState: state, value: 0 };
  }

  let possibleState = [];

  //get all possible states of those pieces
  for (let ii = 0; ii < possibleClick.length; ii++) {
    const moveState = JSON.parse(JSON.stringify(state));
    moveState.currentClick = possibleClick[ii];

    const next = ExecuteMove(moveState);
    const possibleJumpMove = next.possibleJumpMove;
    const possibleMove = next.possibleMove;

    // check if it is anormal move
    if (possibleJumpMove.length === 0) {
      for (let jj = 0; jj < possibleMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleMove[jj];

        let result = ExecuteMove(jumpState);
        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.bluePiecesLeft -
            kings[1] -
            (result.redPiecesLeft - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = max(result, depth - 1);

          if (resMax === undefined) {
            break;
          }

          value = resMax.value;
        }

        // add all possible next states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    } else {
      // for jump move

      for (let jj = 0; jj < possibleJumpMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        const [rowJump, columnJump] = possibleJumpMove[jj];
        jumpState.currentClick = [rowJump, columnJump];

        let result = ExecuteMove(jumpState);

        // check if a piece can jump more than once

        while (result.turn === 1) {
          result.currentClick = result.possibleJumpMove[0];
          result = ExecuteMove(result);
        }

        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.bluePiecesLeft -
            kings[1] -
            (result.redPiecesLeft - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = max(result, depth - 1);

          if (resMax === undefined) {
            break;
          }

          value = resMax.value;
        }

        // add all possible move states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    }
  }

  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort in ascending order of score
  possibleState.sort((x, y) => {
    return x.value - y.value;
  });

  return possibleState[0];
};

// alpha beta pruning
const alphaBetaPruning = (oldState, depth, Alpha, Beta) => {
  const nextState = alphaMax(oldState, depth, Alpha, Beta);
  return nextState.nextState;
};

// alphaMax function
const alphaMax = (oldState, depth = 0, alpha, beta) => {
  // console.log("max", depth, "loading");

  // get all possible peices that can be clicked
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleMoves("r", state.board);

  // number of kings in current board state
  const kings = numberOfKings(state.board);

  // check if there are no possible moves
  if (possibleClick.length === 0) {
    return { nextState: state, value: 0 };
  }

  let possibleState = [];

  // get all possible states of those pieces
  for (let ii = 0; ii < possibleClick.length; ii++) {
    const moveState = JSON.parse(JSON.stringify(state));
    moveState.currentClick = possibleClick[ii];

    const next = ExecuteMove(moveState);
    const possibleJumpMove = next.possibleJumpMove;
    const possibleMove = next.possibleMove;

    // check if it is a normal move
    if (possibleJumpMove.length === 0) {
      for (let jj = 0; jj < possibleMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleMove[jj];

        let result = ExecuteMove(jumpState);
        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.redPiecesLeft -
            kings[0] -
            (result.bluePiecesLeft - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = alphaMin(result, depth - 1, alpha, beta);

          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
        }

        // prunning
        if (value > alpha) {
          alpha = value;
        }

        if (beta <= alpha) {
          break;
        }

        // add all possible next states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    } else {
      // for jump move

      for (let jj = 0; jj < possibleJumpMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleJumpMove[jj];

        let result = ExecuteMove(jumpState);

        // check if the piece can jump more than once
        while (result.turn === 2) {
          //console.log("RESULT:", result);
          result.currentClick = result.possibleJumpMove[0];
          result = ExecuteMove(result);
        }

        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.redPiecesLeft -
            kings[0] -
            (result.bluePiecesLeft - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = alphaMin(result, depth - 1, alpha, beta);

          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
        }

        // pruning
        if (value > alpha) {
          alpha = value;
        }

        if (beta <= alpha) {
          break;
        }

        // add all possible move states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    }
  }
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort in descending order of score
  possibleState.sort((x, y) => {
    return y.value - x.value;
  });

  return possibleState[0];
};

//alphaMin function
const alphaMin = (oldState, depth = 0, alpha, beta) => {
  //console.log("min", depth, "loading");

  //get all possible peices that can be clicked
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleMoves("b", state.board);

  //number of kings in current board state
  const kings = numberOfKings(state.board);

  // check if there are no possible moves
  if (possibleClick.length === 0) {
    return { nextState: state, value: 0 };
  }

  let possibleState = [];

  // get all possible states of those pieces
  for (let ii = 0; ii < possibleClick.length; ii++) {
    const moveState = JSON.parse(JSON.stringify(state));
    moveState.currentClick = possibleClick[ii];

    const next = ExecuteMove(moveState);
    const possibleJumpMove = next.possibleJumpMove;
    const possibleMove = next.possibleMove;

    // check if it is a normal move
    if (possibleJumpMove.length === 0) {
      for (let jj = 0; jj < possibleMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.currentClick = possibleMove[jj];

        let result = ExecuteMove(jumpState);
        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.bluePiecesLeft -
            kings[1] -
            (result.redPiecesLeft - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = alphaMax(result, depth - 1, alpha, beta);

          if (resMax === undefined) {
            break;
          }

          value = resMax.value;
        }

        // prunning
        if (value < beta) {
          beta = value;
        }

        if (beta <= alpha) {
          break;
        }

        // add all possible next states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    } else {
      // for jump move

      for (let jj = 0; jj < possibleJumpMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        const [rowJump, columnJump] = possibleJumpMove[jj];
        jumpState.currentClick = [rowJump, columnJump];

        let result = ExecuteMove(jumpState);

        // check the piece can jump more than once

        while (result.turn === 1) {
          result.currentClick = result.possibleJumpMove[0];
          result = ExecuteMove(result);
        }

        let value;

        // calculate score
        if (depth === 0) {
          value =
            result.bluePiecesLeft -
            kings[1] -
            (result.redPiecesLeft - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = alphaMax(result, depth - 1, alpha, beta);

          if (resMax === undefined) {
            break;
          }

          value = resMax.value;
        }

        // pruning
        if (value < beta) {
          beta = value;
        }

        if (beta <= alpha) {
          break;
        }

        // add all possible move states
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    }
  }

  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort in ascending order of score
  possibleState.sort((x, y) => {
    return x.value - y.value;
  });

  return possibleState[0];
};
