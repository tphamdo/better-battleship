import Gameboard from './Gameboard';
import { Placement, Coordinate, AttackResult } from './Gameboard';

class Player {
  private _gameboard: Gameboard;
  readonly name: String;
  readonly isComputer: boolean;

  constructor({
    name = '',
    boardSize = 10,
    isComputer = false,
  }: {
    name?: string;
    boardSize?: number;
    isComputer?: boolean;
  }) {
    this._gameboard = new Gameboard(boardSize);
    this.name = name;
    this.isComputer = isComputer;
  }

  public placeShip(placement: Placement) {
    this._gameboard.placeShip(placement);
  }

  public receiveAttack(coord: Coordinate): AttackResult {
    return this._gameboard.receiveAttack(coord);
  }

  get isLost(): boolean {
    return this._gameboard.allShipsSunk();
  }
}

export default Player;
