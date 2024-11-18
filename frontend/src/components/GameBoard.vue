<script setup lang="ts">
import { ref } from 'vue'
import { io } from "socket.io-client";

enum CellValue {
  EMPTY = 'E',
  HIT = 'H',
  MISS = 'M',
}

const ROWS = 10;
const COLS = ROWS;
const board = ref(Array(ROWS).fill(null).map(() => Array(COLS).fill(CellValue.EMPTY)));
const socket = io('http://localhost:3000/');

function onCellClick(i, j) {
  console.log(i, j);
  socket.emit('cell click', { coord: { x: i, y: j } });
}
</script>

<template>
  <table class="board">
    <tr v-for="(row, i) in board" :key="i">
      <td class="table-success" v-for="(col, j) in row" :key="j">
        <div @click="onCellClick(i, j)" class="cell">
          {{ board[i][j] }}
        </div>
      </td>
    </tr>
  </table>
  <h1>Hello</h1>
</template>

<style scoped>
.board {
  width: 100%;
  min-width: 300px;
  aspect-ratio: 1 / 1;
  border: 1px solid blue;
  border-collapse: collapse;
}

@media screen and (min-width: 600px) {
  .board {
    width: 500px;
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
</style>
