<script setup lang="ts">
import { ref } from 'vue'
import { io } from 'socket.io-client'
import { onMounted } from 'vue';

onMounted(() => {
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space' && onBoard) {
      //change direction
      onHoverLeave(lastHoveredCoords);
      direction = direction === Direction.DOWN ? Direction.RIGHT : Direction.DOWN;
      onHover(lastHoveredCoords);
    }
  });
});

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
const socket = io('http://localhost:3000/')
const gameStarted = false
let direction = Direction.DOWN
let onBoard = false;
let lastHoveredCoords: Coordinate | null = null;

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
    if (direction === Direction.DOWN) valid &= isEmptyCoordinate({ x: start.x, y: start.y + i })
    // Direction.RIGHT
    else valid &= isEmptyCoordinate({ x: start.x + i, y: start.y })
  }
  return valid
}

function isValidCoordinate({ x, y }: Coordinate) {
  return x >= 0 && y >= 0 && x < COLS && y < ROWS
}

function isEmptyCoordinate({ x, y }: Coordinate) {
  if (!isValidCoordinate({ x, y })) return false
  const cellValue = board.value[y][x]
  return cellValue === CellValue.EMPTY || cellValue === CellValue.HOVER
}

function onCellClick({ x, y }: Coordinate) {
  if (!gameStarted) {
    socket.emit('place ship', { coord: { x, y } })
  }
}

function onHover({ x, y }: Coordinate) {
  if (!gameStarted) {
    lastHoveredCoords = { x, y };
    const shipLength = 5
    if (isValidPlacement({ start: { x, y }, shipLength, direction })) {
      for (let i = 0; i < shipLength; ++i) {
        if (direction === Direction.DOWN) board.value[y + i][x] = CellValue.HOVER
        else board.value[y][x + i] = CellValue.HOVER
      }
    }
  }
}

function onHoverLeave({ x, y }: Coordinate) {
  if (!gameStarted) {
    const shipLength = 5
    if (isValidPlacement({ start: { x, y }, shipLength, direction })) {
      for (let i = 0; i < shipLength; ++i) {
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
        <div :class="{ hovered: board[y][x] === CellValue.HOVER }" @click="onCellClick({ x, y })"
          @mouseover="onHover({ x, y })" @mouseleave="onHoverLeave({ x, y })" class="cell">
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
</style>
