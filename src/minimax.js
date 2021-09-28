import execute, { getPossibleClick, numberOfKings } from "./utils";

//Alter function executeMiniMax
export default function executeComputerMove(oldState) {
  const { level } = oldState;
  let depth;
  if (level === "Random") {
    return Random(oldState);
  } else if (level === "Mini-Max") {
    depth = 3;
    return miniMax(oldState, depth);
  } else if (level === "Alpha-Beta") {
    depth = 4;
    return alphaBetaPruning(oldState, depth, -10000, 10000);
  }

  return oldState;
}

function Random(oldState) {
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleClick("r", state.board);

  if (possibleClick.length === 0) {
    return { nextState: state };
  }

  let possibleState = [];

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
        // add possible next state
        possibleState.push({
          nextState: result,
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
          //console.log("RESULT:", result);
          result.clickedNow = result.possibleJumpMove[0];
          result = execute(result);
        }

        // add all possible move state
        possibleState.push({
          nextState: result,
        });
      }
    }
  }

  const randomState = Math.floor(Math.random() * possibleState.length);

  return possibleState[randomState].nextState;
}

function miniMax(oldState, depth) {
  const nextState = max(oldState, depth);
  return nextState.nextState;
}

function max(oldState, depth) {
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleClick("r", state.board);

  const kings = numberOfKings(state.board);

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
          value =
            result.piecePlayerRed -
            kings[0] -
            (result.piecePlayerBlue - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = min(result, depth - 1);

          // prunning
          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
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
          value =
            result.piecePlayerRed -
            kings[0] -
            (result.piecePlayerBlue - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = min(result, depth - 1);

          // pruning
          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
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
  //MAYBE WE CAN USE THIS TO IMPLEMENT RANDOM FUNCTION
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort descending by move value
  possibleState.sort((x, y) => {
    return y.value - x.value;
  });

  return possibleState[0];
}

function min(oldState, depth) {
  //console.log("min", depth, "loading");
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleClick("b", state.board);
  const kings = numberOfKings(state.board);

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
          value =
            result.piecePlayerBlue -
            kings[1] -
            (result.piecePlayerRed - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = max(result, depth - 1);

          // prunning
          if (resMax === undefined) {
            break;
          }

          value = resMax.value;
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
          value =
            result.piecePlayerBlue -
            kings[1] -
            (result.piecePlayerRed - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = max(result, depth - 1);

          // pruning
          if (resMax === undefined) {
            break;
          }

          value = resMax.value;
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
  //MAYBE WE CAN USE THIS TO IMPLEMENT RANDOM FUNCTION
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort ascending by move value
  possibleState.sort((x, y) => {
    return x.value - y.value;
  });

  return possibleState[0];
}

function alphaBetaPruning(oldState, depth, Alpha, Beta) {
  const nextState = alphaMax(oldState, depth, Alpha, Beta);
  return nextState.nextState;
}
//ADD RANDOM FUNCTION
//ADD ALPHA BETA PRUNING

//function maxMiniMax(oldState, depth) {}
function alphaMax(oldState, depth = 0, alpha, beta) {
  //console.log("max", depth, "loading");
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleClick("r", state.board);
  const kings = numberOfKings(state.board);

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
          value =
            result.piecePlayerRed -
            kings[0] -
            (result.piecePlayerBlue - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = alphaMin(result, depth - 1, alpha, beta);

          // prunning
          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
        }
        // prunning

        //67-74 I think we can remove to make it purely min-max
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
          //console.log("RESULT:", result);
          result.clickedNow = result.possibleJumpMove[0];
          result = execute(result);
        }

        let value;

        // set value
        if (depth === 0) {
          value =
            result.piecePlayerRed -
            kings[0] -
            (result.piecePlayerBlue - kings[1]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMin = alphaMin(result, depth - 1, alpha, beta);

          // pruning
          if (resMin === undefined) {
            break;
          }

          value = resMin.value;
        }

        // pruning
        //Lines 115-121 can be removes to make it purely min-max
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
  //MAYBE WE CAN USE THIS TO IMPLEMENT RANDOM FUNCTION
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort descending by move value
  possibleState.sort((x, y) => {
    return y.value - x.value;
  });

  return possibleState[0];
}

function alphaMin(oldState, depth = 0, alpha, beta) {
  //console.log("min", depth, "loading");
  const state = JSON.parse(JSON.stringify(oldState));
  const possibleClick = getPossibleClick("b", state.board);
  const kings = numberOfKings(state.board);

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
          value =
            result.piecePlayerBlue -
            kings[1] -
            (result.piecePlayerRed - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = alphaMax(result, depth - 1, alpha, beta);

          // prunning
          if (resMax === undefined) {
            break;
          }

          value = resMax.value;
        }

        // prunning
        //remove lines 189-197 to make it min-max
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
          value =
            result.piecePlayerBlue -
            kings[1] -
            (result.piecePlayerRed - kings[0]) +
            kings[0] * 2 -
            kings[1] * 2;
        } else {
          const resMax = alphaMax(result, depth - 1, alpha, beta);

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
  //MAYBE WE CAN USE THIS TO IMPLEMENT RANDOM FUNCTION
  possibleState.sort(() => Math.round(Math.random()) * 2 - 1);

  // sort ascending by move value
  possibleState.sort((x, y) => {
    return x.value - y.value;
  });

  return possibleState[0];
}
