import React, { Component } from "react";
import { ExecuteMove, getPossibleMoves } from "../../utility/utils";
import "./board.css";
import executeComputerMove from "../../utility/algorithms";
import { InitialGameBoard } from "../BoardSquares/BoardSquares";

//this file contains our entire board state, some helper functions to instantiate the game and also the redering of entire UI

//initial board state
export default class Board extends Component {
  state = {
    turn: 1, //set the turn for which player, initially player 1 turn and changes alternately
    possibleMove: [], //stores all possible moves for a piece
    possibleJumpMove: [], //stores all possible jump moves for a piece
    previousClick: [], //state changes when a box is clicked and it's coordinates are stored
    currentClick: [], //state changes when a box is clicked and it's coordinates are stored
    bluePiecesLeft: 12, //number of blue pieces
    redPiecesLeft: 12, //number of red pieces
    winner: "", //store the winner
    player: 1, //make it null to make it a 2 player game
    gameMode: null, //set the level of the game (basically to decide what algo to play against)
    board: InitialGameBoard, //setting up our initial board
    numberOfMoves: 0, //total number of moves in a single game
    checkNumberForDrawMoves: 0, //used to check draw condition
  };
  /**
   * map current clicked pieces
   */
  handleClick = async (row, column) => {
    await this.setState({
      currentClick: [row, column],
    });

    //execution starts here
    //pass the updated state into ExecuteMove function
    await this.boardExecute();

    //console.log(this.state.board[0][0].color);

    //console.log(this.state.possibleMove);
    if (this.state.possibleMove != null) {
      //this.highlightPossibleMove();
    }
  };

  // execution of game takes place in this function.
  boardExecute = async () => {
    //updating the state of our board after executing a particular move
    let newState = ExecuteMove(this.state);
    await this.setState({ ...newState });

    //checking the win condition after executing each move
    if (await this.checkWin()) {
      return;
    }

    //if it's two player game then we don't need to execute computer turn, so it won't proceed further in this function.
    if (this.state.player === 2) {
      return;
    }

    //executing computer move after showing a slight delay for better user experience.
    setTimeout(async () => {
      while (this.state.turn === 2) {
        //storing the new state after executing computer move
        const nextState = executeComputerMove(this.state);

        //updating ouf board state
        await this.setState({ ...nextState });

        //checking for win condition
        if (await this.checkWin()) {
          return;
        }
      }
    }, 1500);

    if (await this.checkWin()) {
      return;
    }
  };

  //function that checks for the winning conditions and declare possible winner
  checkWin = async () => {
    //gets the board stats
    const { bluePiecesLeft, redPiecesLeft, turn } = this.state;
    //gets possible moves for the current user
    const possibleClick = getPossibleMoves(
      turn === 1 ? "b" : "r",
      this.state.board
    );

    //declaring the winner after checking the conditons if any one of them passes
    //For draw condition we check if in past 50 moves no king was made or no pieces were eleminated of either of the players
    if (bluePiecesLeft === 0) {
      await this.setState({ winner: "Player 2 Win!!"  });
      return true;
    } else if (redPiecesLeft === 0) {
      await this.setState({ winner: "Player 1 Win!!" });
      return true;
    } else if (possibleClick.length === 0) {
      await this.setState({ winner: turn === 1 ? "Player 2 Win!!" : "Player 1 Win!!" });
      return true;
    } else if (this.state.checkNumberForDrawMoves / 2 === 50) {
      await this.setState({ winner: "DRAW" });
      return true;
    }
    return false;
  };

  //was trying to implement highlight possible moves!

  // highlightPossibleMove = () => {
  //   this.state.board = this.state.board.map((row) => {
  //     return row.map((column) => {
  //       //console.log(column.color);

  //       return column.color.replace("h", "0").replace(/d\d\d/g, "").trim();
  //     });
  //   });

  //   //console.log(this.state.board[0][0].color);

  //   this.state.possibleMove.map((move) => {
  //     //console.log(move[0]);
  //     // console.log(this.state.board);
  //     console.log(this.state.board[move[0]][move[1]].color);
  //     return (this.state.board[move[0]][move[1]] = "h");
  //   });
  // };

  //function to render our game
  renderBoard = (board) => {
    //mapping through the initial board array to render individual boxes and pieces
    return board.map((row, row_index) => {
      //console.log("ROW:", row);
      return (
        //creating rows
        <div className="row" key={`row${row_index}`}>
          {
            //mapping through rows to render column
            row.map((column, column_index) => {
              //console.log("COL:", column);
              //rendering columns and the pieces(red and blue and kings(after checking conditions))
              return (
                <div
                  className="column"
                  onClick={() => {
                    this.handleClick(row_index, column_index);
                  }}
                  id={`column${column_index}`}
                >
                  {column.color === "r" && (
                    <div className="red piece">
                      {column.isKing && <div className="king1" />}
                    </div>
                  )}
                  {column.color === "b" && (
                    <div className="blue piece">
                      {column.isKing && <div className="king2" />}
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>
      );
    });
  };

  //function to change number of players, if user vs ai : no of players = 1 else number of players = 2
  changeNumberOfPlayer = (number) => {
    this.setState({ player: number });
  };

  //function to change the level of game basically to choose the algo you wanna play against
  updateLevel = (gameMode) => {
    this.setState({ gameMode: gameMode });
  };

  //rendering our homepage, board and all other required components
  render() {
    console.log("state:", this.state);
    // if (this.state.player === null) {
    //   return (
    //     <div className="choose">
    //       <h1 className="heading">Checkers AI</h1>
    //       <div className="button">
    //         <button onClick={() => this.changeNumberOfPlayer(1)}>
    //           1 Player
    //         </button>
    //         <button onClick={() => this.changeNumberOfPlayer(2)}>
    //           2 Player
    //         </button>
    //       </div>
    //     </div>
    //   );
    // }
    //Div to choose the level or mode
    if (this.state.player === 1 && this.state.gameMode === null) {
      return (
        <div className="choose">
          <h1 className="heading">CHECKERS AI</h1>
          <h2 class="select_level">CHOOSE A GAME MODE</h2>
          <div className="button">
            <button onClick={() => this.updateLevel("Random")}>Random</button>
            <button onClick={() => this.updateLevel("Mini-Max")}>
              Mini-Max
            </button>
            <button onClick={() => this.updateLevel("Alpha-Beta")}>
              Alpha-Beta
            </button>
          </div>
        </div>
      );
    }

    //rendering our game board page with all components
    return (
      <>
        <div className="player-turn-1">
          <h2 className={`player-${this.state.turn}`}>
            {this.state.winner
              ? `${this.state.winner}`
              : `Player ${this.state.turn}'s Turn`}
          </h2>
        </div>
        <div className="board">{this.renderBoard(this.state.board)}</div>
        <div className="player-turn">
          <h2 className="vs-piece">
            <span className="blue">{this.state.bluePiecesLeft}</span>
            <span> VS </span>
            <span className="red">{this.state.redPiecesLeft}</span>
          </h2>
          <h2 className="game-mode">
            <span>
              MODE:{" "}
              <span className="game-mode-text">{this.state.gameMode}</span>
            </span>
          </h2>
          <h2
            onClick={() => {
              window.location.reload();
            }}
            className="new-game"
          >
            NEW GAME
          </h2>
        </div>
      </>
    );
  }
}
