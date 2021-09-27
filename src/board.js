import React, { Component } from "react";
import execute, { getPossibleClick } from "./utils";
import Piece from "./piece";
import "./board.css";
import executeComputerMove from "./minimax";

//[0 M 0 M 0 M 0 M
// M 0 M 0 M 0 M 0
// 0 M 0 M 0 M 0 M
// 0 0 0 0 0 0 0 0
// 0 0 0 0 0 0 0 0
// B 0 B 0 B 0 B 0
// 0 B 0 B 0 B 0 B
// B 0 B 0 B 0 B 0]

export default class Board extends Component {
  state = {
    //initial board
    board: [
      [
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
      ],
      [
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
      ],
      [
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
        new Piece("0"),
        new Piece("M"),
      ],

      [
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
      ],
      [
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
        new Piece("0"),
      ],
      [
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
      ],
      [
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
      ],
      [
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
        new Piece("B"),
        new Piece("0"),
      ],
    ],
    //p1 or p2
    turn: 1,
    possibleMove: [],
    possibleJumpMove: [],
    clickedBefore: [],
    clickedNow: [],
    piecePlayerBlue: 12, //number of blue pieces
    piecePlayerRed: 12, //number of red pieces
    winner: "",
    player: null,
    level: null,
  };
  /**
   * input the index, map it to current clicked piece
   */
  handleClick = async (row, column) => {
    //const row = await parseInt(e.target.attributes["data-row"].nodeValue);
    //console.log("row:", row);
    //const column = await parseInt(e.target.attributes["data-column"].nodeValue);
    //console.log("column:", column);
    await this.setState({
      clickedNow: [row, column],
    });

    //execution of the game begins here
    //pass the updated state into execute functi
    await this.boardExecute();

    //console.log(this.state.board[0][0].color);

    //console.log(this.state.possibleMove);
    if (this.state.possibleMove != null) {
      //this.highlightPossibleMove();
    }
  };

  boardExecute = async () => {
    let newState = execute(this.state);
    await this.setState({ ...newState });

    if (await this.checkWin()) {
      return;
    }

    if (this.state.player === 2) {
      return;
    }

    setTimeout(async () => {
      while (this.state.turn === 2) {
        const nextState = executeComputerMove(this.state);

        await this.setState({ ...nextState });

        if (await this.checkWin()) {
          return;
        }

        //break;
      }
    }, 1500);

    if (await this.checkWin()) {
      return;
    }
  };

  checkWin = async () => {
    const { piecePlayerBlue, piecePlayerRed, turn } = this.state;
    const possibleClick = getPossibleClick(
      turn === 1 ? "B" : "M",
      this.state.board
    );

    if (piecePlayerBlue === 0) {
      await this.setState({ winner: "Player 2" });
      return true;
    } else if (piecePlayerRed === 0) {
      await this.setState({ winner: "Player 1" });
      return true;
    } else if (possibleClick.length === 0) {
      await this.setState({ winner: turn === 1 ? "Player 2" : "Player 1" });
      return true;
    }
    return false;
  };

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

  renderBoard = (board) => {
    return board.map((row, rowIdx) => {
      //console.log("ROW:", row);
      return (
        // <Row
        //   rowArr={row}
        //   handlePiecePick={this.handleClick}
        //   rowIndex={rowIdx}
        // />
        <div className="row" key={`row${rowIdx}`}>
          {row.map((column, columnIdx) => {
            //console.log("COL:", column);
            return (
              <div
                className="column"
                onClick={() => {
                  this.handleClick(rowIdx, columnIdx);
                }}
                id={`column${columnIdx}`}
              >
                {column.color === "M" && (
                  <div className="red piece">
                    {column.isKing && <div className="king1" />}
                  </div>
                )}
                {column.color === "B" && (
                  <div className="blue piece">
                    {column.isKing && <div className="king2" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    });
  };

  changeNumberOfPlayer = (number) => {
    this.setState({ player: number });
  };

  changeLevel = (level) => {
    this.setState({ level: level });
  };

  render() {
    if (this.state.player === null) {
      return (
        <div className="choose">
          <h1 className="heading">Checkers AI</h1>
          <div className="button">
            <button onClick={() => this.changeNumberOfPlayer(1)}>
              1 Player
            </button>
            <button onClick={() => this.changeNumberOfPlayer(2)}>
              2 Player
            </button>
          </div>
        </div>
      );
    }

    if (this.state.player === 1 && this.state.level === null) {
      return (
        <div className="choose">
          <h2 class="select_level">Select Level</h2>
          <div className="button">
            <button onClick={() => this.changeLevel("Random")}>Random</button>
            <button onClick={() => this.changeLevel("Mini-Max")}>
              Mini-Max
            </button>
            <button onClick={() => this.changeLevel("Alpha-Beta")}>
              Alpha Beta
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="player-turn">
          <h2 className="vs-piece">
            <span className="blue">{this.state.piecePlayerBlue}</span>
            <span> VS </span>
            <span className="red">{this.state.piecePlayerRed}</span>
          </h2>
          <h2 className={`player-${this.state.turn}`}>
            {this.state.winner
              ? `${this.state.winner} Win`
              : `Player ${this.state.turn} Turn`}
          </h2>
          <h2
            onClick={() => {
              window.location.reload();
            }}
            className="new-game"
          >
            New Game
          </h2>
        </div>
        <div className="board">{this.renderBoard(this.state.board)}</div>
      </>
    );
  }
}
