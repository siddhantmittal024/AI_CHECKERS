import GamePiece from "../BoardPieces/piece";
import React from "react";

// board structure
export const InitialGameBoard = [
  [
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
  ],
  [
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
  ],
  [
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
    new GamePiece("0"),
    new GamePiece("r"),
  ],

  [
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
  ],
  [
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
    new GamePiece("0"),
  ],
  [
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
  ],
  [
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
  ],
  [
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
    new GamePiece("b"),
    new GamePiece("0"),
  ],
];

// function to render rows of the board
export const Row = (props) => {
  return (
    <div className="row" key={`row${props.rowIndex}`}>
      {props.rowArr.map(
        (
          column,
          index
        ) => /*console.log("COL:", column);*/ /*console.log("COL:", column);*/ /*console.log("COL:", column);*/ {
          return (
            <Column
              rowIndex={props.rowIndex}
              index={index}
              //cell={cell}
              color={column.color}
              isKing={column.isKing}
              handlePieceClick={props.handlePiecePick}
            />
          );
        }
      )}
    </div>
  );
};

// function to render columns of the board
const Column = (props) => {
  return (
    <div
      className={"column"}
      id={`column${props.index}`}
      data-row={props.rowIndex}
      data-column={props.index}
      onClick={props.handlePieceClick}
    >
      {props.color === "r" && (
        <div className="red piece">
          {props.isKing && <div className="king1" />}
        </div>
      )}
      {props.color === "b" && (
        <div className="blue piece">
          {props.isKing && <div className="king2" />}
        </div>
      )}
    </div>
  );
};
