<script setup lang="ts">
import { ref } from 'vue'
import { io } from 'socket.io-client'
import { onMounted } from 'vue'

onMounted(() => {
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space' && onBoard) {
      //change direction
      onHoverLeave(lastHoveredCoords)
      direction = direction === Direction.DOWN ? Direction.RIGHT : Direction.DOWN
      onHover(lastHoveredCoords)
    }
  })
})

enum CellValue {
  EMPTY = 'E',
  SHIP = 'S', //non-hit ship
  HIT = 'H',
  MISS = 'M',
  HOVER = '-',
}

const ROWS = 10
const COLS = ROWS
const board = ref(
  Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(CellValue.EMPTY)),
)

class Ship {
  readonly len: number;
  constructor(len: number) {
    this.len = len;
  }
}

class Ships {
  private static _SHIPS: Ship[] = [
    new Ship(5),
    new Ship(4),
    new Ship(3),
    new Ship(3),
    new Ship(2),
  ];
  private static _idx = 0;

  public static get curShip(): Ship | null {
    console.log('inside');
    console.log(this._SHIPS);
    console.log(this._SHIPS[0]);
    console.log(this._idx);
    if (this._idx >= this._SHIPS.length) return null;
    return this._SHIPS[this._idx];
  }

  public static next() {
    ++this._idx;
  }

  // static class
  private constructor() { }
}


console.log(Ships.curShip);
const socket = io('http://localhost:3000/')
const gameStarted = false
let direction = Direction.DOWN
let onBoard = false
let lastHoveredCoords: Coordinate | null = null

interface Coordinate {
  x: number
  y: number
}

enum Direction {
  DOWN,
  RIGHT,
}

interface Placement {
  start: Coordinate
  shipLength: number
  direction: Direction
}

function isValidPlacement(placement: Placement): boolean {
  const { start, shipLength, direction } = placement

  let valid = true
  for (let i = 0; i < shipLength; ++i) {
    if (direction === Direction.DOWN) valid &= isValidEmptyCoordinate({ x: start.x, y: start.y + i })
    else valid &= isValidEmptyCoordinate({ x: start.x + i, y: start.y })
  }
  return valid
}

function isValidCoordinate({ x, y }: Coordinate) {
  return x >= 0 && y >= 0 && x < COLS && y < ROWS
}

function isValidEmptyCoordinate({ x, y }: Coordinate) {
  if (!isValidCoordinate({ x, y })) return false
  const cellValue = board.value[y][x]
  return cellValue === CellValue.EMPTY || cellValue === CellValue.HOVER
}

function placeShip({ x, y }: Coordinate) {
  if (!gameStarted && Ships.curShip) {
    if (isValidPlacement({ start: { x, y }, shipLength: Ships.curShip.len, direction })) {
      socket.emit('place ship', { coord: { x, y } })

      for (let i = 0; i < Ships.curShip.len; ++i) {
        if (direction === Direction.DOWN) board.value[y + i][x] = CellValue.SHIP;
        else board.value[y][x + i] = CellValue.SHIP;
      }

      console.log('next');
      Ships.next();
    }
  }
}

function onHover({ x, y }: Coordinate) {
  if (!gameStarted && Ships.curShip) {
    lastHoveredCoords = { x, y }
    if (isValidPlacement({ start: { x, y }, shipLength: Ships.curShip.len, direction })) {
      for (let i = 0; i < Ships.curShip.len; ++i) {
        if (direction === Direction.DOWN) board.value[y + i][x] = CellValue.HOVER
        else board.value[y][x + i] = CellValue.HOVER
      }
    }
  }
}

function onHoverLeave({ x, y }: Coordinate) {
  if (!gameStarted && Ships.curShip) {
    if (isValidPlacement({ start: { x, y }, shipLength: Ships.curShip.len, direction })) {
      for (let i = 0; i < Ships.curShip.len; ++i) {
        if (direction === Direction.DOWN) board.value[y + i][x] = CellValue.EMPTY
        else board.value[y][x + i] = CellValue.EMPTY
      }
    }
  }
}
</script>

<template>
  <button @keyup.space="changeDirection">Change Direction</button>
  <table class="board" @mouseover="onBoard = true" @mouseleave="onBoard = false">
    <tr v-for="(row, y) in board" :key="y">
      <td class="table-success" v-for="(col, x) in row" :key="x">
        <div :class="{ hovered: board[y][x] === CellValue.HOVER, ship: board[y][x] === CellValue.SHIP }"
          @click="placeShip({ x, y })" @mouseover="onHover({ x, y })" @mouseleave="onHoverLeave({ x, y })" class="cell">
          {{ board[y][x] }}
        </div>
      </td>
    </tr>
  </table>
</template>

<style scoped>
.board {
  width: 100%;
  min-width: 300px;
  aspect-ratio: 1 / 1;
  border: 1px solid blue;
  border-collapse: collapse;
}

@media screen and (min-width: 400px) {
  .board {
    width: 400px;
  }
}

td {
  padding: 0;
  margin: 0;
  border: 1px solid black;
}

.cell {
  aspect-ratio: 1 / 1;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hovered {
  background-color: blue;
}

.ship {
  background-color: red;
}
</style>
