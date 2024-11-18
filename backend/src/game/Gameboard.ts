import Ship from './Ship';

class Gameboard {
  private _board: Cell[][];
  private _ships: Ship[] = [];
  readonly size: number;

  constructor(size: number = 10) {
    this.size = size;
    this._board = Array(size)
      .fill(null)
      .map((_) => new Array(size).fill({ cellValue: CellValue.EMPTY }));
  }

  public placeShip(placement: Placement) {
    if (!this._isValidPlacement(placement)) throw Error('Not a valid placement');
    const { start, shipLength, direction } = placement;

    const ship = new Ship(shipLength);
    this._ships.push(ship);

    for (let i = 0; i < shipLength; ++i) {
      const cell = {
        cellValue: CellValue.SHIP,
        ship,
        shipPos: i,
      };
      if (direction === Direction.DOWN)
        this._board[start.x][start.y + i] = cell;
      else if (direction === Direction.RIGHT)
        this._board[start.x + i][start.y] = cell;
    }
  }

  public receiveAttack(coord: Coordinate): AttackResult {
    if (!this._isValidCoordinate(coord)) return AttackResult.INVALID_ATTACK;
    const cell = this._board[coord.x][coord.y];
    if (cell.cellValue === CellValue.SHIP) {
      if (!cell.ship) throw Error('Cell with CellValue.SHIP missing ship');
      if (cell.shipPos === undefined)
        throw Error('Cell with CellValue.SHIP missing ship position');
      cell.ship.hit(cell.shipPos);
      return AttackResult.HIT;
    }
    return AttackResult.MISS;
  }

  public allShipsSunk(): boolean {
    return this._ships.reduce(
      (allSunk, ship) => allSunk && ship.isSunk(),
      true,
    );
  }

  private _isValidPlacement(placement: Placement): boolean {
    const { start, shipLength, direction } = placement;
    const startValid = this._isValidCoordinate(start);
    const endValid =
      direction === Direction.DOWN
        ? this._isValidCoordinate({ x: start.x, y: start.y + shipLength - 1 })
        : this._isValidCoordinate({ x: start.x + shipLength - 1, y: start.y });

    return startValid && endValid;
  }

  private _isValidCoordinate(coord: Coordinate) {
    return (
      coord.x >= 0 && coord.y >= 0 && coord.x < this.size && coord.y < this.size
    );
  }
}

export interface Coordinate {
  x: number;
  y: number;
}

export enum Direction {
  DOWN,
  RIGHT,
}

export enum CellValue {
  EMPTY,
  SHIP,
}

export enum AttackResult {
  HIT = 'Hit',
  MISS = 'Miss',
  INVALID_ATTACK = 'Invalid attack',
}

export interface Placement {
  start: Coordinate;
  shipLength: number;
  direction: Direction;
}

export interface Cell {
  cellValue: CellValue;
  ship?: Ship;
  shipPos?: number;
}

export default Gameboard;
