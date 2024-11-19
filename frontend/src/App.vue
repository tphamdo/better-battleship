<script setup lang="ts">
import GameBoard from './components/GameBoard.vue';
import { ref } from 'vue';
import { io } from 'socket.io-client'

const connected = ref(false);
const socket = io('http://localhost:3000/')
socket.on('connect', () => {
  console.log('connected with', socket.id);
  connected.value = true;
});
socket.on('disconnect', (reason) => {
  console.log('disconnected with reason', reason);
  connected.value = false;
});
</script>

<template>
  <main>
    <template v-if="connected">
      <GameBoard :socket="socket" />
    </template>
    <template v-else>
      <p>Connecting...</p>
    </template>
  </main>
</template>

<style scoped></style>
