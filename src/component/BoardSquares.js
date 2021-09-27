import React from "react";

export const Row = (props) => {
  return (
    <div className="row" key={`row${props.rowIndex}`}>
      {props.rowArr.map((column, index) => /*console.log("COL:", column);*/ /*console.log("COL:", column);*/ /*console.log("COL:", column);*/ {
          return (
              <Column
                  rowIndex={props.rowIndex}
                  index={index}
                  //cell={cell}
                  color={column.color}
                  isKing={column.isKing}
                  handlePieceClick={props.handlePiecePick} />
          );
      })}
    </div>
  );
};

const Column = (props) => {
  return (
    <div
      className={"column"}
      id={`column${props.index}`}
      data-row={props.rowIndex}
      data-column={props.index}
      onClick={props.handlePieceClick}
    >
      {props.color === "M" && (
        <div className="red piece">
          {props.isKing && <div className="king1" />}
        </div>
      )}
      {props.color === "B" && (
        <div className="blue piece">
          {props.isKing && <div className="king2" />}
        </div>
      )}
    </div>
  );
};
