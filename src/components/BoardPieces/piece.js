// call to define piece 
export default class GamePiece {
  // constructor to initialise properties of piece
  constructor(color, isKing = false) {
    this.color = color;
    this.isKing = isKing;
  }
}
