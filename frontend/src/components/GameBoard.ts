import Ships, { Ship } from './Ships'
import { Socket } from 'socket.io-client'
import type { Ref } from 'vue'
import { ref } from 'vue'

class Gameboard {
  board: Ref<CellValue[][]>;
  readonly size: number
  private _ships = new Ships()
  private _socket: Socket
  private _direction: Direction

  constructor({ size = 10, socket }: { size: number; socket: Socket }) {
    this.size = size
    this.board = ref(Array(size)
      .fill(null)
      .map((_) => new Array(size).fill(CellValue.EMPTY)));
    this._socket = socket
    this._direction = Direction.DOWN
  }

  get direction(): Direction {
    return this._direction;
  }

  public changeDirection() {
    this._direction = this._direction === Direction.DOWN ? Direction.RIGHT : Direction.DOWN
  }

  get curShip(): Ship | null {
    return this._ships.curShip;
  }

  public placeShip({ x, y }: Coordinate) {
    if (
      this._ships.curShip &&
      this.isValidPlacement({
        start: { x, y },
        shipLength: this._ships.curShip.len,
        direction: this._direction,
      })
    ) {
      this._socket.emit('place ship', { coord: { x, y } })

      for (let i = 0; i < this._ships.curShip.len; ++i) {
        if (this._direction === Direction.DOWN) this.board.value[y + i][x] = CellValue.SHIP
        else this.board.value[y][x + i] = CellValue.SHIP
      }
      this._ships.next()
    }
  }

  public isValidPlacement(placement: Placement): boolean {
    const { start, shipLength, direction } = placement

    let valid = true
    for (let i = 0; i < shipLength; ++i) {
      if (direction === Direction.DOWN)
        valid &&= this._isValidEmptyCoordinate({ x: start.x, y: start.y + i })
      else valid &&= this._isValidEmptyCoordinate({ x: start.x + i, y: start.y })
    }
    return valid
  }

  private _isValidCoordinate({ x, y }: Coordinate) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size
  }

  private _isValidEmptyCoordinate({ x, y }: Coordinate) {
    if (!this._isValidCoordinate({ x, y })) return false
    const cellValue = this.board.value[y][x]
    return cellValue === CellValue.EMPTY || cellValue === CellValue.HOVER
  }
}

export interface Coordinate {
  x: number
  y: number
}

export enum Direction {
  DOWN,
  RIGHT,
}

export enum CellValue {
  EMPTY = 'E',
  SHIP = 'S', //non-hit ship
  HIT = 'H',
  MISS = 'M',
  HOVER = '-',
}

export interface Placement {
  start: Coordinate
  shipLength: number
  direction: Direction
}

export default Gameboard
