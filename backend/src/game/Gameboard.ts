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
    if (!this._isValidPlacement(placement))
      throw Error('Not a valid placement');
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
        this._board[start.y + i][start.x] = cell;
      else if (direction === Direction.RIGHT)
        this._board[start.y][start.x + i] = cell;
    }
  }

  public receiveAttack({ x, y }: Coordinate): AttackResult {
    if (!this._isValidCoordinate({ x, y })) return AttackResult.INVALID_ATTACK;
    const cell = this._board[y][x];
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
    let valid = true;
    for (let i = 0; i < shipLength; ++i) {
      if (direction === Direction.DOWN)
        valid &&= this._isValidEmptyCoordinate({ x: start.x, y: start.y + i });
      else
        valid &&= this._isValidEmptyCoordinate({ x: start.x + i, y: start.y });
    }
    return valid;
  }

  private _isValidEmptyCoordinate({ x, y }: Coordinate): boolean {
    if (!this._isValidCoordinate({ x, y })) return false;
    return this._board[y][x].cellValue === CellValue.EMPTY;
  }

  private _isValidCoordinate({ x, y }: Coordinate) {
    return (
      x >= 0 && y >= 0 && x < this.size && y < this.size
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
