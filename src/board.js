import React, { Component } from "react";
import execute, { getPossibleClick } from "./utils";
import minimax from "./minimax";
import Piece from "./piece";
import "./board.css";

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
    await this.setState({
      clickedNow: [row, column],
    });
    //execution of the game begins here
    //pass the updated state into execute function
    this.boardExecute();
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

    while (this.state.turn === 2) {
      const nextState = minimax(this.state);

      await this.setState({ ...nextState });

      if (await this.checkWin()) {
        return;
      }
    }

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

  renderBoard = (board) => {
    return board.map((row, rowIdx) => (
      <div className="row" key={`row${rowIdx}`}>
        {row.map((column, columnIdx) => (
          <div
            className="column"
            onClick={() => this.handleClick(rowIdx, columnIdx)}
            key={`column${columnIdx}`}
          >
            {column.color === "M" && (
              <div className="red piece">
                {column.isKing && <div className="king" />}
              </div>
            )}
            {column.color === "B" && (
              <div className="blue piece">
                {column.isKing && <div className="king" />}
              </div>
            )}
          </div>
        ))}
      </div>
    ));
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
          <h1>Select Level</h1>
          <div className="button">
            <button onClick={() => this.changeLevel("easy")}>Easy</button>
            <button onClick={() => this.changeLevel("medium")}>Medium</button>
            <button onClick={() => this.changeLevel("hard")}>Hard</button>
          </div>
        </div>
      );
    }

    console.log(this.state);

    return (
      <>
        <div className="player-turn">
          <h1 className="vs-piece">
            <span className="blue">{this.state.piecePlayerBlue}</span>
            <span> VS </span>
            <span className="red">{this.state.piecePlayerRed}</span>
          </h1>
          <h1 className={`player-${this.state.turn}`}>
            {this.state.winner
              ? `${this.state.winner} Win`
              : `Player ${this.state.turn} Turn`}
          </h1>
          <h1
            onClick={() => {
              window.location.reload();
            }}
            className="new-game"
          >
            New Game
          </h1>
        </div>
        <div className="board">{this.renderBoard(this.state.board)}</div>
      </>
    );
  }
}
