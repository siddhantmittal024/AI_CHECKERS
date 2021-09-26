import execute, { getPossibleClick } from "./utils";

export default function executeMinimax(oldState) {
  const { level } = oldState;
  let depth;

  // check level for set depth of minimax
  if (level === "easy") {
    depth = 0;
  } else if (level === "medium") {
    depth = 2;
  } else if (level === "hard") {
    depth = 4;
  }

  const nextState = max(oldState, depth, -1000, 1000);
  return nextState.nextState;
}

function max(oldState, depth = 0, alpha, beta) {
  console.log("max", depth, "loading");
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleClick("M", state.board);

  // check if there is not possible move
  if (possibleClick.length === 0) {
    return { nextState: state, value: 0 };
  }

  let possibleState = [];

  // check for all possible piece to clicked
  for (let ii = 0; ii < possibleClick.length; ii++) {
    const moveState = JSON.parse(JSON.stringify(state));
    moveState.clickedNow = possibleClick[ii];

    const next = execute(moveState);
    const possibleJumpMove = next.possibleJumpMove;
    const possibleMove = next.possibleMove;

    // check if normal move
    if (possibleJumpMove.length === 0) {
      for (let jj = 0; jj < possibleMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.clickedNow = possibleMove[jj];

        let result = execute(jumpState);
        let value;

        // set value
        if (depth === 0) {
          value = result.piecePlayerRed - result.piecePlayerBlue;
        } else {
          const resMin = min(result, depth - 1, alpha, beta);

          // prunning
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

        // add possible next state
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    } else {
      // for jump move

      for (let jj = 0; jj < possibleJumpMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.clickedNow = possibleJumpMove[jj];

        let result = execute(jumpState);

        // check if can jump more than once
        while (result.turn === 2) {
          result.clickedNow = result.possibleJumpMove[0];
          result = execute(result);
        }

        let value;

        // set value
        if (depth === 0) {
          value = result.piecePlayerRed - result.piecePlayerBlue;
        } else {
          const resMin = min(result, depth - 1, alpha, beta);

          // pruning
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

        // add all possible move state
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    }
  }

  // randomize all
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort descending by move value
  possibleState.sort((x, y) => {
    return y.value - x.value;
  });

  return possibleState[0];
}

function min(oldState, depth = 0, alpha, beta) {
  console.log("min", depth, "loading");
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleClick("B", state.board);

  // check if there is not possible move
  if (possibleClick.length === 0) {
    return { nextState: state, value: 0 };
  }

  let possibleState = [];

  // check for all possible piece to clicked
  for (let ii = 0; ii < possibleClick.length; ii++) {
    const moveState = JSON.parse(JSON.stringify(state));
    moveState.clickedNow = possibleClick[ii];

    const next = execute(moveState);
    const possibleJumpMove = next.possibleJumpMove;
    const possibleMove = next.possibleMove;

    // check if normal move
    if (possibleJumpMove.length === 0) {
      for (let jj = 0; jj < possibleMove.length; jj++) {
        const jumpState = JSON.parse(JSON.stringify(next));
        jumpState.clickedNow = possibleMove[jj];

        let result = execute(jumpState);
        let value;

        // set value
        if (depth === 0) {
          value = result.piecePlayerBlue - result.piecePlayerRed;
        } else {
          const resMax = max(result, depth - 1, alpha, beta);

          // prunning
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

        // add possible next state
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
        jumpState.clickedNow = [rowJump, columnJump];

        let result = execute(jumpState);

        // check if can jump more than once

        while (result.turn === 1) {
          result.clickedNow = result.possibleJumpMove[0];
          result = execute(result);
        }

        let value;

        // set value
        if (depth === 0) {
          value = result.piecePlayerBlue - result.piecePlayerRed;
        } else {
          const resMax = max(result, depth - 1, alpha, beta);

          // pruning
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

        // add all possible move state
        possibleState.push({
          nextState: result,
          value: value,
        });
      }
    }
  }

  // randomize all
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort ascending by move value
  possibleState.sort((x, y) => {
    return x.value - y.value;
  });

  return possibleState[0];
}
