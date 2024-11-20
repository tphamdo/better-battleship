import Gameboard from './Gameboard';
import { Placement, Coordinate, AttackResult } from './Gameboard';

class Player {
  readonly gameboard: Gameboard;
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
    this.gameboard = new Gameboard(boardSize);
    this.name = name;
    this.isComputer = isComputer;
  }

  public placeShip(placement: Placement) {
    this.gameboard.placeShip(placement);
  }

  public receiveAttack(coord: Coordinate): AttackResult {
    return this.gameboard.receiveAttack(coord);
  }

  get isLost(): boolean {
    return this.gameboard.allShipsSunk();
  }

}

export default Player;
