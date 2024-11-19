<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import Gameboard, { CellValue, Direction } from './GameBoard'

const props = defineProps(['socket'])
const { socket } = props;

onMounted(() => {
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space' && onBoard) {
      //change direction
      onHoverLeave(lastHoveredCoords)
      gb.changeDirection();
      onHover(lastHoveredCoords)
    }
  })
})

const gb = new Gameboard({ socket });
const board = gb.board;

const gameStarted = false
let onBoard = false
let lastHoveredCoords: Coordinate | null = null

function placeShip({ x, y }: Coordinate) {
  if (!gameStarted) {
    gb.placeShip({ x, y });
  }
}

function onHover({ x, y }: Coordinate) {
  if (!gameStarted && gb.curShip) {
    lastHoveredCoords = { x, y }
    if (gb.isValidPlacement({ start: { x, y }, shipLength: gb.curShip.len, direction: gb.direction })) {
      for (let i = 0; i < gb.curShip.len; ++i) {
        if (gb.direction === Direction.DOWN) board.value[y + i][x] = CellValue.HOVER
        else board.value[y][x + i] = CellValue.HOVER
      }
    }
  }
}

function onHoverLeave({ x, y }: Coordinate) {
  if (!gameStarted && gb.curShip) {
    if (gb.isValidPlacement({ start: { x, y }, shipLength: gb.curShip.len, direction: gb.direction })) {
      for (let i = 0; i < gb.curShip.len; ++i) {
        if (gb.direction === Direction.DOWN) board.value[y + i][x] = CellValue.EMPTY
        else board.value[y][x + i] = CellValue.EMPTY
      }
    }
  }
}
</script>

<template>
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
